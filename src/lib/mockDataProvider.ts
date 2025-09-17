// Mock Data Provider - Replaces Supabase for development without database
import { log } from "./logger";
import type {
  Player,
  Tournament,
  PlayerProfile,
  ESPNPlayerTournamentResult
} from "../types";

// Mock player data for ESPN-style components
const mockPlayers: Player[] = [
  {
    id: 1,
    full_name: "Scottie Scheffler",
    country: "USA",
    birthdate: "1996-06-21",
    birthplace: "Dallas, Texas",
    college: "University of Texas",
    swing_type: "Right",
    height: "6'3\"",
    weight: "200 lbs",
    turned_pro: 2018,
    world_ranking: 1,
    fedex_ranking: 1,
    photo_url: "/images/players/scottie-scheffler.jpg"
  },
  {
    id: 2,
    full_name: "Rory McIlroy",
    country: "Northern Ireland",
    birthdate: "1989-05-04",
    birthplace: "Holywood, Northern Ireland",
    college: null,
    swing_type: "Right",
    height: "5'9\"",
    weight: "161 lbs",
    turned_pro: 2007,
    world_ranking: 2,
    fedex_ranking: 5,
    photo_url: "/images/players/rory-mcilroy.jpg"
  },
  {
    id: 3,
    full_name: "Viktor Hovland",
    country: "Norway",
    birthdate: "1997-09-18",
    birthplace: "Oslo, Norway",
    college: "Oklahoma State University",
    swing_type: "Right",
    height: "5'10\"",
    weight: "165 lbs",
    turned_pro: 2019,
    world_ranking: 3,
    fedex_ranking: 12,
    photo_url: "/images/players/viktor-hovland.jpg"
  },
  {
    id: 4,
    full_name: "Patrick Cantlay",
    country: "USA",
    birthdate: "1992-03-17",
    birthplace: "Long Beach, California",
    college: "UCLA",
    swing_type: "Right",
    height: "6'0\"",
    weight: "175 lbs",
    turned_pro: 2011,
    world_ranking: 4,
    fedex_ranking: 8,
    photo_url: "/images/players/patrick-cantlay.jpg"
  },
  {
    id: 5,
    full_name: "Jon Rahm",
    country: "Spain",
    birthdate: "1994-11-10",
    birthplace: "Barrika, Spain",
    college: "Arizona State University",
    swing_type: "Right",
    height: "6'2\"",
    weight: "220 lbs",
    turned_pro: 2016,
    world_ranking: 5,
    fedex_ranking: 15,
    photo_url: "/images/players/jon-rahm.jpg"
  }
];

// Mock tournaments data
const mockTournamentsData: Tournament[] = [
  {
    id: 1,
    name: "The Sentry",
    start_date: "2025-01-04",
    end_date: "2025-01-07",
    course_name: "Kapalua Resort (Plantation Course)",
    course_name_display: "Kapalua Resort (Plantation Course)",
    course_location: "Kapalua, HI",
    purse: 20000000,
    tour_type: "PGA_TOUR",
    year: 2025,
    status: "completed"
  },
  {
    id: 2,
    name: "Sony Open in Hawaii",
    start_date: "2025-01-11",
    end_date: "2025-01-14",
    course_name: "Waialae Country Club",
    course_name_display: "Waialae Country Club",
    course_location: "Honolulu, HI",
    purse: 8300000,
    tour_type: "PGA_TOUR",
    year: 2025,
    status: "completed"
  },
  {
    id: 3,
    name: "The American Express",
    start_date: "2025-01-18",
    end_date: "2025-01-21",
    course_name: "Pete Dye Stadium Course",
    course_name_display: "Pete Dye Stadium Course",
    course_location: "La Quinta, CA",
    purse: 8800000,
    tour_type: "PGA_TOUR",
    year: 2025,
    status: "completed"
  },
  {
    id: 4,
    name: "AT&T Pebble Beach Pro-Am",
    start_date: "2025-02-01",
    end_date: "2025-02-03",
    course_name: "Pebble Beach Golf Links",
    course_name_display: "Pebble Beach Golf Links",
    course_location: "Pebble Beach, CA",
    purse: 9000000,
    tour_type: "PGA_TOUR",
    year: 2025,
    status: "completed"
  },
  {
    id: 5,
    name: "Masters Tournament",
    start_date: "2025-04-10",
    end_date: "2025-04-13",
    course_name: "Augusta National Golf Club",
    course_name_display: "Augusta National Golf Club",
    course_location: "Augusta, GA",
    purse: 18000000,
    tour_type: "PGA_TOUR",
    year: 2025,
    status: "completed"
  },
  {
    id: 6,
    name: "Olympic Men's Golf Competition",
    start_date: "2024-08-01",
    end_date: "2024-08-04",
    course_name: "Le Golf National",
    course_name_display: "Le Golf National",
    course_location: "Saint-Quentin-en-Yvelines, France",
    purse: 0,
    tour_type: "OLYMPICS",
    year: 2024,
    status: "completed"
  }
];

// Mock ESPN tournament results for Scottie Scheffler
const mockESPNResults: ESPNPlayerTournamentResult[] = [
  {
    player_id: 1,
    player_name: "Scottie Scheffler",
    country: "USA",
    photo_url: "/images/players/scottie-scheffler.jpg",
    year: 2025,
    tour_type: "PGA_TOUR",
    start_date: "2025-01-04",
    end_date: "2025-01-07",
    tournament_name: "The Sentry",
    course_name: "Kapalua Resort (Plantation Course)",
    course_location: "Kapalua, HI",
    position: "T5",
    total_score: 267,
    score_to_par: -25,
    earnings: 690500,
    rounds: [66, 64, 71, 66],
    rounds_detail: { r1: 66, r2: 64, r3: 71, r4: 66 },
    date_range: "1/4 - 1/7",
    score_display: "267 (-25)"
  },
  {
    player_id: 1,
    player_name: "Scottie Scheffler",
    country: "USA",
    photo_url: "/images/players/scottie-scheffler.jpg",
    year: 2025,
    tour_type: "PGA_TOUR",
    start_date: "2025-01-18",
    end_date: "2025-01-21",
    tournament_name: "The American Express",
    course_name: "Pete Dye Stadium Course",
    course_location: "La Quinta, CA",
    position: "T17",
    total_score: 267,
    score_to_par: -21,
    earnings: 132300,
    rounds: [67, 66, 69, 65],
    rounds_detail: { r1: 67, r2: 66, r3: 69, r4: 65 },
    date_range: "1/18 - 1/21",
    score_display: "267 (-21)"
  },
  {
    player_id: 1,
    player_name: "Scottie Scheffler",
    country: "USA",
    photo_url: "/images/players/scottie-scheffler.jpg",
    year: 2025,
    tour_type: "PGA_TOUR",
    start_date: "2025-02-01",
    end_date: "2025-02-03",
    tournament_name: "AT&T Pebble Beach Pro-Am",
    course_name: "Pebble Beach Golf Links",
    course_location: "Pebble Beach, CA",
    position: "T6",
    total_score: 203,
    score_to_par: -13,
    earnings: 642500,
    rounds: [69, 64, 70],
    rounds_detail: { r1: 69, r2: 64, r3: 70 },
    date_range: "2/1 - 2/3",
    score_display: "203 (-13)"
  },
  {
    player_id: 1,
    player_name: "Scottie Scheffler",
    country: "USA",
    photo_url: "/images/players/scottie-scheffler.jpg",
    year: 2025,
    tour_type: "PGA_TOUR",
    start_date: "2025-04-10",
    end_date: "2025-04-13",
    tournament_name: "Masters Tournament",
    course_name: "Augusta National Golf Club",
    course_location: "Augusta, GA",
    position: "4",
    total_score: 280,
    score_to_par: -8,
    earnings: 1008000,
    rounds: [68, 71, 72, 69],
    rounds_detail: { r1: 68, r2: 71, r3: 72, r4: 69 },
    date_range: "4/10 - 4/13",
    score_display: "280 (-8)"
  },
  {
    player_id: 1,
    player_name: "Scottie Scheffler",
    country: "USA",
    photo_url: "/images/players/scottie-scheffler.jpg",
    year: 2024,
    tour_type: "OLYMPICS",
    start_date: "2024-08-01",
    end_date: "2024-08-04",
    tournament_name: "Olympic Men's Golf Competition",
    course_name: "Le Golf National",
    course_location: "Saint-Quentin-en-Yvelines, France",
    position: "1",
    total_score: 265,
    score_to_par: -19,
    earnings: 0,
    rounds: [67, 69, 67, 62],
    rounds_detail: { r1: 67, r2: 69, r3: 67, r4: 62 },
    date_range: "8/1 - 8/4",
    score_display: "265 (-19)"
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert player to profile
const playerToProfile = (player: Player): PlayerProfile => ({
  id: player.id,
  full_name: player.full_name,
  country: player.country === null ? undefined : player.country,
  birthdate: player.birthdate === null ? undefined : player.birthdate,
  birthplace: player.birthplace === null ? undefined : player.birthplace,
  college: player.college === null ? undefined : player.college,
  swing_type: player.swing_type === null ? undefined : player.swing_type,
  height: player.height === null ? undefined : player.height,
  weight: player.weight === null ? undefined : player.weight,
  turned_pro: player.turned_pro === null ? undefined : player.turned_pro,
  world_ranking: player.world_ranking === null ? undefined : player.world_ranking,
  fedex_ranking: player.fedex_ranking === null ? undefined : player.fedex_ranking,
  photo_url: player.photo_url === null ? undefined : player.photo_url,
  created_at: player.created_at,
  updated_at: player.updated_at,
  age: player.birthdate ? new Date().getFullYear() - new Date(player.birthdate).getFullYear() : undefined,
  tournaments_last_year: 15,
  career_earnings: 25000000,
  career_wins: 8
});

// Mock API interface that mimics Supabase
export const mockDb = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: unknown) => ({
        single: async () => {
          await delay(100);
          log.info(`Mock query: ${table}.select(${columns}).eq(${column}, ${value}).single()`);

          if (table === "players" && column === "id") {
            const player = mockPlayers.find(p => p.id === value);
            return player ? { data: playerToProfile(player), error: null } : { data: null, error: { message: "Not found" } };
          }

          if (table === "player_profiles_complete" && column === "id") {
            const player = mockPlayers.find(p => p.id === value);
            return player ? { data: playerToProfile(player), error: null } : { data: null, error: { message: "Not found" } };
          }

          return { data: null, error: { message: "Not found" } };
        },
        eq: (nextColumn: string, nextValue: unknown) => ({
          order: (orderColumn: string, _options?: { ascending?: boolean }) => ({
            then: async (callback: (result: { data: ESPNPlayerTournamentResult[], error: null }) => void) => {
              await delay(100);
              log.info(`Mock query: ${table}.select(${columns}).eq(${column}, ${value}).eq(${nextColumn}, ${nextValue}).order(${orderColumn})`);

              if (table === "player_tournament_results_espn") {
                const results = mockESPNResults.filter(r => {
                  if (column === "player_id" && nextColumn === "year") {
                    return r.player_id === value && r.year === nextValue;
                  }
                  return false;
                });
                results.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
                callback({ data: results, error: null });
              }
            }
          }),
          then: async (callback: (result: { data: ESPNPlayerTournamentResult[], error: null }) => void) => {
            await delay(100);
            log.info(`Mock query: ${table}.select(${columns}).eq(${column}, ${value}).eq(${nextColumn}, ${nextValue})`);

            if (table === "player_tournament_results_espn") {
              const results = mockESPNResults.filter(r => {
                if (column === "player_id" && nextColumn === "year") {
                  return r.player_id === value && r.year === nextValue;
                }
                return false;
              });
              callback({ data: results, error: null });
            }
          }
        }),
        order: (orderColumn: string, _options?: { ascending?: boolean }) => ({
          then: async (callback: (result: { data: ESPNPlayerTournamentResult[], error: null }) => void) => {
            await delay(100);
            log.info(`Mock query: ${table}.select(${columns}).eq(${column}, ${value}).order(${orderColumn})`);

            if (table === "player_tournament_results_espn") {
              const results = mockESPNResults.filter(r => r.player_id === value);
              results.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
              callback({ data: results, error: null });
            }
          }
        }),
        then: async (callback: (result: { data: ESPNPlayerTournamentResult[] | { year: number }[], error: null }) => void) => {
          await delay(100);
          log.info(`Mock query: ${table}.select(${columns}).eq(${column}, ${value})`);

          if (table === "player_tournament_results_espn") {
            if (columns === "year") {
              const results = mockESPNResults.filter(r => r.player_id === value);
              const years = results.map(r => ({ year: r.year }));
              callback({ data: years, error: null });
            } else {
              const results = mockESPNResults.filter(r => r.player_id === value);
              callback({ data: results, error: null });
            }
          }
        }
      }),
      order: (column: string, _options?: { ascending?: boolean }) => ({
        then: async (callback: (result: { data: Player[] | Tournament[], error: null }) => void) => {
          await delay(100);
          log.info(`Mock query: ${table}.select(${columns}).order(${column})`);

          if (table === "players") {
            const sorted = [...mockPlayers].sort((a, b) => a.full_name.localeCompare(b.full_name));
            callback({ data: sorted, error: null });
          } else if (table === "tournaments") {
            const sorted = [...mockTournamentsData].sort((a, b) => {
              const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
              const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
              return dateB - dateA;
            });
            callback({ data: sorted, error: null });
          }
        }
      }),
      limit: (count: number) => ({
        then: async (callback: (result: { data: Player[], error: null }) => void) => {
          await delay(50);
          log.info(`Mock query: ${table}.select(${columns}).limit(${count})`);

          if (table === "players") {
            callback({ data: mockPlayers.slice(0, count), error: null });
          }
        }
      }),
      then: async (callback: (result: { data: Player[] | Tournament[] | ESPNPlayerTournamentResult[] | { year: number }[], error: null }) => void) => {
        await delay(100);
        log.info(`Mock query: ${table}.select(${columns})`);

        if (table === "players") {
          callback({ data: mockPlayers, error: null });
        } else if (table === "tournaments") {
          callback({ data: mockTournamentsData, error: null });
        } else if (table === "player_tournament_results_espn") {
          if (columns === "year") {
            const years = Array.from(new Set(mockESPNResults.map(r => r.year))).map(year => ({ year }));
            callback({ data: years, error: null });
          } else {
            callback({ data: mockESPNResults, error: null });
          }
        }
      }
    })
  })
};

// Helper function to validate mock connection
export async function validateConnection(): Promise<boolean> {
  try {
    log.info("Validating mock database connection");
    await delay(50);
    log.info("Mock database connection successful");
    return true;
  } catch (error) {
    log.error("Failed to connect to mock database:", error);
    return false;
  }
}

// Export helper functions for direct access to mock data
export function getMockPlayers(): Player[] {
  return mockPlayers;
}

export function getMockTournaments(): Tournament[] {
  return mockTournamentsData;
}

export function getMockPlayerProfile(playerId: number): PlayerProfile | null {
  const player = mockPlayers.find(p => p.id === playerId);
  if (!player) return null;

  return playerToProfile(player);
}

export function getMockTournamentResults(): ESPNPlayerTournamentResult[] {
  return mockESPNResults;
}

// Export as default for easy replacement
export default mockDb;