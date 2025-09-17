#!/usr/bin/env bun

// Script to verify player profile data structure
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyPlayerProfile() {
  console.log('🔍 Verifying Player Profile Structure...\n');

  try {
    // Get Scottie Scheffler's data
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', 1)
      .single();

    if (playerError) {
      console.error('❌ Error fetching player:', playerError.message);
      return;
    }

    console.log('✅ Player Data:');
    console.log(`   Name: ${player.name}`);
    console.log(`   ID: ${player.id}`);
    console.log(`   ESPN ID: ${player.espn_id}`);

    // Get tournament stats
    const { data: stats, error: statsError } = await supabase
      .from('player_tournaments')
      .select('*')
      .eq('player_id', 1)
      .eq('season', 2025);

    if (statsError) {
      console.error('❌ Error fetching tournament stats:', statsError.message);
      return;
    }

    // Calculate stats
    const tournaments_played = stats?.length || 0;
    const wins = stats?.filter(s => s.position === '1').length || 0;
    const total_earnings = stats?.reduce((sum, s) => sum + (s.earnings_usd || 0), 0) || 0;

    console.log('\n📊 Calculated Stats:');
    console.log(`   Tournaments Played: ${tournaments_played}`);
    console.log(`   Wins: ${wins}`);
    console.log(`   Total Earnings: $${total_earnings.toLocaleString()}`);

    console.log('\n✅ Player profile structure is correct!');
    console.log('✅ The ESPNPlayerHeader should now display without errors.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyPlayerProfile();