import { z } from "zod";

// =====================================================
// ESPN ENHANCED PLAYER STATS TYPES
// =====================================================

// Enhanced Player schema with biographical data
export const ESPNPlayerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  birthdate: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  country: z.string().nullable().optional(),
  hometown: z.string().nullable().optional(),
  college: z.string().nullable().optional(),
  height_inches: z.number().nullable().optional(),
  weight_lbs: z.number().nullable().optional(),
  turned_pro: z.number().nullable().optional(),
  current_rank: z.number().nullable().optional(), // ESPN rank
  world_ranking: z.number().nullable().optional(),
  fedex_ranking: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type ESPNPlayer = z.infer<typeof ESPNPlayerSchema>;

// Complete ESPN Player Stats schema with all metrics
export const ESPNPlayerStatsSchema = z.object({
  id: z.number(),
  player_id: z.number(),
  season: z.number(),
  
  // Rankings
  current_rank: z.number().nullable().optional(),
  world_ranking: z.number().nullable().optional(),
  fedex_cup_rank: z.number().nullable().optional(),
  
  // Tournament Participation
  events_played: z.number().nullable().optional(),
  rounds_played: z.number().nullable().optional(),
  cuts_made: z.number().nullable().optional(),
  cuts_missed: z.number().nullable().optional(),
  withdrawals: z.number().nullable().optional(),
  
  // Performance Stats
  wins: z.number().nullable().optional(),
  runner_ups: z.number().nullable().optional(),
  top_5s: z.number().nullable().optional(),
  top_10s: z.number().nullable().optional(),
  top_25s: z.number().nullable().optional(),
  missed_cuts: z.number().nullable().optional(),
  
  // Scoring Statistics
  scoring_avg: z.number().nullable().optional(),
  scoring_avg_actual: z.number().nullable().optional(),
  scoring_avg_adjusted: z.number().nullable().optional(),
  rounds_under_70: z.number().nullable().optional(),
  rounds_in_60s: z.number().nullable().optional(),
  
  // Driving Statistics
  driving_distance: z.number().nullable().optional(),
  driving_distance_rank: z.number().nullable().optional(),
  driving_accuracy: z.number().nullable().optional(),
  driving_accuracy_rank: z.number().nullable().optional(),
  left_rough_tendency: z.number().nullable().optional(),
  right_rough_tendency: z.number().nullable().optional(),
  
  // Approach Statistics
  gir_percentage: z.number().nullable().optional(),
  gir_rank: z.number().nullable().optional(),
  proximity_to_hole: z.number().nullable().optional(),
  
  // Short Game Statistics
  scrambling_pct: z.number().nullable().optional(),
  scrambling_rank: z.number().nullable().optional(),
  sand_save_pct: z.number().nullable().optional(),
  sand_save_rank: z.number().nullable().optional(),
  
  // Putting Statistics
  putts_per_round: z.number().nullable().optional(),
  putts_per_hole: z.number().nullable().optional(),
  putts_per_gir: z.number().nullable().optional(),
  one_putt_pct: z.number().nullable().optional(),
  three_putt_avoidance: z.number().nullable().optional(),
  putting_average: z.number().nullable().optional(),
  putting_rank: z.number().nullable().optional(),
  
  // Strokes Gained
  sg_total: z.number().nullable().optional(),
  sg_off_the_tee: z.number().nullable().optional(),
  sg_approach: z.number().nullable().optional(),
  sg_around_green: z.number().nullable().optional(),
  sg_putting: z.number().nullable().optional(),
  
  // Scoring Distribution
  eagles: z.number().nullable().optional(),
  birdies: z.number().nullable().optional(),
  pars: z.number().nullable().optional(),
  bogeys: z.number().nullable().optional(),
  double_bogeys: z.number().nullable().optional(),
  
  // Per Round Averages
  birdies_per_round: z.number().nullable().optional(),
  eagles_per_round: z.number().nullable().optional(),
  bogeys_per_round: z.number().nullable().optional(),
  par_breakers_per_round: z.number().nullable().optional(),
  
  // Streaks
  consecutive_cuts_made: z.number().nullable().optional(),
  longest_streak_cuts_made: z.number().nullable().optional(),
  top10_streak: z.number().nullable().optional(),
  
  // Financial
  total_earnings: z.number().nullable().optional(),
  earnings_rank: z.number().nullable().optional(),
  earnings_per_event: z.number().nullable().optional(),
  
  // FedEx Cup
  fedex_cup_points: z.number().nullable().optional(),
  fedex_cup_rank_change: z.number().nullable().optional(),
  
  // Course History (JSONB)
  course_history: z.any().nullable().optional(),
  
  // Metadata
  last_tournament: z.string().nullable().optional(),
  last_tournament_date: z.string().nullable().optional(),
  last_position: z.string().nullable().optional(),
  data_source: z.string().nullable().optional(),
  last_updated: z.string().optional(),
  created_at: z.string().optional(),
});

export type ESPNPlayerStats = z.infer<typeof ESPNPlayerStatsSchema>;

// Weekly Stats Snapshot schema
export const PlayerStatsWeeklySchema = z.object({
  id: z.number(),
  player_id: z.number(),
  week_ending: z.string(),
  week_number: z.number(),
  season: z.number(),
  
  // Rankings snapshot
  current_rank: z.number().nullable().optional(),
  rank_change: z.number().nullable().optional(),
  world_ranking: z.number().nullable().optional(),
  world_ranking_change: z.number().nullable().optional(),
  fedex_cup_rank: z.number().nullable().optional(),
  fedex_cup_rank_change: z.number().nullable().optional(),
  
  // Key stats snapshot
  events_played: z.number().nullable().optional(),
  cuts_made: z.number().nullable().optional(),
  wins: z.number().nullable().optional(),
  top_10s: z.number().nullable().optional(),
  scoring_avg: z.number().nullable().optional(),
  driving_distance: z.number().nullable().optional(),
  driving_accuracy: z.number().nullable().optional(),
  gir_percentage: z.number().nullable().optional(),
  putts_per_hole: z.number().nullable().optional(),
  total_earnings: z.number().nullable().optional(),
  fedex_cup_points: z.number().nullable().optional(),
  
  // Recent form (JSONB)
  recent_form: z.any().nullable().optional(),
  stats_snapshot: z.any().nullable().optional(),
  
  created_at: z.string().optional(),
});

export type PlayerStatsWeekly = z.infer<typeof PlayerStatsWeeklySchema>;

// Current Season Leaderboard View schema
export const CurrentSeasonLeaderboardSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  country: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
  world_ranking: z.number().nullable().optional(),
  fedex_cup_rank: z.number().nullable().optional(),
  events_played: z.number().nullable().optional(),
  rounds_played: z.number().nullable().optional(),
  cuts_made: z.number().nullable().optional(),
  wins: z.number().nullable().optional(),
  top_10s: z.number().nullable().optional(),
  scoring_avg: z.number().nullable().optional(),
  driving_distance: z.number().nullable().optional(),
  driving_accuracy: z.number().nullable().optional(),
  gir_percentage: z.number().nullable().optional(),
  putts_per_hole: z.number().nullable().optional(),
  sand_save_pct: z.number().nullable().optional(),
  scrambling_pct: z.number().nullable().optional(),
  birdies_per_round: z.number().nullable().optional(),
  total_earnings: z.number().nullable().optional(),
  fedex_cup_points: z.number().nullable().optional(),
  sg_total: z.number().nullable().optional(),
  last_tournament: z.string().nullable().optional(),
  last_position: z.string().nullable().optional(),
  last_updated: z.string().nullable().optional(),
});

export type CurrentSeasonLeaderboard = z.infer<typeof CurrentSeasonLeaderboardSchema>;

// =====================================================
// ESPN STAT CATEGORIES (for UI grouping)
// =====================================================

export interface ESPNStatCategory {
  label: string;
  stats: Array<{
    key: keyof ESPNPlayerStats;
    label: string;
    format: 'number' | 'decimal' | 'percentage' | 'money' | 'rank';
    suffix?: string;
  }>;
}

export const ESPN_STAT_CATEGORIES: ESPNStatCategory[] = [
  {
    label: "Rankings",
    stats: [
      { key: "current_rank", label: "ESPN Rank", format: "rank" },
      { key: "world_ranking", label: "World Rank", format: "rank" },
      { key: "fedex_cup_rank", label: "FedEx Cup", format: "rank" },
    ],
  },
  {
    label: "Tournament Stats",
    stats: [
      { key: "events_played", label: "Events", format: "number" },
      { key: "rounds_played", label: "Rounds", format: "number" },
      { key: "cuts_made", label: "Cuts Made", format: "number" },
      { key: "wins", label: "Wins", format: "number" },
      { key: "top_10s", label: "Top 10", format: "number" },
    ],
  },
  {
    label: "Scoring",
    stats: [
      { key: "scoring_avg", label: "Scoring Avg", format: "decimal" },
      { key: "birdies_per_round", label: "Birdies/Round", format: "decimal" },
      { key: "eagles_per_round", label: "Eagles/Round", format: "decimal" },
      { key: "bogeys_per_round", label: "Bogeys/Round", format: "decimal" },
    ],
  },
  {
    label: "Driving",
    stats: [
      { key: "driving_distance", label: "Distance", format: "decimal", suffix: " yds" },
      { key: "driving_accuracy", label: "Accuracy", format: "percentage", suffix: "%" },
    ],
  },
  {
    label: "Approach",
    stats: [
      { key: "gir_percentage", label: "GIR", format: "percentage", suffix: "%" },
      { key: "proximity_to_hole", label: "Proximity", format: "decimal", suffix: " ft" },
    ],
  },
  {
    label: "Short Game",
    stats: [
      { key: "scrambling_pct", label: "Scrambling", format: "percentage", suffix: "%" },
      { key: "sand_save_pct", label: "Sand Saves", format: "percentage", suffix: "%" },
    ],
  },
  {
    label: "Putting",
    stats: [
      { key: "putts_per_hole", label: "Putts/Hole", format: "decimal" },
      { key: "putts_per_round", label: "Putts/Round", format: "decimal" },
      { key: "one_putt_pct", label: "One-Putt", format: "percentage", suffix: "%" },
    ],
  },
  {
    label: "Strokes Gained",
    stats: [
      { key: "sg_total", label: "SG: Total", format: "decimal" },
      { key: "sg_off_the_tee", label: "SG: Tee", format: "decimal" },
      { key: "sg_approach", label: "SG: Approach", format: "decimal" },
      { key: "sg_putting", label: "SG: Putting", format: "decimal" },
    ],
  },
  {
    label: "Earnings",
    stats: [
      { key: "total_earnings", label: "Total", format: "money" },
      { key: "earnings_per_event", label: "Per Event", format: "money" },
      { key: "fedex_cup_points", label: "FedEx Points", format: "number" },
    ],
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function formatStatValue(
  value: number | null | undefined,
  format: 'number' | 'decimal' | 'percentage' | 'money' | 'rank',
  suffix?: string
): string {
  if (value === null || value === undefined) return '-';
  
  switch (format) {
    case 'rank':
      return `#${value}`;
    case 'percentage':
      return `${value.toFixed(1)}${suffix || '%'}`;
    case 'decimal':
      return `${value.toFixed(2)}${suffix || ''}`;
    case 'money':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'number':
    default:
      return `${value}${suffix || ''}`;
  }
}