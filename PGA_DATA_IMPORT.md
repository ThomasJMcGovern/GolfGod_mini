# PGA Tour Data Import Guide

## Overview
This document explains how to import the real PGA Tour 2024 statistics data into your GolfGod database.

## Data Source
- **File**: `/Users/tjmcgovern/Downloads/data.pdf`
- **Players**: 200 PGA Tour professionals
- **Season**: 2024
- **Statistics**: 17 key performance metrics per player

## Import Process

### Step 1: Run the Import Script
In your Supabase SQL Editor, run:
```sql
insert-pga-data.sql
```

This script will:
1. Insert/update all 200 players in the `players` table
2. Insert their 2024 statistics into the `player_stats` table
3. Refresh the materialized view for fast queries

### Step 2: Verify the Import
Check that data was imported correctly:
```sql
-- Count players with stats
SELECT COUNT(*) FROM player_stats WHERE season = 2024;
-- Should return ~100 (script includes first 100 players)

-- View top 10 by earnings
SELECT 
  rank, 
  full_name, 
  total_earnings, 
  wins, 
  scoring_avg
FROM current_season_leaderboard 
ORDER BY rank 
LIMIT 10;
```

## Data Mapping

The PDF columns map to our database as follows:

| PDF Column | Database Column | Type | Notes |
|------------|----------------|------|-------|
| RK | current_rank | INT | ESPN/PGA Tour ranking |
| NAME | full_name | TEXT | Player name (in players table) |
| AGE | - | - | Not stored (calculated from birthdate) |
| EARNINGS | total_earnings | DECIMAL | Removed $ and commas |
| CUP | fedex_cup_points | INT | FedEx Cup points |
| EVNTS | events_played | INT | Tournaments entered |
| RNDS | rounds_played | INT | Total rounds |
| CUTS | cuts_made | INT | Cuts made |
| TOP10 | top_10s | INT | Top 10 finishes |
| WINS | wins | INT | Tournament victories |
| SCORE | scoring_avg | DECIMAL | Scoring average |
| DDIS | driving_distance | DECIMAL | Yards |
| DACC | driving_accuracy | DECIMAL | Percentage |
| GIR | gir_percentage | DECIMAL | Greens in regulation % |
| PUTTS | putts_per_hole | DECIMAL | Average putts per hole |
| SAND | sand_save_pct | DECIMAL | Sand save percentage |
| BIRDS | birdies_per_round | DECIMAL | Birdies per round |

## Notes

### Data Completeness
- The import script includes the top 100 players with complete data
- Some players have missing statistics (shown as 0 in the PDF)
- Players without certain stats will have NULL values in those columns

### Countries
Players are assigned countries based on known nationalities:
- USA players: Scheffler, Thomas, Cantlay, etc.
- International: McIlroy (N. Ireland), Fleetwood (England), Hovland (Norway), etc.

### Updates
The script uses `ON CONFLICT` clauses, so it can be run multiple times safely:
- Existing players won't be duplicated
- Stats will be updated if they already exist

## Sample Queries

### Current Leaderboard
```sql
SELECT * FROM current_season_leaderboard 
ORDER BY rank 
LIMIT 20;
```

### Driving Distance Leaders
```sql
SELECT 
  full_name, 
  driving_distance,
  driving_accuracy
FROM current_season_leaderboard 
WHERE driving_distance IS NOT NULL
ORDER BY driving_distance DESC 
LIMIT 10;
```

### Best Putters
```sql
SELECT 
  full_name,
  putts_per_hole,
  one_putt_pct
FROM current_season_leaderboard
WHERE putts_per_hole IS NOT NULL
ORDER BY putts_per_hole ASC
LIMIT 10;
```

### Money Leaders
```sql
SELECT 
  rank,
  full_name,
  total_earnings,
  events_played,
  total_earnings / NULLIF(events_played, 0) as avg_per_event
FROM current_season_leaderboard
ORDER BY total_earnings DESC
LIMIT 20;
```

## Troubleshooting

### If Import Fails
1. Check that the enhanced schema is installed:
   ```sql
   SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'player_stats';
   -- Should return 60+ columns
   ```

2. Ensure the players table exists:
   ```sql
   SELECT COUNT(*) FROM players;
   ```

3. Try running in smaller batches if needed

### Missing Data
Some players in the PDF have incomplete data (especially lower-ranked players). These will have NULL or 0 values for missing statistics.

## Next Steps

After importing:
1. The materialized view will be automatically refreshed
2. Your app can now display real PGA Tour statistics
3. Consider adding more recent tournament results
4. Set up regular data updates from ESPN/PGA Tour APIs