import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing environment variables!");
  console.error("Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  process.exit(1);
}

// Create Supabase client with service role key (admin access)
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Types for CSV data
interface CSVRow {
  tournament_name: string;
  player_name: string;
  round_no: number;
  wave: "AM" | "PM";
  score_to_par: number;
  sg_app: number;
  putts: number;
  fairways_hit: number;
  fairways_total: number;
  wind_mph: number;
}

// Cache for tournament and player IDs
const tournamentCache = new Map<string, number>();
const playerCache = new Map<string, number>();

/**
 * Ensure tournament exists and return its ID
 */
async function ensureTournament(name: string): Promise<number> {
  // Check cache first
  if (tournamentCache.has(name)) {
    return tournamentCache.get(name)!;
  }

  // Check database
  const { data: existing } = await supabase
    .from("tournament")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing) {
    tournamentCache.set(name, existing.id);
    return existing.id;
  }

  // Create new tournament
  const { data: newTournament, error } = await supabase
    .from("tournament")
    .insert({ 
      name,
      start_date: new Date().toISOString().split('T')[0], // Today's date
      course: `${name} Course`
    })
    .select("id")
    .single();

  if (error) {
    console.error(`Failed to create tournament ${name}:`, error);
    throw error;
  }

  tournamentCache.set(name, newTournament.id);
  console.log(`✅ Created tournament: ${name}`);
  return newTournament.id;
}

/**
 * Ensure player exists and return its ID
 */
async function ensurePlayer(name: string): Promise<number> {
  // Check cache first
  if (playerCache.has(name)) {
    return playerCache.get(name)!;
  }

  // Check database
  const { data: existing } = await supabase
    .from("player")
    .select("id")
    .eq("full_name", name)
    .maybeSingle();

  if (existing) {
    playerCache.set(name, existing.id);
    return existing.id;
  }

  // Create new player
  const { data: newPlayer, error } = await supabase
    .from("player")
    .insert({ 
      full_name: name,
      handedness: "R" // Default to right-handed
    })
    .select("id")
    .single();

  if (error) {
    console.error(`Failed to create player ${name}:`, error);
    throw error;
  }

  playerCache.set(name, newPlayer.id);
  console.log(`✅ Created player: ${name}`);
  return newPlayer.id;
}

/**
 * Parse CSV file
 */
function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split(/\r?\n/);
  const [header, ...dataLines] = lines;
  const columns = header.split(",");

  return dataLines.map((line) => {
    const values = line.split(",");
    const row: any = {};

    columns.forEach((col, index) => {
      const value = values[index];
      // Convert numeric fields
      if (["round_no", "score_to_par", "sg_app", "putts", "fairways_hit", "fairways_total", "wind_mph"].includes(col)) {
        row[col] = Number(value);
      } else {
        row[col] = value;
      }
    });

    return row as CSVRow;
  });
}

/**
 * Main seeding function
 */
async function seed() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Read and parse CSV
    const csvContent = readFileSync("./rounds.csv", "utf8");
    const rounds = parseCSV(csvContent);
    console.log(`📊 Found ${rounds.length} rounds to import\n`);

    // Clear existing rounds (optional - comment out if you want to append)
    console.log("🧹 Clearing existing rounds...");
    const { error: deleteError } = await supabase.from("round").delete().neq("id", 0);
    if (deleteError) {
      console.warn("Warning: Could not clear existing rounds:", deleteError.message);
    }

    // Process each round
    let successCount = 0;
    for (const round of rounds) {
      try {
        // Get or create tournament and player
        const tournamentId = await ensureTournament(round.tournament_name);
        const playerId = await ensurePlayer(round.player_name);

        // Insert round
        const { error } = await supabase.from("round").insert({
          tournament_id: tournamentId,
          player_id: playerId,
          round_no: round.round_no,
          wave: round.wave,
          score_to_par: round.score_to_par,
          sg_app: round.sg_app,
          putts: round.putts,
          fairways_hit: round.fairways_hit,
          fairways_total: round.fairways_total,
          wind_mph: round.wind_mph,
        });

        if (error) {
          console.error(`Failed to insert round:`, error);
          throw error;
        }

        successCount++;
        process.stdout.write(`\r📝 Inserted ${successCount}/${rounds.length} rounds`);
      } catch (error) {
        console.error(`\n❌ Error processing round:`, error);
        throw error;
      }
    }

    console.log("\n\n✨ Seeding complete!");
    console.log(`📊 Summary:`);
    console.log(`   - Tournaments: ${tournamentCache.size}`);
    console.log(`   - Players: ${playerCache.size}`);
    console.log(`   - Rounds: ${successCount}`);
    console.log("\n🎉 Database is ready to use!");
    console.log("\n⚠️  Remember to remove SUPABASE_SERVICE_ROLE_KEY from .env.local!");

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});