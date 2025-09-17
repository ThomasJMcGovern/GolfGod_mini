# Supabase Database Integration - ESPN-Style Golf Statistics

This document provides instructions for setting up and using the Supabase database integration for ESPN-style tournament results display.

## 🚀 Quick Start

### 1. Set Up Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project
2. Note your project URL and anon key from Project Settings → API

### 2. Configure Environment

Create `.env.local` in the project root:

```env
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL="https://iqzmzyuqjcydqolkcqtr.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxem16eXVxamN5ZHFvbGtjcXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzUwMTUsImV4cCI6MjA3MzY1MTAxNX0.RTDJD5aQ7A_b-bmkwdAuGbKAQGp0_sPj2_x2jpoNaAk"

# Optional: For direct database access (migrations/seeding)
VITE_DATABASE_URL="postgresql://postgres.iqzmzyuqjcydqolkcqtr:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

### 3. Run Database Migration

In your Supabase dashboard:

1. Go to SQL Editor
2. Copy the contents of `/database/supabase-schema.sql`
3. Run the SQL to create tables, views, and indexes

### 4. Seed Sample Data

Run the seeding script to populate with Scottie Scheffler's 2025 data:

```bash
bun run scripts/seed-supabase.ts
```

This will insert:
- Scottie Scheffler's player profile
- 10 PGA Tour tournaments from 2025
- Complete scoring and earnings data
- Round-by-round scores

### 5. Start the Application

```bash
bun dev
```

Navigate to http://localhost:5173 and:
1. Click on "PGA Tour"
2. Select "Choose Player"
3. Select Scottie Scheffler
4. View ESPN-style tournament results

## 📊 Database Schema

### Core Tables

**`players`** - Player profiles with ESPN data
- `id`: Primary key
- `espn_id`: ESPN player ID
- `name`: Player full name
- `country`, `birthdate`, `college`, etc.

**`tournaments`** - Tournament information
- `id`: Primary key
- `name`: Tournament name
- `season`: Year
- `course_name`: Golf course
- `venue`: Location
- `tour_type`: PGA TOUR, European Tour, etc.

**`player_tournaments`** - Results linking table
- Links players to tournaments
- Stores position, scores, earnings
- Format: "T9", "1", "CUT", etc.

**`tournament_rounds`** - Individual round scores
- Round 1-4 scores for each tournament

### Database Views

**`player_tournament_results_espn`** - Main results view
- Formatted for ESPN-style display
- Includes all scoring and earnings data
- JSON aggregated rounds

**`player_season_summary`** - Season statistics
- Wins, top-10s, earnings totals
- Average score to par

**`player_available_years`** - Years with data
- Used for year selector dropdown

## 🎨 ESPN-Style Features

### Tournament Results Table
- **Date Range**: "1/30 - 2/2" format
- **Tournament Name**: With course/venue
- **Position**: Color-coded (gold for wins, green for top-10)
- **Score**: "67-70-69-67" with total and to-par
- **Earnings**: "$1,782,000" formatted

### Year Selector
- Dropdown with available seasons
- Dynamically updates results
- Maintains selection in URL

### Position Highlighting
- **Win (1)**: Gold/yellow text
- **Top 10**: Green text
- **Regular**: Default text
- **Cut/WD/DQ**: Red/orange text

## 🔧 Customization

### Adding More Players

```typescript
// In seed-supabase.ts
const newPlayer = {
  name: 'Rory McIlroy',
  espn_id: 3470,
  country: 'Northern Ireland',
  // ... other fields
};

await supabase.from('players').insert([newPlayer]);
```

### Adding Tournaments

```typescript
const newTournament = {
  name: 'U.S. Open',
  season: 2025,
  start_date: '2025-06-12',
  end_date: '2025-06-15',
  course_name: 'Los Angeles Country Club',
  // ... other fields
};

await supabase.from('tournaments').insert([newTournament]);
```

## 🔍 Troubleshooting

### Connection Issues
- Verify Supabase credentials in `.env.local`
- Check Supabase project is active
- Ensure RLS policies allow read access

### No Data Showing
- Run the seed script: `bun run scripts/seed-supabase.ts`
- Check browser console for errors
- Verify database views exist

### Demo Mode
If Supabase is not configured, the app runs in demo mode with mock data.

## 📚 API Reference

### Hooks

**`usePlayerProfile(playerId)`**
- Fetches complete player profile with stats

**`usePlayerTournamentResultsByTour(playerId, year)`**
- Gets tournament results grouped by tour

**`usePlayerTournamentYears(playerId)`**
- Returns available years for dropdown

### Query Helpers

```typescript
import { queries } from '@/lib/supabase';

// Get player by ESPN ID
const player = await queries.getPlayerByEspnId(9478);

// Get season tournaments
const results = await queries.getPlayerTournaments(1, 2025);

// Get season summary
const summary = await queries.getPlayerSeasonSummary(1, 2025);
```

## 🚢 Deployment

For production deployment:

1. Use Supabase environment variables in your deployment platform
2. Ensure database migrations are run on production
3. Seed initial data or import from existing source
4. Enable proper RLS policies for security

## 📧 Support

For issues or questions:
- Check the [Supabase docs](https://supabase.com/docs)
- Review the schema in `/database/supabase-schema.sql`
- Check seeding script logs for errors