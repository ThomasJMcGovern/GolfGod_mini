import { z } from "zod";

// =====================================================
// SIMPLIFIED TYPES FOR FRESH SCHEMA
// =====================================================

// Player schema
export const PlayerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  country: z.string().nullable().optional(),
  turned_pro: z.number().nullable().optional(),
  world_ranking: z.number().nullable().optional(),
  fedex_ranking: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;

// Tournament schema
export const TournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  course_name: z.string().nullable().optional(),
  course_location: z.string().nullable().optional(),
  purse: z.number().nullable().optional(),
  field_size: z.number().nullable().optional(),
  status: z.enum(['upcoming', 'current', 'completed']).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Tournament = z.infer<typeof TournamentSchema>;

// Tournament Result schema
export const TournamentResultSchema = z.object({
  id: z.number(),
  tournament_id: z.number(),
  player_id: z.number(),
  position: z.string().nullable().optional(), // "1", "T2", "CUT", etc
  total_score: z.number().nullable().optional(),
  score_to_par: z.number().nullable().optional(),
  rounds: z.any().nullable().optional(), // JSONB - can be array or object
  earnings: z.number().nullable().optional(),
  fedex_points: z.number().nullable().optional(),
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
// VIEW TYPES (for the database views we created)
// =====================================================

// Leaderboard entry (from current_leaderboard view)
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

// Player form entry (from player_recent_form view)
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