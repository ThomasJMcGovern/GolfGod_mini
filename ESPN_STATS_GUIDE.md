# ESPN Stats Database Schema Guide

## Overview
This enhanced schema captures **ALL ESPN player statistics** with proper normalization, performance optimization, and historical tracking capabilities.

## Schema Structure

### 1. Enhanced Players Table
Now includes biographical data:
- **Age**: Calculated from birthdate
- **Current Rank**: ESPN ranking (different from world ranking)
- **Physical Stats**: Height, weight
- **Background**: Hometown, college

### 2. Complete Player Stats Table (62 fields!)
Comprehensive statistics matching ESPN's data:

#### Rankings (3 systems)
- **ESPN Rank**: Current leaderboard position
- **World Ranking**: Official World Golf Ranking
- **FedEx Cup Rank**: Season-long points race

#### Tournament Participation
- Events Played, Rounds Played
- Cuts Made/Missed
- Withdrawals

#### Performance Metrics
- Wins, Runner-ups
- Top 5s, Top 10s, Top 25s

#### Scoring Statistics
- **Scoring Average**: Multiple calculations (actual, adjusted)
- **Scoring Distribution**: Eagles, birdies, pars, bogeys
- **Per-Round Averages**: Birdies/round (ESPN's key metric)

#### Driving Statistics
- **Distance**: Average driving distance in yards
- **Accuracy**: Fairway hit percentage
- **Tendency**: Left/right rough percentages

#### Approach Play
- **GIR%**: Greens in Regulation
- **Proximity**: Average distance to pin

#### Short Game
- **Scrambling**: Up-and-down percentage
- **Sand Saves**: Bunker save percentage (ESPN metric)

#### Putting
- **Putts per Hole**: ESPN's preferred metric
- **Putts per Round**: Traditional metric
- **One-Putt %**: Making percentage

#### Advanced Metrics (Strokes Gained)
- SG: Total, Off-the-Tee, Approach, Around-Green, Putting

#### Financial
- Total Earnings, Per-Event Average
- FedEx Cup Points

### 3. Weekly Stats Tracking
Historical snapshots for trend analysis:
- Week-over-week ranking changes
- Key stats progression
- Recent form tracking

### 4. Materialized View: `current_season_leaderboard`
Pre-computed current season data for fast queries:
```sql
-- Instant leaderboard query
SELECT * FROM current_season_leaderboard 
ORDER BY rank 
LIMIT 10;
```

## Running the Schema

### Step 1: Run Base Schema (if not done)
```bash
# In Supabase SQL Editor
# Run fresh-schema.sql first
```

### Step 2: Run ESPN Enhancement
```bash
# In Supabase SQL Editor
# Run enhanced-espn-schema.sql
```

### Step 3: Verify Installation
```sql
-- Check if new columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'player_stats'
ORDER BY ordinal_position;

-- Should see 62+ columns!
```

## Key Design Decisions

### Why Materialized View?
- **Performance**: Pre-computed rankings and stats
- **Efficiency**: Single query instead of complex JOINs
- **Freshness**: Can be refreshed on schedule

### Why Weekly Snapshots?
- **Historical Trends**: Track player progression
- **Week-over-Week Changes**: See momentum shifts
- **Form Analysis**: Recent performance patterns

### Why JSONB Fields?
- **Flexibility**: Store varying course-specific data
- **Future-Proof**: Add new stats without schema changes
- **Performance**: PostgreSQL optimizes JSONB queries

## Sample Queries

### Get Current Top 10
```sql
SELECT rank, full_name, scoring_avg, wins, total_earnings
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

### Get Player's Weekly Progress
```sql
SELECT week_ending, current_rank, rank_change, scoring_avg
FROM player_stats_weekly
WHERE player_id = 1 AND season = 2024
ORDER BY week_ending DESC;
```

### Compare Putting Stats
```sql
SELECT full_name, putts_per_hole, one_putt_pct, sg_putting
FROM current_season_leaderboard
WHERE putts_per_hole IS NOT NULL
ORDER BY putts_per_hole ASC
LIMIT 20;
```

## Data Entry Examples

### Add/Update Player Stats
```sql
INSERT INTO player_stats (
  player_id, season, current_rank,
  events_played, rounds_played, cuts_made,
  wins, top_10s, scoring_avg,
  driving_distance, driving_accuracy,
  gir_percentage, putts_per_hole,
  sand_save_pct, birdies_per_round,
  total_earnings, fedex_cup_points
) VALUES (
  1, 2024, 1,  -- Scottie Scheffler, 2024 season, Rank #1
  15, 58, 14,  -- 15 events, 58 rounds, 14 cuts
  6, 11, 69.234,  -- 6 wins, 11 top-10s, 69.234 scoring
  312.5, 62.3,  -- 312.5 yards, 62.3% accuracy
  71.2, 1.725,  -- 71.2% GIR, 1.725 putts/hole
  58.9, 4.21,  -- 58.9% sand saves, 4.21 birdies/round
  8234567, 3215  -- $8.2M earnings, 3215 FedEx points
) ON CONFLICT (player_id, season) 
DO UPDATE SET
  current_rank = EXCLUDED.current_rank,
  events_played = EXCLUDED.events_played,
  -- ... update other fields
  last_updated = NOW();
```

### Refresh Materialized View
```sql
-- Manual refresh
REFRESH MATERIALIZED VIEW current_season_leaderboard;

-- Or use the helper function
SELECT refresh_current_season_stats();
```

## TypeScript Integration

Import the new types:
```typescript
import { 
  ESPNPlayer, 
  ESPNPlayerStats, 
  CurrentSeasonLeaderboard,
  ESPN_STAT_CATEGORIES,
  formatStatValue 
} from './types/espn-stats';

// Use the types
const playerStats: ESPNPlayerStats = {
  player_id: 1,
  season: 2024,
  current_rank: 1,
  scoring_avg: 69.234,
  // ... etc
};

// Format for display
const formatted = formatStatValue(69.234, 'decimal'); // "69.23"
const money = formatStatValue(8234567, 'money'); // "$8,234,567"
```

## Performance Considerations

### Indexes Created
- Rankings (current_rank, world_ranking, fedex_cup_rank)
- Earnings and wins for leaderboards
- Statistical leaders (scoring, driving, putting)
- Composite indexes for common queries

### Query Optimization Tips
1. **Use the materialized view** for current season data
2. **Filter by season first** in historical queries
3. **Use indexes** - check query plans with EXPLAIN
4. **Batch updates** when importing multiple players

## Next Steps

1. **Set up data import**:
   - Create scripts to fetch ESPN data
   - Schedule regular updates (daily/weekly)

2. **Build UI components**:
   - Leaderboard table
   - Player stat cards
   - Trend charts

3. **Add caching**:
   - Cache materialized view refreshes
   - Implement Redis for hot queries

4. **Historical Analysis**:
   - Build trend analysis queries
   - Create player comparison tools

## Maintenance

### Weekly Tasks
- Refresh materialized view
- Update weekly snapshots
- Archive old weekly data

### Monthly Tasks
- Analyze query performance
- Update indexes if needed
- Clean up old snapshots

### Season End
- Archive season stats
- Reset for new season
- Update season year

---

This schema is designed for **reliability**, **performance**, and **completeness**. It captures every ESPN stat while maintaining query speed through smart indexing and materialized views.