// Supabase Database Types - ESPN-Compatible Structure
// Auto-generated types would normally come from Supabase CLI
// These match our ESPN-style schema

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: number;
          name: string;
          espn_id: number | null;
          country: string | null;
          birthdate: string | null;
          birthplace: string | null;
          college: string | null;
          swing_type: 'Right' | 'Left' | null;
          height: string | null;
          weight: string | null;
          turned_pro: number | null;
          world_ranking: number | null;
          fedex_ranking: number | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['players']['Insert']>;
      };

      tournaments: {
        Row: {
          id: number;
          espn_tournament_id: number | null;
          name: string;
          season: number;
          start_date: string | null;
          end_date: string | null;
          course_name: string | null;
          venue: string | null;
          tour_type: string;
          purse: number | null;
          field_size: number | null;
          status: string;
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tournaments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tournaments']['Insert']>;
      };

      player_tournaments: {
        Row: {
          id: number;
          player_id: number;
          tournament_id: number;
          season: number;
          date_range: string | null;
          tournament_name: string;
          course_name: string | null;
          venue: string | null;
          position: string | null;
          position_numeric: number | null;
          is_tied: boolean;
          overall_score: string | null;
          total_score: number | null;
          score_to_par: number | null;
          earnings_usd: number | null;
          earnings_display: string | null;
          fedex_points: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['player_tournaments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['player_tournaments']['Insert']>;
      };

      tournament_rounds: {
        Row: {
          id: number;
          player_tournament_id: number;
          round_number: number;
          score: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tournament_rounds']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tournament_rounds']['Insert']>;
      };
    };

    Views: {
      player_tournament_results_espn: {
        Row: {
          id: number;
          player_id: number;
          tournament_id: number;
          year: number;
          date_range: string | null;
          tournament_name: string;
          course_name: string | null;
          position: string | null;
          position_numeric: number | null;
          is_tied: boolean;
          overall_score: string | null;
          total_score: number | null;
          score_to_par: number | null;
          earnings: number | null;
          earnings_display: string | null;
          status: string;
          tour_type: string;
          start_date: string | null;
          end_date: string | null;
          tournament_url: string | null;
          rounds: number[] | null;
          rounds_detail: any | null;
          score_display: string | null;
        };
      };

      player_season_summary: {
        Row: {
          player_id: number;
          name: string;
          espn_id: number | null;
          season: number;
          tournaments_played: number;
          wins: number;
          top_10s: number;
          top_25s: number;
          cuts_made: number;
          cuts_missed: number;
          total_earnings: number | null;
          total_fedex_points: number | null;
          avg_score_to_par: number | null;
        };
      };

      recent_tournaments: {
        Row: {
          id: number;
          tournament_name: string;
          venue: string | null;
          course_name: string | null;
          season: number;
          start_date: string | null;
          end_date: string | null;
          tour_type: string;
          field_size: number;
          winner_earnings: number | null;
          winner_name: string | null;
        };
      };

      player_available_years: {
        Row: {
          player_id: number;
          year: number;
        };
      };
    };
  };
}

// ESPN-specific type exports
export type Player = Database['public']['Tables']['players']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type PlayerTournament = Database['public']['Tables']['player_tournaments']['Row'];
export type TournamentRound = Database['public']['Tables']['tournament_rounds']['Row'];

// View types
export type ESPNTournamentResult = Database['public']['Views']['player_tournament_results_espn']['Row'];
export type PlayerSeasonSummary = Database['public']['Views']['player_season_summary']['Row'];
export type RecentTournament = Database['public']['Views']['recent_tournaments']['Row'];

// Helper types for the app
export interface PlayerWithStats extends Player {
  season_summary?: PlayerSeasonSummary;
}

export interface TournamentWithResults extends Tournament {
  results?: PlayerTournament[];
}