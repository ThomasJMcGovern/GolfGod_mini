#!/usr/bin/env bun

/**
 * ESPN Golf Data Fetcher using Playwright
 * More reliable web scraping with proper JavaScript rendering
 */

import { chromium } from 'playwright';
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

interface TournamentResult {
  date: string;
  tournament: string;
  position: string;
  score: string;
  earnings: string;
  rounds: string[];
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
        country: 'USA' // Default
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
 * Parse score string
 */
function parseScore(score: string): { total: number | null, toPar: number | null } {
  if (!score || score === '--') {
    return { total: null, toPar: null };
  }

  // Match patterns like "273 (-15)" or just "273"
  const match = score.match(/(\d+)\s*(?:\(([+-]?\d+|E)\))?/);
  if (match) {
    const total = parseInt(match[1], 10);
    let toPar = null;
    if (match[2]) {
      toPar = match[2] === 'E' ? 0 : parseInt(match[2], 10);
    }
    return { total, toPar };
  }

  return { total: null, toPar: null };
}

/**
 * Parse earnings string
 */
function parseEarnings(earnings: string): number | null {
  if (!earnings || earnings === '--' || earnings === '') return null;

  // Remove currency symbols, commas, and spaces
  const cleaned = earnings.replace(/[$,\s]/g, '');
  const value = parseFloat(cleaned);

  return isNaN(value) ? null : value;
}

/**
 * Fetch tournament results using Playwright
 */
async function fetchWithPlaywright(playerId: number, playerName: string, year: number): Promise<TournamentResult[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.espn.com/golf/player/results/_/id/${playerId}/year/${year}`;
    console.log(`  Fetching: ${url}`);

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the results table to load
    await page.waitForSelector('.Table__TD', { timeout: 10000 }).catch(() => {
      console.log(`  No results table found for ${year}`);
    });

    // Extract tournament results
    const results = await page.evaluate(() => {
      const rows: any[] = [];
      const tableRows = document.querySelectorAll('.Table__TR');

      tableRows.forEach((row: any) => {
        const cells = row.querySelectorAll('.Table__TD');
        if (cells.length >= 5) {
          const date = cells[0]?.innerText?.trim() || '';
          const tournament = cells[1]?.innerText?.trim() || '';
          const position = cells[2]?.innerText?.trim() || '';
          const score = cells[3]?.innerText?.trim() || '';
          const earnings = cells[4]?.innerText?.trim() || '';

          // Get round scores (usually cells 5-8)
          const rounds: string[] = [];
          for (let i = 5; i < Math.min(9, cells.length); i++) {
            const roundScore = cells[i]?.innerText?.trim();
            if (roundScore && roundScore !== '--') {
              rounds.push(roundScore);
            }
          }

          // Filter out header rows or empty rows
          if (date && tournament && !date.includes('DATE')) {
            rows.push({
              date,
              tournament,
              position,
              score,
              earnings,
              rounds
            });
          }
        }
      });

      return rows;
    });

    console.log(`  Found ${results.length} tournaments for ${year}`);
    return results;
  } catch (error) {
    console.error(`  Error fetching data for ${playerName} (${year}):`, error);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Save tournament results to database
 */
async function saveTournamentResults(playerId: number, year: number, results: TournamentResult[]) {
  for (const result of results) {
    try {
      const { numeric: positionNumeric, isTied } = parsePosition(result.position);
      const { total: totalScore, toPar: scoreToPar } = parseScore(result.score);
      const earningsUsd = parseEarnings(result.earnings);

      // Determine status
      let status = 'completed';
      if (['CUT', 'MC'].includes(result.position)) status = 'cut';
      else if (result.position === 'WD') status = 'withdrawn';
      else if (result.position === 'DQ') status = 'disqualified';

      // Insert tournament result
      const { data, error } = await supabase
        .from('player_tournaments')
        .insert({
          player_id: playerId,
          tournament_id: 0, // Would need tournament mapping
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
          earnings_display: earningsUsd ? `$${earningsUsd.toLocaleString()}` : '--',
          status
        })
        .select('id')
        .single();

      if (error) {
        console.error(`    Failed to insert ${result.tournament}:`, error.message);
        continue;
      }

      // Insert round scores
      if (data && result.rounds.length > 0) {
        const rounds = result.rounds.map((score, index) => ({
          player_tournament_id: data.id,
          round_number: index + 1,
          score: parseInt(score, 10) || null
        }));

        await supabase.from('tournament_rounds').insert(rounds);
      }

      console.log(`    ✓ ${result.tournament} - ${result.position}`);
    } catch (error) {
      console.error(`    Error saving ${result.tournament}:`, error);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🏌️ ESPN Golf Data Fetcher with Playwright\n');

  // Check if Playwright needs to be installed
  try {
    const { chromium } = await import('playwright');
  } catch (error) {
    console.log('📦 Installing Playwright browsers...');
    const { execSync } = await import('child_process');
    execSync('bunx playwright install chromium', { stdio: 'inherit' });
  }

  // Years to fetch
  const years = [2020, 2021, 2022, 2023, 2024];

  for (const player of ESPN_PLAYERS.slice(0, 3)) { // Start with just 3 players for testing
    console.log(`\n📊 Processing ${player.name} (ESPN ID: ${player.id})`);

    // Upsert player
    const playerId = await upsertPlayer(player.id, player.name);
    if (!playerId) {
      console.error(`Failed to upsert player ${player.name}, skipping...`);
      continue;
    }

    // Fetch data for each year
    for (const year of years) {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fetch data
      const results = await fetchWithPlaywright(player.id, player.name, year);

      if (results.length > 0) {
        await saveTournamentResults(playerId, year, results);
      }
    }
  }

  console.log('\n✅ Data fetching completed!');
}

// Run the script
main().catch(console.error);