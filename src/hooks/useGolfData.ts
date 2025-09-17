import { useQuery } from "@tanstack/react-query";
import { supabase, validateConnection } from "../lib/supabase";
import { log } from "../lib/logger";
import {
  TournamentSchema,
  type Player,
  type Tournament,
  type PlayerProfile,
  type ESPNPlayerTournamentResult,
  type TournamentResultsByTour
} from "../types";
import { getMockPlayers, getMockPlayerProfile } from "../lib/mockDataProvider";

/**
 * Fetch all players
 */
export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      try {
        log.info("Attempting to fetch players from database");

        const { data, error } = await supabase
          .from("players")
          .select("*")
          .order("name", { ascending: true }); // Changed from full_name to name

        if (error) {
          log.warn("Failed to fetch players from database, using mock data", error);
          // Fall back to mock data
          return getMockPlayers();
        }

        // Map to match our Player interface (adapting existing schema)
        const players = data?.map((p) => {
          return {
            id: p.id,
            full_name: p.name, // Map name to full_name
            country: p.country || null,
            birthdate: p.birthdate || null,
            birthplace: p.birthplace || null,
            college: p.college || null,
            swing_type: p.swing_type || null,
            height: p.height || null,
            weight: p.weight || null,
            turned_pro: p.turned_pro || null,
            world_ranking: p.world_ranking || null,
            fedex_ranking: p.fedex_ranking || null,
            photo_url: p.photo_url || null,
            created_at: p.created_at,
            updated_at: p.updated_at
          } as Player;
        }) || [];

        log.info(`Fetched ${players.length} players from database`);
        return players;
      } catch (error) {
        log.warn("Database not available, using mock data", error);
        // Fall back to mock data
        return getMockPlayers();
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2,
  });
}

/**
 * Fetch all tournaments
 */
export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      log.info("Fetching tournaments");
      
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) {
        log.error("Failed to fetch tournaments", error);
        throw new Error(`Failed to fetch tournaments: ${error.message}`);
      }

      // Validate with Zod
      const tournaments = data?.map((t) => {
        try {
          return TournamentSchema.parse(t);
        } catch (e) {
          log.warn(`Invalid tournament data for ID ${t.id}`, e);
          return null;
        }
      }).filter((t): t is Tournament => t !== null) || [];

      log.info(`Fetched ${tournaments.length} tournaments`);
      return tournaments;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetch tournament results for a specific player
 */
export function usePlayerTournamentResults(playerId: number | null) {
  return useQuery({
    queryKey: ["player-tournament-results", playerId],
    queryFn: async () => {
      if (!playerId) {
        return [];
      }

      log.info(`Fetching tournament results for player ${playerId}`);
      
      const { data, error } = await supabase
        .from("tournament_results")
        .select(`
          *,
          tournaments (
            name,
            start_date,
            end_date,
            course_name,
            course_location
          )
        `)
        .eq("player_id", playerId)
        .order("tournaments(start_date)", { ascending: false });

      if (error) {
        log.error("Failed to fetch tournament results", error);
        throw new Error(`Failed to fetch tournament results: ${error.message}`);
      }

      log.info(`Fetched ${data?.length || 0} tournament results`);
      return data || [];
    },
    enabled: !!playerId,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetch player statistics for a specific season
 */
export function usePlayerStats(playerId: number | null, season: number = 2024) {
  return useQuery({
    queryKey: ["player-stats", playerId, season],
    queryFn: async () => {
      if (!playerId) {
        return null;
      }

      log.info(`Fetching stats for player ${playerId} in season ${season}`);
      
      const { data, error } = await supabase
        .from("player_stats")
        .select("*")
        .eq("player_id", playerId)
        .eq("season", season)
        .single();

      if (error) {
        log.error("Failed to fetch player stats", error);
        throw new Error(`Failed to fetch player stats: ${error.message}`);
      }

      log.info(`Fetched stats for player ${playerId}`);
      return data;
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetch current leaderboard from materialized view
 */
export function useCurrentLeaderboard() {
  return useQuery({
    queryKey: ["current-leaderboard"],
    queryFn: async () => {
      log.info("Fetching current leaderboard");
      
      const { data, error } = await supabase
        .from("current_season_leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(50);

      if (error) {
        log.error("Failed to fetch leaderboard", error);
        throw new Error(`Failed to fetch leaderboard: ${error.message}`);
      }

      log.info(`Fetched ${data?.length || 0} leaderboard entries`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Check database connection health
 */
export function useConnectionHealth() {
  return useQuery({
    queryKey: ["connection-health"],
    queryFn: async () => {
      // Use the health check function from database.ts
      return await validateConnection();
    },
    staleTime: 30 * 1000, // Check every 30 seconds
    retry: false, // Don't retry health checks
  });
}

// =====================================================
// ESPN-STYLE DATA HOOKS
// =====================================================

/**
 * Fetch complete player profile (ESPN-style with career stats)
 */
export function usePlayerProfile(playerId: number | null) {
  return useQuery({
    queryKey: ["player-profile", playerId],
    queryFn: async (): Promise<PlayerProfile | null> => {
      if (!playerId) return null;

      log.info(`Fetching complete profile for player ${playerId}`);

      // First get the player data
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) {
        log.warn("Failed to fetch player from database, using mock data", playerError);
        return getMockPlayerProfile(playerId);
      }

      // Get tournament stats for the current year
      const currentYear = 2025; // You can make this dynamic
      const { data: stats } = await supabase
        .from("player_tournaments")
        .select("*")
        .eq("player_id", playerId)
        .eq("season", currentYear);

      // Calculate stats from tournament results
      const tournaments_played = stats?.length || 0;
      const wins = stats?.filter(s => s.position === '1').length || 0;
      const total_earnings = stats?.reduce((sum, s) => sum + (s.earnings_usd || 0), 0) || 0;

      // Combine into PlayerProfile format
      const profile: PlayerProfile = {
        id: player.id,
        full_name: player.name, // Map name to full_name
        country: player.country || null,
        birthdate: player.birthdate || null,
        birthplace: player.birthplace || null,
        college: player.college || null,
        swing_type: player.swing_type || null,
        height: player.height || null,
        weight: player.weight || null,
        turned_pro: player.turned_pro || null,
        world_ranking: player.world_ranking || null,
        fedex_ranking: player.fedex_ranking || null,
        photo_url: player.photo_url || null,

        // Add required fields for ESPNPlayerHeader
        tournaments_last_year: tournaments_played,
        career_earnings: total_earnings,
        career_wins: wins
      };

      log.info(`Fetched complete profile for ${player.name}`);
      return profile;
    },
    enabled: !!playerId,
    staleTime: 10 * 60 * 1000, // Player profiles change rarely
    retry: 2,
  });
}

/**
 * Fetch ESPN-style tournament results for a player
 */
export function usePlayerTournamentResultsESPN(playerId: number | null, year?: number) {
  return useQuery({
    queryKey: ["player-tournament-results-espn", playerId, year],
    queryFn: async (): Promise<ESPNPlayerTournamentResult[]> => {
      if (!playerId) return [];

      log.info(`Fetching ESPN-style tournament results for player ${playerId}${year ? ` (year: ${year})` : ''}`);

      let query = supabase
        .from("player_tournament_results_espn")
        .select("*")
        .eq("player_id", playerId);

      if (year) {
        query = query.eq("year", year);
      }

      const { data, error } = await query.order("start_date", { ascending: false });

      if (error) {
        log.error("Failed to fetch ESPN tournament results", error);
        throw new Error(`Failed to fetch tournament results: ${error.message}`);
      }

      log.info(`Fetched ${data?.length || 0} ESPN tournament results`);
      return data as ESPNPlayerTournamentResult[];
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetch tournament results grouped by tour type (ESPN format)
 */
export function usePlayerTournamentResultsByTour(playerId: number | null, year?: number) {
  return useQuery({
    queryKey: ["player-tournament-results-by-tour", playerId, year],
    queryFn: async (): Promise<TournamentResultsByTour[]> => {
      if (!playerId) return [];

      log.info(`Fetching tournament results by tour for player ${playerId}${year ? ` (year: ${year})` : ''}`);

      // Use the existing player_tournaments table directly
      let query = supabase
        .from("player_tournaments")
        .select(`
          *,
          tournament_rounds (
            round_number,
            score
          )
        `)
        .eq("player_id", playerId);

      if (year) {
        query = query.eq("season", year);
      }

      const { data, error } = await query.order("id", { ascending: true });

      if (error) {
        log.error("Failed to fetch tournament results by tour", error);
        // Return empty array instead of throwing
        return [];
      }

      // Map the existing schema to our ESPN format
      const espnResults: ESPNPlayerTournamentResult[] = data?.map((result) => {
        // Aggregate round scores if available
        const rounds = result.tournament_rounds
          ?.sort((a: any, b: any) => a.round_number - b.round_number)
          ?.map((r: any) => r.score) || [];

        return {
          player_id: result.player_id,
          player_name: '',  // Will be filled from player data if needed
          country: '',
          photo_url: '',
          tournament_id: result.tournament_id || 0,
          year: result.season,
          date_range: result.date_range,
          tournament_name: result.tournament_name,
          course_name: result.tournament_name, // Use tournament_name as fallback
          position: result.position,
          position_numeric: result.position_numeric,
          is_tied: result.is_tied,
          overall_score: result.overall_score,
          total_score: result.total_score,
          score_to_par: result.score_to_par,
          earnings: result.earnings_usd,
          earnings_display: result.earnings_display || (result.earnings_usd ? `$${result.earnings_usd.toLocaleString()}` : '--'),
          status: result.status,
          tour_type: 'PGA TOUR', // Default since not in existing schema
          start_date: '',
          end_date: '',
          tournament_url: null,
          rounds: rounds,
          rounds_detail: rounds.length > 0 ? { r1: rounds[0], r2: rounds[1], r3: rounds[2], r4: rounds[3] } : null,
          score_display: result.score_to_par !== null
            ? `${result.total_score} (${result.score_to_par > 0 ? '+' : ''}${result.score_to_par})`
            : result.overall_score || '--'
        };
      }) || [];

      // Group all results as PGA TOUR (since tour_type isn't in existing schema)
      const tourGroups: TournamentResultsByTour[] = [{
        tourType: 'PGA TOUR',
        displayName: `${year || 2025} PGA TOUR Tournaments`,
        results: espnResults
      }];

      log.info(`Fetched ${espnResults.length} tournaments`);
      return tourGroups;
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetch available years for a player's tournament results
 */
export function usePlayerTournamentYears(playerId: number | null) {
  return useQuery({
    queryKey: ["player-tournament-years", playerId],
    queryFn: async (): Promise<number[]> => {
      if (!playerId) return [];

      const { data, error } = await supabase
        .from("player_tournaments")
        .select("season")
        .eq("player_id", playerId);

      if (error) {
        log.error("Failed to fetch tournament years", error);
        throw new Error(`Failed to fetch tournament years: ${error.message}`);
      }

      // Get unique years and sort descending
      const years = Array.from(new Set(data?.map(row => row.season).filter(Boolean)))
        .sort((a, b) => b - a);

      return years;
    },
    enabled: !!playerId,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

