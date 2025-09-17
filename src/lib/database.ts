// Database Configuration for Railway PostgreSQL
import { createClient } from '@supabase/supabase-js';
import { log } from './logger';

// Environment variables validation
const validateEnvironment = () => {
  // Check for environment variables - use import.meta.env for Vite
  const requiredVars = {
    DATABASE_URL: import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL,
    DIRECT_URL: import.meta.env.VITE_DIRECT_URL || import.meta.env.DIRECT_URL,
  };

  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(
      `Missing database environment variables: ${missing.join(', ')}\n` +
      'Running in mock data mode. To use real database, copy .env.sample to .env.local and configure your Railway database credentials.'
    );
    // Return null to indicate mock mode
    return null;
  }

  return requiredVars;
};

// Database connection configuration
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const initializeDatabase = () => {
  try {
    const env = validateEnvironment();

    // If no environment variables, return a mock client
    if (!env) {
      // Create a mock Supabase client that will fail gracefully
      const mockUrl = 'https://mock.supabase.co';
      const mockKey = 'mock-anon-key';

      supabaseClient = createClient(mockUrl, mockKey, {
        auth: {
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-application-name': 'golfgod-mini-mock',
          },
        },
      });

      console.info('Running in mock data mode (no database configured)');
      return supabaseClient;
    }

    // Extract URL components for Supabase client
    // Railway provides full PostgreSQL URLs, we need to parse them for Supabase
    const databaseUrl = env.DATABASE_URL!;

    // For Railway PostgreSQL, we can use the DATABASE_URL directly
    // Supabase client can work with any PostgreSQL database
    const supabaseUrl = databaseUrl.replace('postgresql://', 'postgres://');

    // For Railway, we don't need an anon key (using direct database connection)
    // We'll use a placeholder since Supabase client requires it
    const supabaseAnonKey = 'railway-direct-connection';

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable auth for direct database connection
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'golfgod-mini',
        },
      },
    });

    log.info('Database connection initialized successfully');
    return supabaseClient;
  } catch (error) {
    log.error('Failed to initialize database connection:', error);
    // Return a mock client instead of throwing
    const mockUrl = 'https://mock.supabase.co';
    const mockKey = 'mock-anon-key';

    supabaseClient = createClient(mockUrl, mockKey, {
      auth: {
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'golfgod-mini-fallback',
        },
      },
    });

    return supabaseClient;
  }
};

// Get database client (lazy initialization)
export const getDatabase = () => {
  if (!supabaseClient) {
    return initializeDatabase();
  }
  return supabaseClient;
};

// Connection health check
export const checkDatabaseConnection = async (): Promise<{
  connected: boolean;
  latency: number;
  error?: string;
}> => {
  const start = Date.now();

  try {
    const client = getDatabase();

    // Simple query to test connection
    const { error } = await client
      .from('players')
      .select('id')
      .limit(1);

    const latency = Date.now() - start;

    if (error) {
      log.error('Database health check failed:', error);
      return {
        connected: false,
        latency,
        error: error.message,
      };
    }

    log.debug(`Database connection healthy (${latency}ms)`);
    return {
      connected: true,
      latency,
    };
  } catch (error) {
    const latency = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);

    log.error('Database health check failed:', error);
    return {
      connected: false,
      latency,
      error: errorMessage,
    };
  }
};

// Export the client getter as default
export default getDatabase;