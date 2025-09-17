// Supabase Client Configuration for ESPN-style Golf Data
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Get environment variables with validation
const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check if we have valid Supabase credentials
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl === 'https://your-project-ref.supabase.co' ||
      supabaseAnonKey === 'your-anon-key') {
    console.warn(
      '⚠️ Supabase credentials not configured. Running in demo mode.\n' +
      'To connect to real database, update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
    );

    // Return demo/mock credentials
    return {
      url: 'https://demo.supabase.co',
      key: 'demo-key',
      isDemo: true
    };
  }

  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
    isDemo: false
  };
};

const config = getSupabaseConfig();

// Create Supabase client with type safety
export const supabaseClient = createClient(config.url, config.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'golfgod-mini'
    }
  }
});

// Export configuration status
export const isDemoMode = config.isDemo;

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  isDemo: boolean;
  error?: string;
}> => {
  if (isDemoMode) {
    return {
      connected: false,
      isDemo: true,
      error: 'Running in demo mode - no database connected'
    };
  }

  try {
    // Try a simple query to test connection
    const { error } = await supabaseClient
      .from('players')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return {
        connected: false,
        isDemo: false,
        error: error.message
      };
    }

    return {
      connected: true,
      isDemo: false
    };
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return {
      connected: false,
      isDemo: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

// Type-safe query helpers
export const supabaseQueries = {
  // Get player by ESPN ID
  async getPlayerByEspnId(espnId: number) {
    return supabaseClient
      .from('players')
      .select('*')
      .eq('espn_id', espnId)
      .single();
  },

  // Get player tournaments for a season
  async getPlayerTournaments(playerId: number, season: number) {
    return supabaseClient
      .from('player_tournament_results_espn')
      .select('*')
      .eq('player_id', playerId)
      .eq('year', season)
      .order('start_date', { ascending: true });
  },

  // Get available seasons for a player
  async getPlayerSeasons(playerId: number) {
    return supabaseClient
      .from('player_available_years')
      .select('year')
      .eq('player_id', playerId)
      .order('year', { ascending: false });
  },

  // Get season summary for a player
  async getPlayerSeasonSummary(playerId: number, season: number) {
    return supabaseClient
      .from('player_season_summary')
      .select('*')
      .eq('player_id', playerId)
      .eq('season', season)
      .single();
  },

  // Get recent tournaments
  async getRecentTournaments(limit = 10) {
    return supabaseClient
      .from('recent_tournaments')
      .select('*')
      .limit(limit);
  }
};

export default supabaseClient;