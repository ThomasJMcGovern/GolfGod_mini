-- =====================================================
-- SAFE ESPN Enhanced Schema - Can Run Multiple Times
-- =====================================================
-- This version can be run safely multiple times
-- It checks for existence before creating objects
-- Does NOT call refresh function (avoiding errors)
-- =====================================================

-- =====================================================
-- STEP 1: ENHANCE PLAYERS TABLE (IF NEEDED)
-- =====================================================

-- Add biographical fields only if they don't exist
ALTER TABLE players ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE players ADD COLUMN IF NOT EXISTS current_rank INT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS hometown TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS height_inches INT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS weight_lbs INT;

-- Create or replace the view with calculated age
CREATE OR REPLACE VIEW players_with_age AS
SELECT *,
  CASE 
    WHEN birthdate IS NOT NULL 
    THEN DATE_PART('year', AGE(birthdate))::INT
    ELSE NULL
  END as age
FROM players;

-- =====================================================
-- STEP 2: CREATE PLAYER_STATS TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS player_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season INT NOT NULL,
  
  -- Rankings (multiple ranking systems)
  current_rank INT,
  world_ranking INT,
  fedex_cup_rank INT,
  
  -- Tournament Participation Stats
  events_played INT DEFAULT 0,
  rounds_played INT DEFAULT 0,
  cuts_made INT DEFAULT 0,
  cuts_missed INT DEFAULT 0,
  withdrawals INT DEFAULT 0,
  
  -- Performance Stats
  wins INT DEFAULT 0,
  runner_ups INT DEFAULT 0,
  top_5s INT DEFAULT 0,
  top_10s INT DEFAULT 0,
  top_25s INT DEFAULT 0,
  missed_cuts INT DEFAULT 0,
  
  -- Scoring Statistics
  scoring_avg DECIMAL(6,3),
  scoring_avg_actual DECIMAL(6,3),
  scoring_avg_adjusted DECIMAL(6,3),
  rounds_under_70 INT DEFAULT 0,
  rounds_in_60s INT DEFAULT 0,
  
  -- Driving Statistics
  driving_distance DECIMAL(5,1),
  driving_distance_rank INT,
  driving_accuracy DECIMAL(5,2),
  driving_accuracy_rank INT,
  left_rough_tendency DECIMAL(5,2),
  right_rough_tendency DECIMAL(5,2),
  
  -- Approach/Iron Play Statistics
  gir_percentage DECIMAL(5,2),
  gir_rank INT,
  proximity_to_hole DECIMAL(5,2),
  
  -- Short Game Statistics
  scrambling_pct DECIMAL(5,2),
  scrambling_rank INT,
  sand_save_pct DECIMAL(5,2),
  sand_save_rank INT,
  
  -- Putting Statistics
  putts_per_round DECIMAL(5,2),
  putts_per_hole DECIMAL(4,3),
  putts_per_gir DECIMAL(4,3),
  one_putt_pct DECIMAL(5,2),
  three_putt_avoidance DECIMAL(5,2),
  putting_average DECIMAL(5,3),
  putting_rank INT,
  
  -- Strokes Gained Statistics
  sg_total DECIMAL(5,2),
  sg_off_the_tee DECIMAL(5,2),
  sg_approach DECIMAL(5,2),
  sg_around_green DECIMAL(5,2),
  sg_putting DECIMAL(5,2),
  
  -- Scoring Distribution
  eagles INT DEFAULT 0,
  birdies INT DEFAULT 0,
  pars INT DEFAULT 0,
  bogeys INT DEFAULT 0,
  double_bogeys INT DEFAULT 0,
  
  -- Per Round Averages
  birdies_per_round DECIMAL(4,2),
  eagles_per_round DECIMAL(4,3),
  bogeys_per_round DECIMAL(4,2),
  par_breakers_per_round DECIMAL(4,2),
  
  -- Streaks and Consistency
  consecutive_cuts_made INT DEFAULT 0,
  longest_streak_cuts_made INT DEFAULT 0,
  top10_streak INT DEFAULT 0,
  
  -- Financial Statistics
  total_earnings DECIMAL(12,2),
  earnings_rank INT,
  earnings_per_event DECIMAL(10,2),
  
  -- FedEx Cup Statistics
  fedex_cup_points INT,
  fedex_cup_rank_change INT,
  
  -- Course-specific Performance (stored as JSONB for flexibility)
  course_history JSONB,
  
  -- Metadata
  last_tournament TEXT,
  last_tournament_date DATE,
  last_position TEXT,
  data_source TEXT DEFAULT 'ESPN',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, season)
);

-- =====================================================
-- STEP 3: CREATE WEEKLY STATS TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS player_stats_weekly (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  week_ending DATE NOT NULL,
  week_number INT NOT NULL,
  season INT NOT NULL,
  
  -- Rankings snapshot
  current_rank INT,
  rank_change INT,
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
  
  -- Recent form and snapshots
  recent_form JSONB,
  stats_snapshot JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, week_ending)
);

-- =====================================================
-- STEP 4: CREATE INDEXES (IF NOT EXISTS)
-- =====================================================

-- Rankings indexes
CREATE INDEX IF NOT EXISTS idx_player_stats_current_rank 
  ON player_stats(season DESC, current_rank ASC) 
  WHERE current_rank IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_stats_world_ranking 
  ON player_stats(season DESC, world_ranking ASC) 
  WHERE world_ranking IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_stats_fedex_rank 
  ON player_stats(season DESC, fedex_cup_rank ASC) 
  WHERE fedex_cup_rank IS NOT NULL;

-- Other performance indexes
CREATE INDEX IF NOT EXISTS idx_player_stats_earnings 
  ON player_stats(season DESC, total_earnings DESC);

CREATE INDEX IF NOT EXISTS idx_player_stats_wins 
  ON player_stats(season DESC, wins DESC);

CREATE INDEX IF NOT EXISTS idx_player_stats_scoring 
  ON player_stats(season DESC, scoring_avg ASC) 
  WHERE scoring_avg IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_stats_driving 
  ON player_stats(season DESC, driving_distance DESC) 
  WHERE driving_distance IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_stats_putting 
  ON player_stats(season DESC, putts_per_hole ASC) 
  WHERE putts_per_hole IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_stats_composite 
  ON player_stats(season, player_id, current_rank);

-- Weekly stats indexes
CREATE INDEX IF NOT EXISTS idx_weekly_stats_player_week 
  ON player_stats_weekly(player_id, week_ending DESC);

CREATE INDEX IF NOT EXISTS idx_weekly_stats_week 
  ON player_stats_weekly(season, week_ending DESC);

-- =====================================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to calculate player age
CREATE OR REPLACE FUNCTION calculate_age(birthdate DATE)
RETURNS INT AS $$
BEGIN
  IF birthdate IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN DATE_PART('year', AGE(birthdate))::INT;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to refresh current season stats (WITHOUT calling it)
CREATE OR REPLACE FUNCTION refresh_current_season_stats()
RETURNS void AS $$
BEGIN
  -- Only refresh if the view exists
  IF EXISTS (
    SELECT 1 FROM pg_matviews 
    WHERE matviewname = 'current_season_leaderboard'
  ) THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY current_season_leaderboard;
  ELSE
    RAISE NOTICE 'Materialized view does not exist yet. Run initialize-materialized-view.sql';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get player's recent average
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
-- STEP 6: CREATE TRIGGER (IF NOT EXISTS)
-- =====================================================

-- Update timestamp trigger
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
-- STEP 7: SET PERMISSIONS
-- =====================================================

-- Grant permissions
GRANT SELECT ON player_stats TO anon;
GRANT SELECT ON player_stats_weekly TO anon;
GRANT SELECT ON players_with_age TO anon;

-- Enable RLS
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_weekly ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DROP POLICY IF EXISTS "Public read player stats" ON player_stats;
CREATE POLICY "Public read player stats" ON player_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read weekly stats" ON player_stats_weekly;
CREATE POLICY "Public read weekly stats" ON player_stats_weekly FOR SELECT USING (true);

-- =====================================================
-- STEP 8: ADD SAMPLE DATA (IF TABLES ARE EMPTY)
-- =====================================================

-- Update sample player birthdates only if not set
UPDATE players SET birthdate = '1996-06-21' 
WHERE full_name = 'Scottie Scheffler' AND birthdate IS NULL;

UPDATE players SET birthdate = '1989-05-04' 
WHERE full_name = 'Rory McIlroy' AND birthdate IS NULL;

UPDATE players SET birthdate = '1997-09-18' 
WHERE full_name = 'Viktor Hovland' AND birthdate IS NULL;

UPDATE players SET birthdate = '1992-03-17' 
WHERE full_name = 'Patrick Cantlay' AND birthdate IS NULL;

UPDATE players SET birthdate = '1994-11-10' 
WHERE full_name = 'Jon Rahm' AND birthdate IS NULL;

-- Insert sample stats only if not exists
INSERT INTO player_stats (
  player_id, season, current_rank,
  events_played, rounds_played, cuts_made,
  wins, top_10s, scoring_avg,
  driving_distance, driving_accuracy,
  gir_percentage, putts_per_hole,
  sand_save_pct, birdies_per_round,
  total_earnings, fedex_cup_points
) 
SELECT * FROM (VALUES
  (1, 2024, 1, 15, 58, 14, 6, 11, 69.234, 312.5, 62.3, 71.2, 1.725, 58.9, 4.21, 8234567, 3215),
  (2, 2024, 2, 17, 64, 15, 2, 9, 69.876, 318.2, 58.7, 68.9, 1.743, 55.2, 3.98, 5432100, 2890),
  (3, 2024, 3, 14, 52, 12, 3, 8, 69.543, 305.9, 65.1, 70.5, 1.712, 61.3, 4.05, 4567890, 2654),
  (4, 2024, 4, 16, 60, 13, 1, 7, 70.123, 298.3, 68.9, 69.2, 1.698, 57.8, 3.89, 3456789, 2321),
  (5, 2024, 5, 13, 48, 11, 2, 6, 70.234, 322.7, 55.4, 67.8, 1.765, 52.1, 3.76, 3234567, 2109)
) AS v(player_id, season, current_rank, events_played, rounds_played, cuts_made,
       wins, top_10s, scoring_avg, driving_distance, driving_accuracy,
       gir_percentage, putts_per_hole, sand_save_pct, birdies_per_round,
       total_earnings, fedex_cup_points)
WHERE EXISTS (SELECT 1 FROM players WHERE id = v.player_id)
ON CONFLICT (player_id, season) DO NOTHING;

-- =====================================================
-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '======================================';
  RAISE NOTICE 'Safe ESPN Schema Applied Successfully!';
  RAISE NOTICE '======================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables and functions created/updated:';
  RAISE NOTICE '✓ Players table enhanced';
  RAISE NOTICE '✓ Player_stats table (62+ fields)';
  RAISE NOTICE '✓ Player_stats_weekly table';
  RAISE NOTICE '✓ Helper functions created';
  RAISE NOTICE '✓ Sample data added';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step:';
  RAISE NOTICE 'Run initialize-materialized-view.sql to create the leaderboard view';
  RAISE NOTICE '';
END $$;