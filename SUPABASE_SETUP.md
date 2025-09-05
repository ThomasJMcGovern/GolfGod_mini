# Supabase Setup Guide - GolfGod Mini

## Overview
This guide will help you set up the simplified database schema for GolfGod Mini.

## Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

## Step 2: Run the Fresh Schema
1. Copy the entire contents of `fresh-schema.sql`
2. Paste it into the SQL Editor
3. Click "Run" (or press Cmd/Ctrl + Enter)
4. You should see success messages in the output

## Step 3: Verify Tables Were Created
Go to the "Table Editor" in Supabase and verify you have these 4 tables:
- **players** - Golfer profiles
- **tournaments** - Tournament events
- **tournament_results** - Player results in tournaments
- **player_stats** - Seasonal statistics

## Step 4: Add Sample Data (Optional)
The schema includes 5 sample players and 5 sample tournaments. To add tournament results:

1. Go to Table Editor → tournament_results
2. Click "Insert row"
3. Add some sample results:

```sql
-- Example: Add Scottie Scheffler winning The Masters
INSERT INTO tournament_results (tournament_id, player_id, position, score_to_par, total_score, rounds, earnings)
VALUES (
  1, -- The Masters (check your tournament IDs)
  1, -- Scottie Scheffler (check your player IDs)
  '1',
  -10,
  278,
  '[68, 71, 71, 68]'::jsonb,
  3600000
);

-- Example: Add Rory McIlroy finishing T5
INSERT INTO tournament_results (tournament_id, player_id, position, score_to_par, total_score, rounds, earnings)
VALUES (
  1, -- The Masters
  2, -- Rory McIlroy
  'T5',
  -5,
  283,
  '[71, 73, 71, 68]'::jsonb,
  696000
);
```

## Step 5: Test the App
1. Start your development server: `bun dev`
2. Open http://localhost:5173
3. Navigate to Player Dashboard
4. You should see the sample players
5. Navigate to Tournament Dashboard
6. You should see the sample tournaments

## Database Structure

### Players Table
- `id` - Unique identifier
- `full_name` - Player's name (must be unique)
- `country` - Player's country
- `turned_pro` - Year turned professional
- `world_ranking` - Current world ranking
- `fedex_ranking` - FedEx Cup ranking

### Tournaments Table
- `id` - Unique identifier
- `name` - Tournament name (must be unique)
- `start_date` / `end_date` - Tournament dates
- `course_name` - Golf course name
- `course_location` - City, State/Country
- `purse` - Prize money
- `status` - upcoming/current/completed

### Tournament Results Table
- Links players to tournaments
- Stores position, scores, rounds, earnings
- One entry per player per tournament

### Player Stats Table
- Season-long statistics
- One entry per player per season
- Includes scoring average, driving stats, putting stats, etc.

## Adding Data Manually

### Via Supabase Dashboard
1. Go to Table Editor
2. Select the table you want to add to
3. Click "Insert row"
4. Fill in the fields
5. Click "Save"

### Via SQL
Use the SQL Editor to insert multiple records:

```sql
-- Add a new player
INSERT INTO players (full_name, country, turned_pro, world_ranking)
VALUES ('Jordan Spieth', 'USA', 2012, 15);

-- Add a new tournament
INSERT INTO tournaments (name, start_date, end_date, course_name, course_location, purse)
VALUES ('AT&T Pebble Beach Pro-Am', '2025-01-30', '2025-02-02', 'Pebble Beach Golf Links', 'Pebble Beach, CA', 9000000);
```

## Troubleshooting

### Connection Issues
- Check your `.env.local` file has the correct Supabase URL and anon key
- Verify the tables exist in Supabase
- Check the RLS policies are enabled (they should allow public read access)

### No Data Showing
- Verify data exists in the tables using Table Editor
- Check browser console for errors
- Try refreshing the page

### Type Errors
- The TypeScript types in `src/types.ts` match the new schema
- If you modify the database, update the types accordingly

## Next Steps
1. Add real tournament data
2. Add player results for tournaments
3. Add seasonal statistics for players
4. Consider building a simple admin interface for data entry
5. Later: Add a simple CSV import if needed (without the complexity)

## Important Notes
- We've removed all the complex import pipeline
- Data entry is now manual via Supabase dashboard
- This keeps things simple and maintainable
- You can always add import functionality later if needed