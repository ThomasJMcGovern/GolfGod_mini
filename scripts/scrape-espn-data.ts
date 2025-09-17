#!/usr/bin/env bun

/**
 * ESPN Golf Data Scraper
 * Fetches tournament results for players across multiple years
 * and populates Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// ESPN player IDs for top golfers
const ESPN_PLAYERS = [
  { id: 9478, name: 'Scottie Scheffler' },
  { id: 8793, name: 'Rory McIlroy' },
  { id: 5467, name: 'Jordan Spieth' },
  { id: 6798, name: 'Justin Thomas' },
  { id: 3448, name: 'Tiger Woods' },
  { id: 1810, name: 'Phil Mickelson' },
  { id: 9780, name: 'Collin Morikawa' },
  { id: 11046, name: 'Viktor Hovland' },
  { id: 10404, name: 'Xander Schauffele' },
  { id: 9794, name: 'Bryson DeChambeau' }
];

interface ESPNTournamentResult {
  date: string;
  tournament: string;
  course: string;
  position: string;
  score: string;
  earnings: string;
  rounds: string[];
}

/**
 * Parse ESPN HTML to extract tournament results
 */
function parseESPNResults(html: string): ESPNTournamentResult[] {
  const results: ESPNTournamentResult[] = [];

  // ESPN results table pattern
  const tableMatch = html.match(/<table[^>]*class="[^"]*Table[^"]*"[^>]*>([\s\S]*?)<\/table>/gi);
  if (!tableMatch) return results;

  // Find the results table (usually the main table with tournament data)
  for (const table of tableMatch) {
    if (!table.includes('TOURNAMENT') && !table.includes('POS')) continue;

    // Extract rows
    const rows = table.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];

    for (const row of rows) {
      // Skip header rows
      if (row.includes('<th') || row.includes('TOURNAMENT')) continue;

      // Extract cells
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      if (cells.length < 6) continue;

      // Clean HTML tags from cell content
      const cleanCell = (cell: string) =>
        cell.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

      const dateCell = cleanCell(cells[0]);
      const tournamentCell = cleanCell(cells[1]);
      const positionCell = cleanCell(cells[2]);
      const scoreCell = cleanCell(cells[3]);
      const earningsCell = cleanCell(cells[4]);

      // Extract round scores (usually in cells 5-8)
      const rounds: string[] = [];
      for (let i = 5; i < Math.min(9, cells.length); i++) {
        const roundScore = cleanCell(cells[i]);
        if (roundScore && roundScore !== '--') {
          rounds.push(roundScore);
        }
      }

      results.push({
        date: dateCell,
        tournament: tournamentCell,
        course: '', // Will need to fetch separately or parse from tournament details
        position: positionCell,
        score: scoreCell,
        earnings: earningsCell,
        rounds
      });
    }
  }

  return results;
}

/**
 * Fetch tournament results from ESPN for a specific player and year
 */
async function fetchESPNData(playerId: number, year: number): Promise<ESPNTournamentResult[]> {
  const url = `https://www.espn.com/golf/player/results/_/id/${playerId}/year/${year}`;

  console.log(`Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return parseESPNResults(html);
  } catch (error) {
    console.error(`Failed to fetch ESPN data for player ${playerId}, year ${year}:`, error);
    return [];
  }
}

/**
 * Convert ESPN position to numeric value and tied flag
 */
function parsePosition(position: string): { numeric: number | null, isTied: boolean } {
  if (!position || position === 'CUT' || position === 'WD' || position === 'DQ') {
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
 * Parse score to par from score string (e.g., "273 (-15)")
 */
function parseScoreToPar(score: string): { total: number | null, toPar: number | null } {
  if (!score || score === '--') {
    return { total: null, toPar: null };
  }

  const match = score.match(/(\d+)\s*\(([+-]?\d+|E)\)/);
  if (match) {
    const total = parseInt(match[1], 10);
    const toPar = match[2] === 'E' ? 0 : parseInt(match[2], 10);
    return { total, toPar };
  }

  // Try to parse as just a number
  const simpleScore = parseInt(score, 10);
  if (!isNaN(simpleScore)) {
    return { total: simpleScore, toPar: null };
  }

  return { total: null, toPar: null };
}

/**
 * Parse earnings string to numeric value
 */
function parseEarnings(earnings: string): number | null {
  if (!earnings || earnings === '--') return null;

  // Remove currency symbols and commas
  const cleaned = earnings.replace(/[$,]/g, '');
  const value = parseFloat(cleaned);

  return isNaN(value) ? null : value;
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
      console.log(`Player ${name} already exists with ID ${existing.id}`);
      return existing.id;
    }

    // Insert new player
    const { data, error } = await supabase
      .from('players')
      .insert({
        name,
        espn_id: espnId,
        country: 'USA' // Default, would need to fetch from ESPN profile
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to insert player ${name}:`, error);
      return null;
    }

    console.log(`Created player ${name} with ID ${data.id}`);
    return data.id;
  } catch (error) {
    console.error(`Error upserting player ${name}:`, error);
    return null;
  }
}

/**
 * Insert tournament results into database
 */
async function insertTournamentResults(
  playerId: number,
  year: number,
  results: ESPNTournamentResult[]
) {
  console.log(`Inserting ${results.length} tournament results for player ${playerId}, year ${year}`);

  for (const result of results) {
    try {
      // Parse position
      const { numeric: positionNumeric, isTied } = parsePosition(result.position);

      // Parse score
      const { total: totalScore, toPar: scoreToPar } = parseScoreToPar(result.score);

      // Parse earnings
      const earningsUsd = parseEarnings(result.earnings);

      // Determine status
      let status = 'completed';
      if (result.position === 'CUT') status = 'cut';
      else if (result.position === 'WD') status = 'withdrawn';
      else if (result.position === 'DQ') status = 'disqualified';

      // Insert tournament result
      const { data, error } = await supabase
        .from('player_tournaments')
        .insert({
          player_id: playerId,
          tournament_id: 0, // Would need to match with actual tournament
          season: year,
          tournament_name: result.tournament,
          date_range: result.date,
          position: result.position,
          position_numeric: positionNumeric,
          is_tied: isTied,
          overall_score: result.score,
          total_score: totalScore,
          score_to_par: scoreToPar,
          earnings_usd: earningsUsd,
          earnings_display: result.earnings,
          status
        })
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert tournament result:`, error);
        continue;
      }

      // Insert round scores if available
      if (data && result.rounds.length > 0) {
        const rounds = result.rounds.map((score, index) => ({
          player_tournament_id: data.id,
          round_number: index + 1,
          score: parseInt(score, 10) || null
        }));

        const { error: roundError } = await supabase
          .from('tournament_rounds')
          .insert(rounds);

        if (roundError) {
          console.error(`Failed to insert round scores:`, roundError);
        }
      }

      console.log(`✓ ${result.tournament} - ${result.position}`);
    } catch (error) {
      console.error(`Error inserting result for ${result.tournament}:`, error);
    }
  }
}

/**
 * Main scraping function
 */
async function scrapeESPNData() {
  console.log('🏌️ Starting ESPN Golf Data Scraper\n');

  // Years to fetch (2020-2024)
  const years = [2020, 2021, 2022, 2023, 2024];

  for (const player of ESPN_PLAYERS) {
    console.log(`\n📊 Processing ${player.name} (ESPN ID: ${player.id})`);

    // Upsert player
    const playerId = await upsertPlayer(player.id, player.name);
    if (!playerId) {
      console.error(`Failed to upsert player ${player.name}, skipping...`);
      continue;
    }

    // Fetch data for each year
    for (const year of years) {
      console.log(`\n  Year ${year}:`);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch ESPN data
      const results = await fetchESPNData(player.id, year);

      if (results.length === 0) {
        console.log(`  No results found for ${year}`);
        continue;
      }

      // Insert results into database
      await insertTournamentResults(playerId, year, results);
    }
  }

  console.log('\n✅ ESPN data scraping completed!');
}

// Run the scraper
scrapeESPNData().catch(console.error);