#!/usr/bin/env bun

// Test connection to existing Supabase database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔌 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing Supabase credentials in .env.local');
  console.log('Please ensure you have set:');
  console.log('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('  VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\n📊 Testing Database Connection...\n');

  try {
    // Test 1: Basic connection with players table
    console.log('1️⃣ Testing players table...');
    const { data: players, error: playersError, count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: false })
      .limit(3);

    if (playersError) {
      console.error('   ❌ Error accessing players table:', playersError.message);
      console.error('   Code:', playersError.code);
      console.error('   Details:', playersError.details);
    } else {
      console.log(`   ✅ Players table accessible - Found ${count || players?.length || 0} players`);
      if (players && players.length > 0) {
        players.forEach(p => {
          console.log(`      - ${p.name} (ID: ${p.id}, ESPN: ${p.espn_id})`);
        });
      }
    }

    // Test 2: Check tournaments table
    console.log('\n2️⃣ Testing tournaments table...');
    const { data: tournaments, error: tournamentsError, count: tournamentCount } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact' })
      .eq('season', 2025)
      .limit(3);

    if (tournamentsError) {
      console.error('   ❌ Error accessing tournaments table:', tournamentsError.message);
    } else {
      console.log(`   ✅ Tournaments table accessible - Found ${tournamentCount || tournaments?.length || 0} tournaments for 2025`);
      if (tournaments && tournaments.length > 0) {
        tournaments.forEach(t => {
          console.log(`      - ${t.name}`);
        });
      }
    }

    // Test 3: Check player_tournaments table (the main data)
    console.log('\n3️⃣ Testing player_tournaments table...');
    const { data: results, error: resultsError, count: resultsCount } = await supabase
      .from('player_tournaments')
      .select('*', { count: 'exact' })
      .eq('player_id', 1)
      .eq('season', 2025)
      .limit(3);

    if (resultsError) {
      console.error('   ❌ Error accessing player_tournaments table:', resultsError.message);
    } else {
      console.log(`   ✅ Player tournaments accessible - Found ${resultsCount || results?.length || 0} results`);
      if (results && results.length > 0) {
        results.forEach(r => {
          console.log(`      - ${r.tournament_name}: ${r.position} (${r.earnings_display || r.earnings_usd})`);
        });
      }
    }

    // Test 4: Check if we can join tables (test complex queries)
    console.log('\n4️⃣ Testing table joins...');
    const { data: joinTest, error: joinError } = await supabase
      .from('player_tournaments')
      .select(`
        id,
        tournament_name,
        position,
        player_id,
        players!player_tournaments_player_id_fkey (
          name,
          espn_id
        )
      `)
      .eq('season', 2025)
      .limit(2);

    if (joinError) {
      console.error('   ⚠️  Cannot perform joins (this is okay, we can work without them):', joinError.message);
    } else {
      console.log('   ✅ Table joins working');
      if (joinTest && joinTest.length > 0) {
        joinTest.forEach(r => {
          const playerName = r.players?.name || 'Unknown';
          console.log(`      - ${playerName}: ${r.tournament_name} (${r.position})`);
        });
      }
    }

    // Test 5: Check RLS policies
    console.log('\n5️⃣ Testing Row Level Security...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('players')
      .select('id')
      .limit(1);

    if (rlsError) {
      if (rlsError.code === 'PGRST301') {
        console.error('   ❌ RLS is blocking reads - you may need to add a policy');
        console.log('   Run this in Supabase SQL Editor:');
        console.log('   ALTER TABLE players ENABLE ROW LEVEL SECURITY;');
        console.log('   CREATE POLICY "Allow public read" ON players FOR SELECT USING (true);');
      } else {
        console.error('   ⚠️  RLS issue:', rlsError.message);
      }
    } else {
      console.log('   ✅ RLS policies allow reading data');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 CONNECTION SUMMARY:');
    console.log('='.repeat(60));

    if (!playersError && !tournamentsError && !resultsError) {
      console.log('✅ All core tables are accessible');
      console.log('✅ Your existing database schema works perfectly!');
      console.log('✅ The app should be able to display your data');

      console.log('\n📌 Next steps:');
      console.log('1. The app is running at http://localhost:5173');
      console.log('2. Navigate to PGA Tour → Choose Player');
      console.log('3. Select a player to see their tournament results');

      if (joinError) {
        console.log('\n⚠️  Note: Table joins aren\'t working, but we can handle this in the app');
      }
    } else {
      console.log('⚠️  Some tables have access issues');
      console.log('Check the errors above and fix any RLS policies if needed');
    }

  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    console.log('\nPossible issues:');
    console.log('1. Check your internet connection');
    console.log('2. Verify your Supabase project is active');
    console.log('3. Confirm your credentials are correct');
  }
}

// Run the test
testConnection();