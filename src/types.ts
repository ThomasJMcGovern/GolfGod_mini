import { z } from "zod";

// Database schema types with Zod validation
export const PlayerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  handedness: z.enum(["R", "L"]).default("R"),
});

export const TournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.string().nullable(),
  course: z.string().nullable(),
});

export const RoundSchema = z.object({
  id: z.number(),
  tournament_id: z.number(),
  player_id: z.number(),
  round_no: z.number().min(1).max(4),
  wave: z.enum(["AM", "PM"]),
  score_to_par: z.number().nullable(),
  sg_app: z.number().nullable(),
  putts: z.number().nullable(),
  fairways_hit: z.number().nullable(),
  fairways_total: z.number().nullable(),
  wind_mph: z.number().nullable(),
});

// Type exports
export type Player = z.infer<typeof PlayerSchema>;
export type Tournament = z.infer<typeof TournamentSchema>;
export type Round = z.infer<typeof RoundSchema>;

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