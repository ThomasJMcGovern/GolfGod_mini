#!/usr/bin/env bun

// Script to check existing Supabase tables and adapt integration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingTables() {
  console.log('🔍 Checking existing Supabase tables...\n');

  try {
    // Check if tables exist by querying them
    const tableChecks = [
      { name: 'players', query: () => supabase.from('players').select('id').limit(1) },
      { name: 'tournaments', query: () => supabase.from('tournaments').select('id').limit(1) },
      { name: 'player_tournaments', query: () => supabase.from('player_tournaments').select('id').limit(1) },
      { name: 'tournament_rounds', query: () => supabase.from('tournament_rounds').select('id').limit(1) },
    ];

    const existingTables: string[] = [];

    for (const check of tableChecks) {
      const { error } = await check.query();
      if (!error || error.code === 'PGRST116') { // PGRST116 = no rows returned (table exists but empty)
        existingTables.push(check.name);
        console.log(`✅ Table '${check.name}' exists`);
      } else if (error.code === '42P01') { // Table doesn't exist
        console.log(`❌ Table '${check.name}' does not exist`);
      } else {
        console.log(`⚠️ Table '${check.name}' check returned: ${error.message}`);
      }
    }

    console.log('\n📊 Checking for existing data...\n');

    // Check for Scottie Scheffler
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .or('espn_id.eq.9478,name.ilike.%Scheffler%');

    if (!playersError && players && players.length > 0) {
      console.log('✅ Found existing players:');
      players.forEach(p => {
        console.log(`   - ${p.name} (ESPN ID: ${p.espn_id}, DB ID: ${p.id})`);
      });
    } else {
      console.log('ℹ️ No player data found for Scottie Scheffler');
    }

    // Check for 2025 tournaments
    const { data: tournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('season', 2025)
      .limit(5);

    if (!tournamentsError && tournaments && tournaments.length > 0) {
      console.log(`\n✅ Found ${tournaments.length} tournaments for 2025:`);
      tournaments.forEach(t => {
        console.log(`   - ${t.name}`);
      });
    } else {
      console.log('\nℹ️ No 2025 tournament data found');
    }

    // Check for player tournament results
    const { data: results, error: resultsError } = await supabase
      .from('player_tournaments')
      .select('*')
      .eq('season', 2025)
      .limit(5);

    if (!resultsError && results && results.length > 0) {
      console.log(`\n✅ Found ${results.length} tournament results for 2025`);
    } else {
      console.log('\nℹ️ No 2025 tournament results found');
    }

    // Check if the ESPN view exists
    const { error: viewError } = await supabase
      .from('player_tournament_results_espn')
      .select('id')
      .limit(1);

    if (!viewError) {
      console.log('\n✅ ESPN results view exists');
    } else {
      console.log('\n⚠️ ESPN results view does not exist - you may need to create it');
    }

    // Provide recommendations
    console.log('\n📝 Recommendations:\n');

    if (existingTables.includes('players') && existingTables.includes('player_tournaments')) {
      console.log('✅ Your database has the required tables from the ESPN scraper');
      console.log('✅ The existing schema is compatible with our ESPN-style display');

      if (!players || players.length === 0) {
        console.log('\n📌 Next steps:');
        console.log('1. Run the modified seed script to add Scottie Scheffler\'s data');
        console.log('2. Or import data from your ESPN scraper');
      } else {
        console.log('\n✅ You have player data - the app should work!');
        console.log('📌 Just make sure to check that the ESPN view exists or create it.');
      }
    } else {
      console.log('⚠️ Some required tables are missing');
      console.log('📌 Run the schema migration from /database/supabase-schema.sql');
    }

    // Check if we need to create the ESPN view
    if (viewError) {
      console.log('\n📌 Create the ESPN view with this SQL:\n');
      console.log(`
CREATE OR REPLACE VIEW player_tournament_results_espn AS
SELECT
    pt.id,
    pt.player_id,
    pt.tournament_id,
    pt.season as year,
    pt.date_range,
    pt.tournament_name,
    pt.tournament_name as course_name, -- Using tournament_name as fallback
    pt.position,
    pt.position_numeric,
    pt.is_tied,
    pt.overall_score,
    pt.total_score,
    pt.score_to_par,
    pt.earnings_usd as earnings,
    pt.earnings_display,
    pt.status,
    'PGA TOUR' as tour_type, -- Default tour type
    t.start_date,
    t.end_date,
    t.url as tournament_url,
    -- Aggregate round scores
    (SELECT json_agg(tr.score ORDER BY tr.round_number)
     FROM tournament_rounds tr
     WHERE tr.player_tournament_id = pt.id) as rounds,
    -- Format score display
    CASE
        WHEN pt.score_to_par IS NULL THEN pt.overall_score
        WHEN pt.score_to_par = 0 THEN CONCAT(pt.total_score::text, ' (E)')
        WHEN pt.score_to_par > 0 THEN CONCAT(pt.total_score::text, ' (+', pt.score_to_par::text, ')')
        ELSE CONCAT(pt.total_score::text, ' (', pt.score_to_par::text, ')')
    END as score_display
FROM player_tournaments pt
LEFT JOIN tournaments t ON pt.tournament_id = t.id
ORDER BY t.start_date DESC;
      `);
    }

  } catch (error) {
    console.error('\n❌ Error checking tables:', error);
  }
}

// Run the check
checkExistingTables();