-- =====================================================
-- GolfGod Enhanced Database Schema - ESPN Stats Edition (FIXED)
-- =====================================================
-- This schema captures ALL ESPN player statistics
-- Run this AFTER fresh-schema.sql to enhance the database
-- FIXED: Removed generated age column (not immutable)
-- =====================================================

-- =====================================================
-- STEP 1: ENHANCE PLAYERS TABLE
-- =====================================================

-- Add biographical and ranking fields to players
ALTER TABLE players ADD COLUMN IF NOT EXISTS birthdate DATE;
-- Note: Age will be calculated in views/queries, not stored as generated column
ALTER TABLE players ADD COLUMN IF NOT EXISTS current_rank INT;  -- ESPN rank (different from world ranking)
ALTER TABLE players ADD COLUMN IF NOT EXISTS hometown TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS height_inches INT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS weight_lbs INT;

-- Create a view that includes calculated age
CREATE OR REPLACE VIEW players_with_age AS
SELECT *,
  CASE 
    WHEN birthdate IS NOT NULL 
    THEN DATE_PART('year', AGE(birthdate))::INT
    ELSE NULL
  END as age
FROM players;

-- =====================================================
-- STEP 2: DROP AND RECREATE PLAYER_STATS WITH ALL ESPN FIELDS
-- =====================================================

DROP TABLE IF EXISTS player_stats CASCADE;

CREATE TABLE player_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season INT NOT NULL,
  
  -- Rankings (multiple ranking systems)
  current_rank INT,           -- ESPN rank
  world_ranking INT,          -- OWGR
  fedex_cup_rank INT,        -- FedEx Cup standings
  
  -- Tournament Participation Stats
  events_played INT DEFAULT 0,
  rounds_played INT DEFAULT 0,   -- NEW: Total rounds (Events × ~4)
  cuts_made INT DEFAULT 0,
  cuts_missed INT DEFAULT 0,
  withdrawals INT DEFAULT 0,
  
  -- Performance Stats
  wins INT DEFAULT 0,
  runner_ups INT DEFAULT 0,      -- NEW: 2nd place finishes
  top_5s INT DEFAULT 0,          -- NEW: Top 5 finishes
  top_10s INT DEFAULT 0,
  top_25s INT DEFAULT 0,
  missed_cuts INT DEFAULT 0,
  
  -- Scoring Statistics
  scoring_avg DECIMAL(6,3),      -- e.g., 69.123
  scoring_avg_actual DECIMAL(6,3), -- Actual scoring average
  scoring_avg_adjusted DECIMAL(6,3), -- Adjusted for course difficulty
  rounds_under_70 INT DEFAULT 0,
  rounds_in_60s INT DEFAULT 0,
  
  -- Driving Statistics
  driving_distance DECIMAL(5,1),     -- Average distance in yards (e.g., 325.4)
  driving_distance_rank INT,
  driving_accuracy DECIMAL(5,2),     -- Percentage (e.g., 65.43%)
  driving_accuracy_rank INT,
  left_rough_tendency DECIMAL(5,2),  -- % drives in left rough
  right_rough_tendency DECIMAL(5,2), -- % drives in right rough
  
  -- Approach/Iron Play Statistics
  gir_percentage DECIMAL(5,2),       -- Greens in Regulation %
  gir_rank INT,
  proximity_to_hole DECIMAL(5,2),    -- Average feet from pin
  
  -- Short Game Statistics
  scrambling_pct DECIMAL(5,2),       -- Up and down %
  scrambling_rank INT,
  sand_save_pct DECIMAL(5,2),        -- NEW: Sand save percentage
  sand_save_rank INT,
  
  -- Putting Statistics
  putts_per_round DECIMAL(5,2),      -- Total putts per round
  putts_per_hole DECIMAL(4,3),       -- NEW: Putts per hole (ESPN metric)
  putts_per_gir DECIMAL(4,3),        -- Putts per green in regulation
  one_putt_pct DECIMAL(5,2),         -- One-putt percentage
  three_putt_avoidance DECIMAL(5,2), -- Avoiding 3-putts percentage
  putting_average DECIMAL(5,3),      -- SG: Putting
  putting_rank INT,
  
  -- Strokes Gained Statistics (PGA Tour's advanced metrics)
  sg_total DECIMAL(5,2),             -- Total strokes gained
  sg_off_the_tee DECIMAL(5,2),       -- SG: Off the tee
  sg_approach DECIMAL(5,2),          -- SG: Approach
  sg_around_green DECIMAL(5,2),      -- SG: Around the green
  sg_putting DECIMAL(5,2),           -- SG: Putting
  
  -- Scoring Distribution
  eagles INT DEFAULT 0,              -- Total eagles
  birdies INT DEFAULT 0,             -- Total birdies
  pars INT DEFAULT 0,                -- Total pars
  bogeys INT DEFAULT 0,              -- Total bogeys
  double_bogeys INT DEFAULT 0,       -- Total double bogeys or worse
  
  -- Per Round Averages
  birdies_per_round DECIMAL(4,2),    -- NEW: ESPN metric
  eagles_per_round DECIMAL(4,3),     
  bogeys_per_round DECIMAL(4,2),
  par_breakers_per_round DECIMAL(4,2), -- Birdies + Eagles per round
  
  -- Streaks and Consistency
  consecutive_cuts_made INT DEFAULT 0,
  longest_streak_cuts_made INT DEFAULT 0,
  top10_streak INT DEFAULT 0,
  
  -- Financial Statistics
  total_earnings DECIMAL(12,2),      -- Official PGA Tour money
  earnings_rank INT,
  earnings_per_event DECIMAL(10,2),  -- Average per tournament
  
  -- FedEx Cup Statistics
  fedex_cup_points INT,
  fedex_cup_rank_change INT,         -- Week over week change
  
  -- Course-specific Performance (stored as JSONB for flexibility)
  course_history JSONB,              -- Performance at specific courses
  
  -- Metadata
  last_tournament TEXT,               -- Most recent tournament played
  last_tournament_date DATE,
  last_position TEXT,                -- Position in last tournament
  data_source TEXT DEFAULT 'ESPN',   -- Where data came from
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, season)
);

-- =====================================================
-- STEP 3: ADD WEEKLY STATS SNAPSHOT TABLE
-- =====================================================
-- Track week-over-week changes in rankings and key stats

CREATE TABLE IF NOT EXISTS player_stats_weekly (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  week_ending DATE NOT NULL,
  week_number INT NOT NULL,          -- Week number in season (1-52)
  season INT NOT NULL,
  
  -- Rankings snapshot
  current_rank INT,
  rank_change INT,                   -- Change from previous week
  world_ranking INT,
  world_ranking_change INT,
  fedex_cup_rank INT,
  fedex_cup_rank_change INT,
  
  -- Key stats snapshot
  events_played INT,
  cuts_made INT,
  wins INT,
  top_10s INT,
  scoring_avg DECIMAL(6,3),
  driving_distance DECIMAL(5,1),
  driving_accuracy DECIMAL(5,2),
  gir_percentage DECIMAL(5,2),
  putts_per_hole DECIMAL(4,3),
  total_earnings DECIMAL(12,2),
  fedex_cup_points INT,
  
  -- Recent form (last 5 tournaments)
  recent_form JSONB,                 -- Array of recent finishes
  
  -- Full stats snapshot as JSONB for historical tracking
  stats_snapshot JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, week_ending)
);

-- =====================================================
-- STEP 4: CREATE PERFORMANCE INDEXES
-- =====================================================

-- Rankings indexes (most common queries)
CREATE INDEX IF NOT EXISTS idx_player_stats_current_rank ON player_stats(season DESC, current_rank ASC) 
  WHERE current_rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_player_stats_world_ranking ON player_stats(season DESC, world_ranking ASC) 
  WHERE world_ranking IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_player_stats_fedex_rank ON player_stats(season DESC, fedex_cup_rank ASC) 
  WHERE fedex_cup_rank IS NOT NULL;

-- Earnings and wins indexes
CREATE INDEX IF NOT EXISTS idx_player_stats_earnings ON player_stats(season DESC, total_earnings DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_wins ON player_stats(season DESC, wins DESC);

-- Statistical leaders indexes
CREATE INDEX IF NOT EXISTS idx_player_stats_scoring ON player_stats(season DESC, scoring_avg ASC) 
  WHERE scoring_avg IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_player_stats_driving ON player_stats(season DESC, driving_distance DESC) 
  WHERE driving_distance IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_player_stats_putting ON player_stats(season DESC, putts_per_hole ASC) 
  WHERE putts_per_hole IS NOT NULL;

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_player_stats_composite ON player_stats(season, player_id, current_rank);

-- Weekly stats indexes
CREATE INDEX IF NOT EXISTS idx_weekly_stats_player_week ON player_stats_weekly(player_id, week_ending DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_week ON player_stats_weekly(season, week_ending DESC);

-- =====================================================
-- STEP 5: CREATE MATERIALIZED VIEW FOR CURRENT SEASON
-- =====================================================

DROP MATERIALIZED VIEW IF EXISTS current_season_leaderboard CASCADE;

CREATE MATERIALIZED VIEW current_season_leaderboard AS
SELECT 
  p.id,
  p.full_name,
  p.country,
  -- Calculate age from birthdate
  CASE 
    WHEN p.birthdate IS NOT NULL 
    THEN DATE_PART('year', AGE(p.birthdate))::INT
    ELSE NULL
  END as age,
  ps.current_rank as rank,
  ps.world_ranking,
  ps.fedex_cup_rank,
  ps.events_played,
  ps.rounds_played,
  ps.cuts_made,
  ps.wins,
  ps.top_10s,
  ps.scoring_avg,
  ps.driving_distance,
  ps.driving_accuracy,
  ps.gir_percentage,
  ps.putts_per_hole,
  ps.sand_save_pct,
  ps.scrambling_pct,
  ps.birdies_per_round,
  ps.total_earnings,
  ps.fedex_cup_points,
  ps.sg_total,
  ps.last_tournament,
  ps.last_position,
  ps.last_updated
FROM players p
LEFT JOIN player_stats ps ON p.id = ps.player_id
WHERE ps.season = DATE_PART('year', CURRENT_DATE)
ORDER BY COALESCE(ps.current_rank, 999);

-- Create indexes on materialized view
-- IMPORTANT: Need a unique index for concurrent refresh to work
CREATE UNIQUE INDEX ON current_season_leaderboard(id);
CREATE INDEX ON current_season_leaderboard(rank);
CREATE INDEX ON current_season_leaderboard(full_name);
CREATE INDEX ON current_season_leaderboard(total_earnings DESC);
CREATE INDEX ON current_season_leaderboard(fedex_cup_points DESC);

-- =====================================================
-- STEP 6: CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to calculate player age (for use in queries)
CREATE OR REPLACE FUNCTION calculate_age(birthdate DATE)
RETURNS INT AS $$
BEGIN
  IF birthdate IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN DATE_PART('year', AGE(birthdate))::INT;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to refresh current season stats
CREATE OR REPLACE FUNCTION refresh_current_season_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY current_season_leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate player's average over last N tournaments
CREATE OR REPLACE FUNCTION get_player_recent_avg(
  p_player_id BIGINT,
  p_tournaments INT DEFAULT 5
)
RETURNS TABLE (
  scoring_avg DECIMAL,
  rounds_played INT,
  tournaments_played INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    AVG(score_to_par)::DECIMAL as scoring_avg,
    COUNT(*)::INT as rounds_played,
    COUNT(DISTINCT tournament_id)::INT as tournaments_played
  FROM (
    SELECT tr.*, t.start_date
    FROM tournament_results tr
    JOIN tournaments t ON tr.tournament_id = t.id
    WHERE tr.player_id = p_player_id
    ORDER BY t.start_date DESC
    LIMIT p_tournaments
  ) recent;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 7: CREATE TRIGGERS FOR DATA INTEGRITY
-- =====================================================

-- Update player stats last_updated timestamp
CREATE OR REPLACE FUNCTION update_player_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_player_stats_timestamp ON player_stats;
CREATE TRIGGER trigger_update_player_stats_timestamp
  BEFORE UPDATE ON player_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_player_stats_timestamp();

-- =====================================================
-- STEP 8: GRANT PERMISSIONS
-- =====================================================

-- Grant read permissions to anon users
GRANT SELECT ON player_stats TO anon;
GRANT SELECT ON player_stats_weekly TO anon;
GRANT SELECT ON current_season_leaderboard TO anon;
GRANT SELECT ON players_with_age TO anon;

-- Enable RLS
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_weekly ENABLE ROW LEVEL SECURITY;

-- Create read policies
DROP POLICY IF EXISTS "Public read player stats" ON player_stats;
CREATE POLICY "Public read player stats" ON player_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read weekly stats" ON player_stats_weekly;
CREATE POLICY "Public read weekly stats" ON player_stats_weekly FOR SELECT USING (true);

-- =====================================================
-- STEP 9: INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Update sample players with birthdates
UPDATE players SET birthdate = '1996-06-21' WHERE full_name = 'Scottie Scheffler';
UPDATE players SET birthdate = '1989-05-04' WHERE full_name = 'Rory McIlroy';
UPDATE players SET birthdate = '1997-09-18' WHERE full_name = 'Viktor Hovland';
UPDATE players SET birthdate = '1992-03-17' WHERE full_name = 'Patrick Cantlay';
UPDATE players SET birthdate = '1994-11-10' WHERE full_name = 'Jon Rahm';

-- Insert current season stats for our sample players
INSERT INTO player_stats (
  player_id, 
  season, 
  current_rank,
  events_played, 
  rounds_played,
  cuts_made,
  wins,
  top_10s,
  scoring_avg,
  driving_distance,
  driving_accuracy,
  gir_percentage,
  putts_per_hole,
  sand_save_pct,
  birdies_per_round,
  total_earnings,
  fedex_cup_points
) VALUES
  (1, 2024, 1, 15, 58, 14, 6, 11, 69.234, 312.5, 62.3, 71.2, 1.725, 58.9, 4.21, 8234567, 3215), -- Scottie
  (2, 2024, 2, 17, 64, 15, 2, 9, 69.876, 318.2, 58.7, 68.9, 1.743, 55.2, 3.98, 5432100, 2890), -- Rory
  (3, 2024, 3, 14, 52, 12, 3, 8, 69.543, 305.9, 65.1, 70.5, 1.712, 61.3, 4.05, 4567890, 2654), -- Viktor
  (4, 2024, 4, 16, 60, 13, 1, 7, 70.123, 298.3, 68.9, 69.2, 1.698, 57.8, 3.89, 3456789, 2321), -- Cantlay
  (5, 2024, 5, 13, 48, 11, 2, 6, 70.234, 322.7, 55.4, 67.8, 1.765, 52.1, 3.76, 3234567, 2109) -- Rahm
ON CONFLICT (player_id, season) DO UPDATE
SET 
  current_rank = EXCLUDED.current_rank,
  events_played = EXCLUDED.events_played,
  rounds_played = EXCLUDED.rounds_played,
  cuts_made = EXCLUDED.cuts_made,
  wins = EXCLUDED.wins,
  top_10s = EXCLUDED.top_10s,
  scoring_avg = EXCLUDED.scoring_avg,
  driving_distance = EXCLUDED.driving_distance,
  driving_accuracy = EXCLUDED.driving_accuracy,
  gir_percentage = EXCLUDED.gir_percentage,
  putts_per_hole = EXCLUDED.putts_per_hole,
  sand_save_pct = EXCLUDED.sand_save_pct,
  birdies_per_round = EXCLUDED.birdies_per_round,
  total_earnings = EXCLUDED.total_earnings,
  fedex_cup_points = EXCLUDED.fedex_cup_points,
  last_updated = NOW();

-- Refresh the materialized view
SELECT refresh_current_season_stats();

-- =====================================================
-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Enhanced ESPN Schema installed successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes made:';
  RAISE NOTICE '✓ Players table enhanced with biographical data';
  RAISE NOTICE '✓ Player stats table with 62+ ESPN metrics';
  RAISE NOTICE '✓ Weekly tracking table for historical data';
  RAISE NOTICE '✓ Materialized view for fast queries';
  RAISE NOTICE '✓ Helper functions for age calculation';
  RAISE NOTICE '✓ Sample data for 5 players';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: Age is calculated dynamically from birthdate';
  RAISE NOTICE '';
  RAISE NOTICE 'To view current leaderboard:';
  RAISE NOTICE 'SELECT * FROM current_season_leaderboard ORDER BY rank;';
  RAISE NOTICE '';
  RAISE NOTICE 'To view players with age:';
  RAISE NOTICE 'SELECT * FROM players_with_age;';
END $$;