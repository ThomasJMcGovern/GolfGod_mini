import { supabase } from "./supabase";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: any;
  timestamp: string;
}

class Logger {
  private enableDbLogging: boolean;
  private logQueue: LogEntry[] = [];
  private isFlashing = false;

  constructor() {
    this.enableDbLogging = import.meta.env.VITE_ENABLE_DB_LOGGING === "true";
  }

  private async flushToDatabase() {
    if (!this.enableDbLogging || this.isFlashing || this.logQueue.length === 0) {
      return;
    }

    this.isFlashing = true;
    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    try {
      const { error } = await supabase.from("client_log").insert(
        logsToFlush.map((log) => ({
          level: log.level,
          message: log.message,
          meta: log.meta,
          created_at: log.timestamp,
        }))
      );

      if (error) {
        console.error("Failed to write logs to database:", error);
        // Re-queue logs on failure
        this.logQueue = [...logsToFlush, ...this.logQueue];
      }
    } catch (error) {
      console.error("Error flushing logs:", error);
    } finally {
      this.isFlashing = false;
    }
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    
    // Always log to console
    const consoleMethod = level === "debug" ? "log" : level;
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, meta || "");

    // Queue for database if enabled
    if (this.enableDbLogging) {
      this.logQueue.push({ level, message, meta, timestamp });
      // Flush in next tick to batch logs
      setTimeout(() => this.flushToDatabase(), 0);
    }
  }

  debug(message: string, meta?: any) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: any) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: any) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: any) {
    this.log("error", message, meta);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, meta?: any) => logger.error(message, meta),
};