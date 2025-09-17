import { z } from "zod";

// =====================================================
// ESPN-ENHANCED SCHEMA TYPES
// =====================================================

// Enhanced Player schema (ESPN-style profile)
export const PlayerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  country: z.string().nullable().optional(),
  turned_pro: z.number().nullable().optional(),
  world_ranking: z.number().nullable().optional(),
  fedex_ranking: z.number().nullable().optional(),
  // ESPN-style profile fields
  birthdate: z.string().nullable().optional(),
  birthplace: z.string().nullable().optional(),
  college: z.string().nullable().optional(),
  swing_type: z.enum(['Right', 'Left']).nullable().optional(),
  height: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  photo_url: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;

// Enhanced Tournament schema (with tour classification)
export const TournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  course_name: z.string().nullable().optional(),
  course_name_display: z.string().nullable().optional(),
  course_location: z.string().nullable().optional(),
  purse: z.number().nullable().optional(),
  field_size: z.number().nullable().optional(),
  status: z.enum(['upcoming', 'current', 'completed']).nullable().optional(),
  // ESPN-style tournament fields
  tour_type: z.string().nullable().optional(), // PGA_TOUR, OLYMPICS, etc
  year: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Tournament = z.infer<typeof TournamentSchema>;

// Enhanced Tournament Result schema (ESPN format)
export const TournamentResultSchema = z.object({
  id: z.number(),
  tournament_id: z.number(),
  player_id: z.number(),
  position: z.string().nullable().optional(), // "1", "T2", "CUT", etc
  total_score: z.number().nullable().optional(),
  score_to_par: z.number().nullable().optional(),
  rounds: z.any().nullable().optional(), // JSONB - can be array or object
  rounds_detail: z.any().nullable().optional(), // Individual round scores
  earnings: z.number().nullable().optional(),
  fedex_points: z.number().nullable().optional(),
  // ESPN-style result fields
  year: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type TournamentResult = z.infer<typeof TournamentResultSchema>;

// Player Stats schema
export const PlayerStatsSchema = z.object({
  id: z.number(),
  player_id: z.number(),
  season: z.number(),
  events_played: z.number().nullable().optional(),
  wins: z.number().nullable().optional(),
  top_10s: z.number().nullable().optional(),
  top_25s: z.number().nullable().optional(),
  cuts_made: z.number().nullable().optional(),
  cuts_missed: z.number().nullable().optional(),
  scoring_avg: z.number().nullable().optional(),
  driving_distance: z.number().nullable().optional(),
  driving_accuracy: z.number().nullable().optional(),
  gir_percentage: z.number().nullable().optional(),
  putts_per_round: z.number().nullable().optional(),
  scrambling: z.number().nullable().optional(),
  total_earnings: z.number().nullable().optional(),
  fedex_cup_points: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type PlayerStats = z.infer<typeof PlayerStatsSchema>;

// =====================================================
// SUPABASE DATABASE TYPES
// =====================================================

// Import Supabase database types
export type {
  Player as SupabasePlayer,
  Tournament as SupabaseTournament,
  PlayerTournament as SupabasePlayerTournament,
  TournamentRound as SupabaseTournamentRound,
  ESPNTournamentResult as SupabaseESPNResult,
  PlayerSeasonSummary,
  RecentTournament
} from './types/database.types';

// =====================================================
// ESPN-STYLE VIEW TYPES (for the database views)
// =====================================================

// ESPN-style player tournament results (from player_tournament_results_espn view)
export interface ESPNPlayerTournamentResult {
  player_id: number;
  player_name: string;
  country?: string;
  photo_url?: string;
  year: number;
  tour_type: string;
  start_date: string;
  end_date: string;
  tournament_name: string;
  course_name?: string;
  course_location?: string;
  position?: string;
  total_score?: number;
  score_to_par?: number;
  earnings?: number;
  rounds?: any;
  rounds_detail?: any;
  date_range: string; // "1/30 - 2/2"
  score_display?: string; // "273 (-15)"
}

// Complete player profile (from player_profiles_complete view)
export interface PlayerProfile {
  id: number;
  full_name: string;
  country?: string;
  turned_pro?: number;
  world_ranking?: number;
  fedex_ranking?: number;
  birthdate?: string;
  birthplace?: string;
  college?: string;
  swing_type?: 'Right' | 'Left';
  height?: string;
  weight?: string;
  photo_url?: string;
  age?: number;
  tournaments_last_year: number;
  career_earnings: number;
  career_wins: number;
  created_at?: string;
  updated_at?: string;
}

// Tournament results grouped by tour type (for ESPN display)
export interface TournamentResultsByTour {
  tourType: string;
  displayName: string; // "2025 PGA TOUR Tournaments"
  results: ESPNPlayerTournamentResult[];
}

// Legacy view types (keeping for backwards compatibility)
export interface LeaderboardEntry {
  tournament_name: string;
  start_date: string;
  player_name: string;
  country?: string;
  position?: string;
  score_to_par?: number;
  total_score?: number;
  rounds?: any;
  earnings?: number;
}

export interface PlayerFormEntry {
  player_id: number;
  full_name: string;
  tournament_name: string;
  start_date: string;
  position?: string;
  score_to_par?: number;
}

// =====================================================
// LEGACY TYPES (keeping for backwards compatibility)
// These match the old schema and will be removed later
// =====================================================

// Old Round schema (keeping temporarily for existing code)
export const RoundSchema = z.object({
  id: z.number(),
  tournament_id: z.number(),
  player_id: z.number(),
  round_no: z.number().min(1).max(4),
  wave: z.enum(["AM", "PM"]).nullable().optional(),
  score_to_par: z.number().nullable().optional(),
  sg_app: z.number().nullable().optional(),
  putts: z.number().nullable().optional(),
  fairways_hit: z.number().nullable().optional(),
  fairways_total: z.number().nullable().optional(),
  wind_mph: z.number().nullable().optional(),
  created_at: z.string().optional(),
});

export type Round = z.infer<typeof RoundSchema>;

// =====================================================
// APP UTILITY TYPES
// =====================================================

// Computed metrics types
export interface BasicMetrics {
  sgAppAvg: number | null;
  puttsAvg: number | null;
  fairwaysPct: number | null;
}

export interface WindSplit {
  delta: number | null;
  sampleWindy: number;
  sampleCalm: number;
}

export interface WaveSplit {
  delta: number | null;
  sampleAM: number;
  samplePM: number;
}

// API response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Export data types
export interface ExportData {
  player: string;
  tournament: string;
  metrics: BasicMetrics;
  windSplit: WindSplit;
  waveSplit: WaveSplit;
  rounds: Round[];
}