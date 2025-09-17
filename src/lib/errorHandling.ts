// Enhanced Error Handling for Railway Database Operations
import { log } from './logger';

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  statusCode?: number;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
  success: boolean;
}

// Enhanced error classification and user-friendly messages
export const classifyDatabaseError = (error: any): DatabaseError => {
  // PostgreSQL error codes and their user-friendly messages
  const errorMappings: Record<string, string> = {
    '23505': 'This record already exists. Please check for duplicates.',
    '23503': 'Referenced record not found. Please check related data.',
    '23502': 'Required field is missing. Please fill in all required information.',
    '42P01': 'Database table not found. Please check your database setup.',
    '42703': 'Database field not found. Please check your database schema.',
    '28P01': 'Database authentication failed. Please check your credentials.',
    '3D000': 'Database not found. Please check your connection settings.',
    '08006': 'Database connection failed. Please check your network connection.',
    '53300': 'Database is currently unavailable. Please try again later.',
  };

  // Extract error information
  const message = error?.message || 'An unknown database error occurred';
  const code = error?.code || error?.error_code || 'UNKNOWN';
  const details = error?.details || error?.detail || '';
  const hint = error?.hint || '';

  // Connection and network errors
  if (message.includes('fetch') || message.includes('network') || message.includes('ENOTFOUND')) {
    return {
      message: 'Unable to connect to the database. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR',
      details: message,
    };
  }

  // Environment configuration errors
  if (message.includes('environment') || message.includes('DATABASE_URL')) {
    return {
      message: 'Database configuration error. Please check your environment settings.',
      code: 'CONFIG_ERROR',
      details: message,
    };
  }

  // Use mapped message if available, otherwise use original message
  const userMessage = errorMappings[code] || message;

  return {
    message: userMessage,
    code,
    details,
    hint,
  };
};

// Retry logic for database operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on certain error types
      const classified = classifyDatabaseError(error);
      const nonRetryableCodes = ['23505', '23503', '23502', '42P01', '42703', 'CONFIG_ERROR'];

      if (nonRetryableCodes.includes(classified.code || '')) {
        throw error;
      }

      if (attempt < maxRetries) {
        log.warn(`Database operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`, classified);
        await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
      }
    }
  }

  throw lastError;
};

// Wrapper for database operations with enhanced error handling
export const safeDbOperation = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  operationName: string = 'Database operation'
): Promise<DatabaseResponse<T>> => {
  try {
    log.debug(`Starting ${operationName}`);

    const result = await withRetry(operation);

    if (result.error) {
      const classifiedError = classifyDatabaseError(result.error);
      log.error(`${operationName} failed:`, classifiedError);

      return {
        data: null,
        error: classifiedError,
        success: false,
      };
    }

    log.debug(`${operationName} completed successfully`);

    return {
      data: result.data,
      error: null,
      success: true,
    };
  } catch (error) {
    const classifiedError = classifyDatabaseError(error);
    log.error(`${operationName} failed with exception:`, classifiedError);

    return {
      data: null,
      error: classifiedError,
      success: false,
    };
  }
};

// Connection status monitoring
export class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private isConnected: boolean = true;
  private lastCheckTime: number = 0;
  private checkInterval: number = 30000; // 30 seconds
  private listeners: Array<(connected: boolean) => void> = [];

  static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(connected: boolean): void {
    if (this.isConnected !== connected) {
      this.isConnected = connected;
      this.listeners.forEach(listener => listener(connected));

      if (connected) {
        log.info('Database connection restored');
      } else {
        log.warn('Database connection lost');
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    const now = Date.now();

    // Throttle connection checks
    if (now - this.lastCheckTime < this.checkInterval) {
      return this.isConnected;
    }

    this.lastCheckTime = now;

    try {
      // Import here to avoid circular dependencies
      const { checkDatabaseConnection } = await import('./database');
      const result = await checkDatabaseConnection();

      this.notifyListeners(result.connected);
      return result.connected;
    } catch (error) {
      log.error('Connection check failed:', error);
      this.notifyListeners(false);
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Enhanced logging for database operations
export const logDatabaseOperation = (
  operation: string,
  table: string,
  filters?: Record<string, any>,
  duration?: number
): void => {
  const logData = {
    operation,
    table,
    filters,
    duration,
    timestamp: new Date().toISOString(),
  };

  if (duration !== undefined) {
    if (duration > 5000) {
      log.warn('Slow database query detected:', logData);
    } else {
      log.debug('Database operation:', logData);
    }
  } else {
    log.debug('Database operation started:', logData);
  }
};