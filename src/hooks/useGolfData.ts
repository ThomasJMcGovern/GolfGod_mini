import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { log } from "../lib/logger";
import { 
  PlayerSchema, 
  TournamentSchema, 
  RoundSchema,
  type Player, 
  type Tournament, 
  type Round 
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
        .from("player")
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
        .from("tournament")
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
 * Fetch rounds for a specific player and tournament
 */
export function useRounds(playerId: number | null, tournamentId: number | null) {
  return useQuery({
    queryKey: ["rounds", playerId, tournamentId],
    queryFn: async () => {
      if (!playerId || !tournamentId) {
        return [];
      }

      log.info(`Fetching rounds for player ${playerId} in tournament ${tournamentId}`);
      
      const { data, error } = await supabase
        .from("round")
        .select("*")
        .eq("player_id", playerId)
        .eq("tournament_id", tournamentId)
        .order("round_no", { ascending: true });

      if (error) {
        log.error("Failed to fetch rounds", error);
        throw new Error(`Failed to fetch rounds: ${error.message}`);
      }

      // Validate with Zod
      const rounds = data?.map((r) => {
        try {
          return RoundSchema.parse(r);
        } catch (e) {
          log.warn(`Invalid round data for ID ${r.id}`, e);
          return null;
        }
      }).filter((r): r is Round => r !== null) || [];

      log.info(`Fetched ${rounds.length} rounds`);
      return rounds;
    },
    enabled: !!playerId && !!tournamentId,
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
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
          .from("player")
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