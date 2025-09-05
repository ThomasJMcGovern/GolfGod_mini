import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { log } from "../lib/logger";
import { 
  PlayerSchema, 
  TournamentSchema,
  type Player, 
  type Tournament
} from "../types";

/**
 * Fetch all players
 */
export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      log.info("Fetching players");
      
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        log.error("Failed to fetch players", error);
        throw new Error(`Failed to fetch players: ${error.message}`);
      }

      // Validate with Zod
      const players = data?.map((p) => {
        try {
          return PlayerSchema.parse(p);
        } catch (e) {
          log.warn(`Invalid player data for ID ${p.id}`, e);
          return null;
        }
      }).filter((p): p is Player => p !== null) || [];

      log.info(`Fetched ${players.length} players`);
      return players;
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
 * Check Supabase connection health
 */
export function useConnectionHealth() {
  return useQuery({
    queryKey: ["connection-health"],
    queryFn: async () => {
      const start = Date.now();
      
      try {
        const { error } = await supabase
          .from("players")
          .select("id")
          .limit(1);

        const latency = Date.now() - start;

        if (error) {
          log.error("Connection health check failed", error);
          return { 
            connected: false, 
            latency, 
            error: error.message 
          };
        }

        log.debug(`Connection healthy (${latency}ms)`);
        return { 
          connected: true, 
          latency, 
          error: null 
        };
      } catch (error) {
        const latency = Date.now() - start;
        log.error("Connection health check failed", error);
        return { 
          connected: false, 
          latency, 
          error: String(error) 
        };
      }
    },
    staleTime: 30 * 1000, // Check every 30 seconds
    retry: false, // Don't retry health checks
  });
}