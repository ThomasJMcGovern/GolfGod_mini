#!/usr/bin/env bun

// Supabase Database Seeding Script - Scottie Scheffler 2025 Data
// Run with: bun run scripts/seed-supabase.ts

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

// Scottie Scheffler player data
const scottieScheffler = {
  name: 'Scottie Scheffler',
  espn_id: 9478,
  country: 'USA',
  birthdate: '1996-06-21',
  birthplace: 'Dallas, Texas',
  college: 'University of Texas',
  swing_type: 'Right' as const,
  height: '6\'3"',
  weight: '200 lbs',
  turned_pro: 2018,
  world_ranking: 1,
  fedex_ranking: 1,
  photo_url: 'https://a.espncdn.com/combiner/i?img=/i/headshots/golf/players/full/9478.png'
};

// 2025 Tournament data (20 tournaments)
const tournaments2025 = [
  {
    name: 'AT&T Pebble Beach Pro-Am',
    season: 2025,
    start_date: '2025-01-30',
    end_date: '2025-02-02',
    course_name: 'Pebble Beach Golf Links',
    venue: 'Pebble Beach Golf Links',
    tour_type: 'PGA TOUR',
    purse: 9000000,
    field_size: 156,
    status: 'completed'
  },
  {
    name: 'WM Phoenix Open',
    season: 2025,
    start_date: '2025-02-06',
    end_date: '2025-02-09',
    course_name: 'TPC Scottsdale (Stadium Course)',
    venue: 'TPC Scottsdale',
    tour_type: 'PGA TOUR',
    purse: 8800000,
    field_size: 132,
    status: 'completed'
  },
  {
    name: 'The Genesis Invitational',
    season: 2025,
    start_date: '2025-02-13',
    end_date: '2025-02-16',
    course_name: 'Torrey Pines (South Course)',
    venue: 'Torrey Pines',
    tour_type: 'PGA TOUR',
    purse: 20000000,
    field_size: 120,
    status: 'completed'
  },
  {
    name: 'Arnold Palmer Invitational pres. by Mastercard',
    season: 2025,
    start_date: '2025-03-06',
    end_date: '2025-03-09',
    course_name: 'Arnold Palmer\'s Bay Hill Club & Lodge',
    venue: 'Bay Hill Club & Lodge',
    tour_type: 'PGA TOUR',
    purse: 20000000,
    field_size: 120,
    status: 'completed'
  },
  {
    name: 'THE PLAYERS Championship',
    season: 2025,
    start_date: '2025-03-13',
    end_date: '2025-03-17',
    course_name: 'TPC Sawgrass (THE PLAYERS Stadium Course)',
    venue: 'TPC Sawgrass',
    tour_type: 'PGA TOUR',
    purse: 25000000,
    field_size: 144,
    status: 'completed'
  },
  {
    name: 'Texas Children\'s Houston Open',
    season: 2025,
    start_date: '2025-03-27',
    end_date: '2025-03-30',
    course_name: 'Memorial Park Golf Course',
    venue: 'Memorial Park Golf Course',
    tour_type: 'PGA TOUR',
    purse: 9200000,
    field_size: 144,
    status: 'completed'
  },
  {
    name: 'Masters Tournament',
    season: 2025,
    start_date: '2025-04-10',
    end_date: '2025-04-13',
    course_name: 'Augusta National Golf Club',
    venue: 'Augusta National Golf Club',
    tour_type: 'PGA TOUR',
    purse: 20000000,
    field_size: 90,
    status: 'completed'
  },
  {
    name: 'RBC Heritage',
    season: 2025,
    start_date: '2025-04-17',
    end_date: '2025-04-20',
    course_name: 'Harbour Town Golf Links',
    venue: 'Harbour Town Golf Links',
    tour_type: 'PGA TOUR',
    purse: 20000000,
    field_size: 132,
    status: 'completed'
  },
  {
    name: 'THE CJ CUP Byron Nelson',
    season: 2025,
    start_date: '2025-05-01',
    end_date: '2025-05-04',
    course_name: 'TPC Craig Ranch',
    venue: 'TPC Craig Ranch',
    tour_type: 'PGA TOUR',
    purse: 9500000,
    field_size: 156,
    status: 'completed'
  },
  {
    name: 'Wells Fargo Championship',
    season: 2025,
    start_date: '2025-05-08',
    end_date: '2025-05-11',
    course_name: 'Quail Hollow Club',
    venue: 'Quail Hollow Club',
    tour_type: 'PGA TOUR',
    purse: 20000000,
    field_size: 156,
    status: 'completed'
  }
];

// Scottie Scheffler's 2025 tournament results
const schefflerResults2025 = [
  {
    tournament_index: 0, // AT&T Pebble Beach
    date_range: '1/30 - 2/2',
    position: 'T9',
    position_numeric: 9,
    is_tied: true,
    overall_score: '67-70-69-67',
    rounds: [67, 70, 69, 67],
    total_score: 273,
    score_to_par: -15,
    earnings_usd: 535000,
    earnings_display: '$535,000',
    status: 'completed'
  },
  {
    tournament_index: 1, // WM Phoenix Open
    date_range: '2/6 - 2/9',
    position: 'T25',
    position_numeric: 25,
    is_tied: true,
    overall_score: '69-66-68-72',
    rounds: [69, 66, 68, 72],
    total_score: 275,
    score_to_par: -9,
    earnings_usd: 69197,
    earnings_display: '$69,197',
    status: 'completed'
  },
  {
    tournament_index: 2, // Genesis Invitational
    date_range: '2/13 - 2/16',
    position: 'T3',
    position_numeric: 3,
    is_tied: true,
    overall_score: '70-67-76-66',
    rounds: [70, 67, 76, 66],
    total_score: 279,
    score_to_par: -9,
    earnings_usd: 1200000,
    earnings_display: '$1,200,000',
    status: 'completed'
  },
  {
    tournament_index: 3, // Arnold Palmer Invitational
    date_range: '3/6 - 3/9',
    position: 'T11',
    position_numeric: 11,
    is_tied: true,
    overall_score: '71-72-71-70',
    rounds: [71, 72, 71, 70],
    total_score: 284,
    score_to_par: -4,
    earnings_usd: 451250,
    earnings_display: '$451,250',
    status: 'completed'
  },
  {
    tournament_index: 4, // THE PLAYERS
    date_range: '3/13 - 3/17',
    position: 'T20',
    position_numeric: 20,
    is_tied: true,
    overall_score: '69-70-72-73',
    rounds: [69, 70, 72, 73],
    total_score: 284,
    score_to_par: -4,
    earnings_usd: 240250,
    earnings_display: '$240,250',
    status: 'completed'
  },
  {
    tournament_index: 5, // Houston Open
    date_range: '3/27 - 3/30',
    position: 'T2',
    position_numeric: 2,
    is_tied: true,
    overall_score: '67-62-69-63',
    rounds: [67, 62, 69, 63],
    total_score: 261,
    score_to_par: -19,
    earnings_usd: 845500,
    earnings_display: '$845,500',
    status: 'completed'
  },
  {
    tournament_index: 6, // Masters
    date_range: '4/10 - 4/13',
    position: '4',
    position_numeric: 4,
    is_tied: false,
    overall_score: '68-71-72-69',
    rounds: [68, 71, 72, 69],
    total_score: 280,
    score_to_par: -8,
    earnings_usd: 1008000,
    earnings_display: '$1,008,000',
    status: 'completed'
  },
  {
    tournament_index: 7, // RBC Heritage
    date_range: '4/17 - 4/20',
    position: 'T8',
    position_numeric: 8,
    is_tied: true,
    overall_score: '64-70-68-70',
    rounds: [64, 70, 68, 70],
    total_score: 272,
    score_to_par: -12,
    earnings_usd: 580000,
    earnings_display: '$580,000',
    status: 'completed'
  },
  {
    tournament_index: 8, // CJ CUP Byron Nelson
    date_range: '5/1 - 5/4',
    position: '1',
    position_numeric: 1,
    is_tied: false,
    overall_score: '61-63-66-63',
    rounds: [61, 63, 66, 63],
    total_score: 253,
    score_to_par: -31,
    earnings_usd: 1782000,
    earnings_display: '$1,782,000',
    status: 'completed'
  },
  {
    tournament_index: 9, // Wells Fargo
    date_range: '5/8 - 5/11',
    position: 'T5',
    position_numeric: 5,
    is_tied: true,
    overall_score: '70-68-69-71',
    rounds: [70, 68, 69, 71],
    total_score: 278,
    score_to_par: -10,
    earnings_usd: 620000,
    earnings_display: '$620,000',
    status: 'completed'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting Supabase database seeding...\n');

  try {
    // 1. Insert Scottie Scheffler
    console.log('👤 Inserting player: Scottie Scheffler');
    const { data: player, error: playerError } = await supabase
      .from('players')
      .upsert([scottieScheffler], { onConflict: 'espn_id' })
      .select()
      .single();

    if (playerError) throw playerError;
    console.log('✅ Player inserted successfully');

    // 2. Insert tournaments
    console.log('\n🏆 Inserting tournaments...');
    const { data: tournamentData, error: tournamentsError } = await supabase
      .from('tournaments')
      .upsert(tournaments2025, { onConflict: 'name,season' })
      .select();

    if (tournamentsError) throw tournamentsError;
    console.log(`✅ ${tournamentData.length} tournaments inserted`);

    // 3. Insert player tournament results
    console.log('\n📊 Inserting tournament results for Scottie Scheffler...');

    for (const result of schefflerResults2025) {
      const tournament = tournamentData[result.tournament_index];

      // Insert the player_tournament record
      const playerTournament = {
        player_id: player.id,
        tournament_id: tournament.id,
        season: 2025,
        date_range: result.date_range,
        tournament_name: tournament.name,
        course_name: tournament.course_name,
        venue: tournament.venue,
        position: result.position,
        position_numeric: result.position_numeric,
        is_tied: result.is_tied,
        overall_score: result.overall_score,
        total_score: result.total_score,
        score_to_par: result.score_to_par,
        earnings_usd: result.earnings_usd,
        earnings_display: result.earnings_display,
        fedex_points: Math.floor(result.earnings_usd / 1000), // Simplified FedEx points
        status: result.status
      };

      const { data: ptData, error: ptError } = await supabase
        .from('player_tournaments')
        .upsert([playerTournament], { onConflict: 'player_id,tournament_id' })
        .select()
        .single();

      if (ptError) throw ptError;

      // Insert round scores
      const rounds = result.rounds.map((score, index) => ({
        player_tournament_id: ptData.id,
        round_number: index + 1,
        score: score
      }));

      const { error: roundsError } = await supabase
        .from('tournament_rounds')
        .upsert(rounds, { onConflict: 'player_tournament_id,round_number' });

      if (roundsError) throw roundsError;

      console.log(`✅ ${tournament.name}: ${result.position} (${result.score_to_par})`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Player: Scottie Scheffler (ID: ${player.id})`);
    console.log(`- Tournaments: ${tournamentData.length} events`);
    console.log(`- Results: ${schefflerResults2025.length} tournament results with round scores`);
    console.log('\nYou can now run the app and see the ESPN-style tournament results!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();