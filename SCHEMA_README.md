# GolfGod Database Schema Documentation

## Current Database Structure

Your Supabase database now contains a complete ESPN-enhanced golf statistics tracking system.

### Tables (5)

1. **`players`** - Golfer information
   - Basic: id, full_name, country, turned_pro, world_ranking, fedex_ranking
   - ESPN Enhanced: birthdate, current_rank, hometown, college, height_inches, weight_lbs

2. **`tournaments`** - Golf tournament events
   - id, name, start_date, end_date, course_name, course_location, purse, field_size, status

3. **`tournament_results`** - Tournament leaderboard/results
   - Links players to tournaments with position, scores, rounds, earnings

4. **`player_stats`** - Comprehensive ESPN statistics (62+ columns)
   - Rankings, tournament participation, performance metrics
   - Scoring, driving, approach, short game, putting statistics
   - Strokes Gained metrics, financial data, streaks

5. **`player_stats_weekly`** - Historical weekly snapshots
   - Tracks ranking changes and key stats over time

### Views (3)

1. **`current_leaderboard`** - Simple current tournament view
2. **`player_recent_form`** - Last 5 tournaments per player
3. **`players_with_age`** - Players table with calculated age from birthdate

### Materialized Views (1)

1. **`current_season_leaderboard`** - Pre-computed current season statistics
   - Optimized for fast queries with indexes
   - Refresh with: `SELECT refresh_current_season_stats();`

## SQL Files Reference

### Core Schema Files (Keep These)

- **`fresh-schema.sql`** - Base 4-table structure
  - Run this first to set up the basic schema
  - Creates: players, tournaments, tournament_results, player_stats (basic version)

- **`enhanced-espn-schema-fixed.sql`** - Complete ESPN enhancement
  - Run after fresh-schema to add all ESPN statistics
  - Adds 60+ statistical columns to player_stats
  - Creates materialized view and helper functions

- **`safe-enhanced-espn-schema.sql`** - Safe re-runnable version
  - Can run multiple times without errors
  - Uses IF NOT EXISTS for all objects
  - Good for updates and fixes

- **`initialize-materialized-view.sql`** - Creates the materialized view
  - Run this to create/recreate the current_season_leaderboard
  - Includes proper unique index for concurrent refresh

## Quick Start Guide

If starting fresh:
```sql
1. Run: fresh-schema.sql
2. Run: enhanced-espn-schema-fixed.sql
3. Done! The materialized view is included
```

If fixing issues:
```sql
1. Run: safe-enhanced-espn-schema.sql
2. Run: initialize-materialized-view.sql
```

## Sample Queries

### Get Current Top 10
```sql
SELECT rank, full_name, wins, scoring_avg, total_earnings
FROM current_season_leaderboard
WHERE rank <= 10
ORDER BY rank;
```

### Find Driving Distance Leaders
```sql
SELECT full_name, driving_distance, driving_accuracy
FROM current_season_leaderboard
WHERE driving_distance IS NOT NULL
ORDER BY driving_distance DESC
LIMIT 10;
```

### Get Player's Recent Form
```sql
SELECT * FROM player_recent_form
WHERE full_name = 'Scottie Scheffler';
```

### Refresh Materialized View
```sql
SELECT refresh_current_season_stats();
```

## Notes

- The "Unrestricted" label in Supabase means Row Level Security allows public read access (this is correct)
- Sample data for 5 players is included (Scheffler, McIlroy, Hovland, Cantlay, Rahm)
- All tables have proper indexes for performance
- The materialized view auto-calculates age from birthdate