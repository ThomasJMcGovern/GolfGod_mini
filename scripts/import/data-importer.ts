#!/usr/bin/env bun

/**
 * GolfGod Mini - Data Import Utility
 *
 * This script imports golf data from CSV/JSON files into Railway PostgreSQL database.
 *
 * Usage:
 *   bun scripts/import/data-importer.ts --type players --file data/players.csv
 *   bun scripts/import/data-importer.ts --type tournaments --file data/tournaments.json
 *   bun scripts/import/data-importer.ts --type results --file data/results.csv
 *   bun scripts/import/data-importer.ts --type stats --file data/stats.csv
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { getDatabase } from '../../src/lib/database';
import { log } from '../../src/lib/logger';
import {
  PlayerSchema,
  TournamentSchema,
  TournamentResultSchema,
  PlayerStatsSchema,
} from '../../src/types';

// Command line argument parsing
interface ImportArgs {
  type: 'players' | 'tournaments' | 'results' | 'stats';
  file: string;
  dryRun?: boolean;
  batch?: number;
}

const parseArgs = (): ImportArgs => {
  const args = process.argv.slice(2);
  const parsed: Partial<ImportArgs> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '') as keyof ImportArgs;
    const value = args[i + 1];

    if (key === 'type' && ['players', 'tournaments', 'results', 'stats'].includes(value)) {
      parsed.type = value as ImportArgs['type'];
    } else if (key === 'file') {
      parsed.file = value;
    } else if (key === 'dry-run') {
      parsed.dryRun = true;
      i--; // No value for boolean flags
    } else if (key === 'batch') {
      parsed.batch = parseInt(value, 10);
    }
  }

  if (!parsed.type || !parsed.file) {
    throw new Error('Usage: bun data-importer.ts --type <players|tournaments|results|stats> --file <path>');
  }

  return parsed as ImportArgs;
};

// File format detection and parsing
const parseFile = (filePath: string): any[] => {
  const content = readFileSync(filePath, 'utf-8');
  const extension = filePath.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

    case 'json':
      const jsonData = JSON.parse(content);
      return Array.isArray(jsonData) ? jsonData : [jsonData];

    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};

// Data transformation and validation
const transformPlayer = (row: any) => {
  // Convert string fields to appropriate types
  const transformed = {
    ...row,
    turned_pro: row.turned_pro ? parseInt(row.turned_pro, 10) : null,
    world_ranking: row.world_ranking ? parseInt(row.world_ranking, 10) : null,
    fedex_ranking: row.fedex_ranking ? parseInt(row.fedex_ranking, 10) : null,
    birthdate: row.birthdate || null,
  };

  return PlayerSchema.parse(transformed);
};

const transformTournament = (row: any) => {
  const transformed = {
    ...row,
    purse: row.purse ? parseInt(row.purse, 10) : null,
    field_size: row.field_size ? parseInt(row.field_size, 10) : null,
    year: row.year ? parseInt(row.year, 10) : null,
    start_date: row.start_date || null,
    end_date: row.end_date || null,
  };

  return TournamentSchema.parse(transformed);
};

const transformTournamentResult = (row: any) => {
  const transformed = {
    ...row,
    tournament_id: parseInt(row.tournament_id, 10),
    player_id: parseInt(row.player_id, 10),
    total_score: row.total_score ? parseInt(row.total_score, 10) : null,
    score_to_par: row.score_to_par ? parseInt(row.score_to_par, 10) : null,
    earnings: row.earnings ? parseInt(row.earnings, 10) : null,
    fedex_points: row.fedex_points ? parseInt(row.fedex_points, 10) : null,
    year: row.year ? parseInt(row.year, 10) : null,
    rounds: row.rounds ? JSON.parse(row.rounds) : null,
    rounds_detail: row.rounds_detail ? JSON.parse(row.rounds_detail) : null,
  };

  return TournamentResultSchema.parse(transformed);
};

const transformPlayerStats = (row: any) => {
  const transformed = {
    ...row,
    player_id: parseInt(row.player_id, 10),
    season: parseInt(row.season, 10),
    events_played: row.events_played ? parseInt(row.events_played, 10) : null,
    wins: row.wins ? parseInt(row.wins, 10) : null,
    top_10s: row.top_10s ? parseInt(row.top_10s, 10) : null,
    top_25s: row.top_25s ? parseInt(row.top_25s, 10) : null,
    cuts_made: row.cuts_made ? parseInt(row.cuts_made, 10) : null,
    cuts_missed: row.cuts_missed ? parseInt(row.cuts_missed, 10) : null,
    total_earnings: row.total_earnings ? parseInt(row.total_earnings, 10) : null,
    fedex_cup_points: row.fedex_cup_points ? parseInt(row.fedex_cup_points, 10) : null,
    scoring_avg: row.scoring_avg ? parseFloat(row.scoring_avg) : null,
    driving_distance: row.driving_distance ? parseFloat(row.driving_distance) : null,
    driving_accuracy: row.driving_accuracy ? parseFloat(row.driving_accuracy) : null,
    gir_percentage: row.gir_percentage ? parseFloat(row.gir_percentage) : null,
    putts_per_round: row.putts_per_round ? parseFloat(row.putts_per_round) : null,
    scrambling: row.scrambling ? parseFloat(row.scrambling) : null,
  };

  return PlayerStatsSchema.parse(transformed);
};

// Import functions for each data type
const importPlayers = async (data: any[], dryRun: boolean = false, batchSize: number = 100) => {
  const db = getDatabase();
  const validatedData = data.map(transformPlayer);

  log.info(`Importing ${validatedData.length} players...`);

  if (dryRun) {
    log.info('DRY RUN - Would import:', validatedData.slice(0, 3));
    return;
  }

  // Import in batches
  for (let i = 0; i < validatedData.length; i += batchSize) {
    const batch = validatedData.slice(i, i + batchSize);

    const { error } = await db
      .from('players')
      .upsert(batch, { onConflict: 'full_name' });

    if (error) {
      log.error(`Failed to import players batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    log.info(`Imported players batch ${i / batchSize + 1}/${Math.ceil(validatedData.length / batchSize)}`);
  }
};

const importTournaments = async (data: any[], dryRun: boolean = false, batchSize: number = 100) => {
  const db = getDatabase();
  const validatedData = data.map(transformTournament);

  log.info(`Importing ${validatedData.length} tournaments...`);

  if (dryRun) {
    log.info('DRY RUN - Would import:', validatedData.slice(0, 3));
    return;
  }

  for (let i = 0; i < validatedData.length; i += batchSize) {
    const batch = validatedData.slice(i, i + batchSize);

    const { error } = await db
      .from('tournaments')
      .upsert(batch, { onConflict: 'name,year' });

    if (error) {
      log.error(`Failed to import tournaments batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    log.info(`Imported tournaments batch ${i / batchSize + 1}/${Math.ceil(validatedData.length / batchSize)}`);
  }
};

const importTournamentResults = async (data: any[], dryRun: boolean = false, batchSize: number = 100) => {
  const db = getDatabase();
  const validatedData = data.map(transformTournamentResult);

  log.info(`Importing ${validatedData.length} tournament results...`);

  if (dryRun) {
    log.info('DRY RUN - Would import:', validatedData.slice(0, 3));
    return;
  }

  for (let i = 0; i < validatedData.length; i += batchSize) {
    const batch = validatedData.slice(i, i + batchSize);

    const { error } = await db
      .from('tournament_results')
      .upsert(batch, { onConflict: 'tournament_id,player_id' });

    if (error) {
      log.error(`Failed to import tournament results batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    log.info(`Imported results batch ${i / batchSize + 1}/${Math.ceil(validatedData.length / batchSize)}`);
  }
};

const importPlayerStats = async (data: any[], dryRun: boolean = false, batchSize: number = 100) => {
  const db = getDatabase();
  const validatedData = data.map(transformPlayerStats);

  log.info(`Importing ${validatedData.length} player stats...`);

  if (dryRun) {
    log.info('DRY RUN - Would import:', validatedData.slice(0, 3));
    return;
  }

  for (let i = 0; i < validatedData.length; i += batchSize) {
    const batch = validatedData.slice(i, i + batchSize);

    const { error } = await db
      .from('player_stats')
      .upsert(batch, { onConflict: 'player_id,season' });

    if (error) {
      log.error(`Failed to import player stats batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    log.info(`Imported stats batch ${i / batchSize + 1}/${Math.ceil(validatedData.length / batchSize)}`);
  }
};

// Main import function
const main = async () => {
  try {
    const args = parseArgs();
    log.info(`Starting import: ${args.type} from ${args.file}`);

    // Parse the data file
    const data = parseFile(args.file);
    log.info(`Parsed ${data.length} records from ${args.file}`);

    // Import based on type
    const batchSize = args.batch || 100;
    const dryRun = args.dryRun || false;

    switch (args.type) {
      case 'players':
        await importPlayers(data, dryRun, batchSize);
        break;
      case 'tournaments':
        await importTournaments(data, dryRun, batchSize);
        break;
      case 'results':
        await importTournamentResults(data, dryRun, batchSize);
        break;
      case 'stats':
        await importPlayerStats(data, dryRun, batchSize);
        break;
    }

    log.info('Import completed successfully!');
  } catch (error) {
    log.error('Import failed:', error);
    process.exit(1);
  }
};

// Run the import if called directly
if (import.meta.main) {
  main();
}