#!/usr/bin/env bun

/**
 * Tournament Data Importer
 * Imports tournament data from JSON files into Supabase
 * This is a more controlled approach for populating the database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample tournament data structure
interface TournamentData {
  player_name: string;
  espn_id: number;
  year: number;
  tournaments: {
    date: string;
    name: string;
    course?: string;
    position: string;
    score: string;
    earnings: number | null;
    rounds: number[];
  }[];
}

/**
 * Sample data for Scottie Scheffler 2024
 */
const SAMPLE_DATA: TournamentData[] = [
  {
    player_name: "Scottie Scheffler",
    espn_id: 9478,
    year: 2024,
    tournaments: [
      {
        date: "Jan 4-7",
        name: "The Sentry",
        course: "Plantation Course",
        position: "T3",
        score: "270 (-22)",
        earnings: 585000,
        rounds: [67, 67, 69, 67]
      },
      {
        date: "Jan 11-14",
        name: "Sony Open in Hawaii",
        course: "Waialae Country Club",
        position: "T7",
        score: "268 (-12)",
        earnings: 245700,
        rounds: [69, 65, 66, 68]
      },
      {
        date: "Jan 25-28",
        name: "Farmers Insurance Open",
        course: "Torrey Pines (South)",
        position: "T6",
        score: "277 (-11)",
        earnings: 286125,
        rounds: [72, 69, 67, 69]
      },
      {
        date: "Feb 1-4",
        name: "WM Phoenix Open",
        course: "TPC Scottsdale",
        position: "1",
        score: "263 (-21)",
        earnings: 3600000,
        rounds: [64, 64, 68, 67]
      },
      {
        date: "Feb 15-18",
        name: "THE GENESIS INVITATIONAL",
        course: "Riviera Country Club",
        position: "T10",
        score: "275 (-9)",
        earnings: 303000,
        rounds: [70, 69, 69, 67]
      },
      {
        date: "Mar 7-10",
        name: "THE PLAYERS Championship",
        course: "TPC Sawgrass",
        position: "1",
        score: "264 (-24)",
        earnings: 4500000,
        rounds: [67, 69, 64, 64]
      },
      {
        date: "Mar 21-24",
        name: "Houston Open",
        course: "Memorial Park Golf Course",
        position: "2",
        score: "276 (-4)",
        earnings: 1458000,
        rounds: [65, 70, 70, 71]
      },
      {
        date: "Apr 11-14",
        name: "Masters Tournament",
        course: "Augusta National",
        position: "1",
        score: "275 (-11)",
        earnings: 3600000,
        rounds: [66, 72, 71, 68]
      },
      {
        date: "Apr 18-21",
        name: "RBC Heritage",
        course: "Harbour Town Golf Links",
        position: "1",
        score: "261 (-19)",
        earnings: 3600000,
        rounds: [64, 65, 63, 69]
      },
      {
        date: "May 16-19",
        name: "PGA Championship",
        course: "Valhalla Golf Club",
        position: "T8",
        score: "277 (-7)",
        earnings: 443625,
        rounds: [67, 66, 73, 71]
      }
    ]
  },
  {
    player_name: "Rory McIlroy",
    espn_id: 8793,
    year: 2024,
    tournaments: [
      {
        date: "Jan 11-14",
        name: "Dubai Desert Classic",
        course: "Emirates Golf Club",
        position: "1",
        score: "262 (-14)",
        earnings: 1530000,
        rounds: [63, 70, 63, 66]
      },
      {
        date: "Jan 25-28",
        name: "Farmers Insurance Open",
        course: "Torrey Pines (South)",
        position: "T31",
        score: "283 (-5)",
        earnings: 65025,
        rounds: [73, 69, 71, 70]
      },
      {
        date: "Feb 1-4",
        name: "WM Phoenix Open",
        course: "TPC Scottsdale",
        position: "T22",
        score: "270 (-14)",
        earnings: 103600,
        rounds: [65, 71, 68, 66]
      },
      {
        date: "Feb 15-18",
        name: "THE GENESIS INVITATIONAL",
        course: "Riviera Country Club",
        position: "T24",
        score: "279 (-5)",
        earnings: 108900,
        rounds: [74, 66, 71, 68]
      },
      {
        date: "Mar 7-10",
        name: "THE PLAYERS Championship",
        course: "TPC Sawgrass",
        position: "T19",
        score: "280 (-8)",
        earnings: 324500,
        rounds: [65, 73, 73, 69]
      }
    ]
  },
  {
    player_name: "Jordan Spieth",
    espn_id: 5467,
    year: 2023,
    tournaments: [
      {
        date: "Jan 5-8",
        name: "The Sentry",
        course: "Plantation Course",
        position: "T7",
        score: "271 (-21)",
        earnings: 340000,
        rounds: [67, 69, 68, 67]
      },
      {
        date: "Jan 12-15",
        name: "Sony Open in Hawaii",
        course: "Waialae Country Club",
        position: "T12",
        score: "274 (-6)",
        earnings: 147600,
        rounds: [67, 67, 69, 71]
      },
      {
        date: "Feb 2-5",
        name: "WM Phoenix Open",
        course: "TPC Scottsdale",
        position: "T34",
        score: "279 (-5)",
        earnings: 62775,
        rounds: [71, 67, 74, 67]
      },
      {
        date: "Feb 16-19",
        name: "THE GENESIS INVITATIONAL",
        course: "Riviera Country Club",
        position: "T20",
        score: "283 (E)",
        earnings: 134750,
        rounds: [68, 70, 73, 72]
      },
      {
        date: "Mar 23-26",
        name: "WGC-Dell Technologies Match Play",
        course: "Austin Country Club",
        position: "T17",
        score: "Group Stage",
        earnings: 212500,
        rounds: []
      }
    ]
  }
];

/**
 * Parse position to get numeric value and tied flag
 */
function parsePosition(position: string): { numeric: number | null, isTied: boolean } {
  if (!position || position === 'CUT' || position === 'WD' || position === 'DQ' || position === 'MC') {
    return { numeric: null, isTied: false };
  }

  const isTied = position.startsWith('T');
  const numeric = parseInt(position.replace('T', ''), 10);

  return {
    numeric: isNaN(numeric) ? null : numeric,
    isTied
  };
}

/**
 * Parse score string to extract total and to-par
 */
function parseScore(score: string): { total: number | null, toPar: number | null } {
  if (!score || score === '--' || score === 'Group Stage') {
    return { total: null, toPar: null };
  }

  // Match patterns like "273 (-15)" or "283 (E)"
  const match = score.match(/(\d+)\s*\(([+-]?\d+|E)\)/);
  if (match) {
    const total = parseInt(match[1], 10);
    const toPar = match[2] === 'E' ? 0 : parseInt(match[2], 10);
    return { total, toPar };
  }

  return { total: null, toPar: null };
}

/**
 * Insert or update player in database
 */
async function upsertPlayer(espnId: number, name: string): Promise<number | null> {
  try {
    // Check if player exists
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('espn_id', espnId)
      .single();

    if (existing) {
      console.log(`  Player ${name} already exists with ID ${existing.id}`);
      return existing.id;
    }

    // Insert new player
    const { data, error } = await supabase
      .from('players')
      .insert({
        name,
        espn_id: espnId,
        country: 'USA'
      })
      .select('id')
      .single();

    if (error) {
      console.error(`  Failed to insert player ${name}:`, error);
      return null;
    }

    console.log(`  Created player ${name} with ID ${data.id}`);
    return data.id;
  } catch (error) {
    console.error(`  Error upserting player ${name}:`, error);
    return null;
  }
}

/**
 * Import tournament data into database
 */
async function importTournamentData(data: TournamentData) {
  console.log(`\n📊 Processing ${data.player_name} - Year ${data.year}`);

  // Upsert player
  const playerId = await upsertPlayer(data.espn_id, data.player_name);
  if (!playerId) {
    console.error(`Failed to upsert player ${data.player_name}, skipping...`);
    return;
  }

  // Process each tournament
  for (const tournament of data.tournaments) {
    try {
      const { numeric: positionNumeric, isTied } = parsePosition(tournament.position);
      const { total: totalScore, toPar: scoreToPar } = parseScore(tournament.score);

      // Determine status
      let status = 'completed';
      if (['CUT', 'MC'].includes(tournament.position)) status = 'cut';
      else if (tournament.position === 'WD') status = 'withdrawn';
      else if (tournament.position === 'DQ') status = 'disqualified';

      // Check if tournament result already exists
      const { data: existing } = await supabase
        .from('player_tournaments')
        .select('id')
        .eq('player_id', playerId)
        .eq('tournament_name', tournament.name)
        .eq('season', data.year)
        .single();

      if (existing) {
        console.log(`    ⚠️  ${tournament.name} - already exists, skipping`);
        continue;
      }

      // Insert tournament result
      const { data: result, error } = await supabase
        .from('player_tournaments')
        .insert({
          player_id: playerId,
          tournament_id: 0, // Would need proper tournament mapping
          season: data.year,
          tournament_name: tournament.name,
          course_name: tournament.course,
          date_range: tournament.date,
          position: tournament.position,
          position_numeric: positionNumeric,
          is_tied: isTied,
          overall_score: tournament.score,
          total_score: totalScore,
          score_to_par: scoreToPar,
          earnings_usd: tournament.earnings,
          earnings_display: tournament.earnings ? `$${tournament.earnings.toLocaleString()}` : '--',
          status
        })
        .select('id')
        .single();

      if (error) {
        console.error(`    ❌ ${tournament.name} - Error:`, error.message);
        continue;
      }

      // Insert round scores if available
      if (result && tournament.rounds.length > 0) {
        const rounds = tournament.rounds.map((score, index) => ({
          player_tournament_id: result.id,
          round_number: index + 1,
          score: score || null
        }));

        const { error: roundError } = await supabase
          .from('tournament_rounds')
          .insert(rounds);

        if (roundError) {
          console.error(`       Failed to insert round scores:`, roundError.message);
        }
      }

      console.log(`    ✅ ${tournament.name} - ${tournament.position} (${tournament.earnings ? '$' + tournament.earnings.toLocaleString() : 'no earnings'})`);
    } catch (error) {
      console.error(`    ❌ ${tournament.name} - Error:`, error);
    }
  }
}

/**
 * Load data from JSON file
 */
async function loadDataFromFile(filepath: string): Promise<TournamentData[]> {
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.log(`  No external data file found, using sample data`);
    return SAMPLE_DATA;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🏌️ Tournament Data Importer\n');

  // Try to load data from external file first
  const dataPath = join(__dirname, '..', 'data', 'tournament-data.json');
  const data = await loadDataFromFile(dataPath);

  console.log(`Found ${data.length} player-year combinations to import\n`);

  // Import each player's data
  for (const playerData of data) {
    await importTournamentData(playerData);
  }

  console.log('\n✅ Data import completed!');
  console.log('\n📝 To add more data:');
  console.log('   1. Create a file: data/tournament-data.json');
  console.log('   2. Follow the same structure as the sample data');
  console.log('   3. Run this script again: bun run scripts/import-tournament-data.ts');
}

// Run the script
main().catch(console.error);