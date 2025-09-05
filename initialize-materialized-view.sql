-- =====================================================
-- Initialize Materialized View for Current Season
-- =====================================================
-- Run this AFTER safe-enhanced-espn-schema.sql
-- Creates and populates the materialized view safely
-- =====================================================

-- First check if we have the required tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'player_stats'
  ) THEN
    RAISE EXCEPTION 'player_stats table does not exist. Run safe-enhanced-espn-schema.sql first';
  END IF;
END $$;

-- Drop the view if it exists (to recreate with proper index)
DROP MATERIALIZED VIEW IF EXISTS current_season_leaderboard CASCADE;

-- Create the materialized view
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
-- IMPORTANT: First create the unique index for concurrent refresh
CREATE UNIQUE INDEX idx_current_season_leaderboard_id 
  ON current_season_leaderboard(id);

-- Then create other performance indexes
CREATE INDEX idx_current_season_leaderboard_rank 
  ON current_season_leaderboard(rank);

CREATE INDEX idx_current_season_leaderboard_name 
  ON current_season_leaderboard(full_name);

CREATE INDEX idx_current_season_leaderboard_earnings 
  ON current_season_leaderboard(total_earnings DESC);

CREATE INDEX idx_current_season_leaderboard_fedex 
  ON current_season_leaderboard(fedex_cup_points DESC);

-- Grant permissions on the materialized view
GRANT SELECT ON current_season_leaderboard TO anon;

-- Test that the refresh function now works
DO $$
BEGIN
  -- Try to refresh the view
  PERFORM refresh_current_season_stats();
  RAISE NOTICE 'Materialized view refresh successful!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Warning: Could not refresh view - %', SQLERRM;
END $$;

-- Success message with usage examples
DO $$
DECLARE
  v_player_count INTEGER;
  v_stats_count INTEGER;
BEGIN
  -- Count data
  SELECT COUNT(*) FROM current_season_leaderboard INTO v_player_count;
  SELECT COUNT(*) FROM player_stats WHERE season = 2024 INTO v_stats_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '======================================';
  RAISE NOTICE 'Materialized View Created Successfully!';
  RAISE NOTICE '======================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ current_season_leaderboard created';
  RAISE NOTICE '✅ Unique index added (supports concurrent refresh)';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '✅ Permissions granted';
  RAISE NOTICE '';
  RAISE NOTICE 'Current Data:';
  RAISE NOTICE '→ Players in leaderboard: %', v_player_count;
  RAISE NOTICE '→ Stats records for 2024: %', v_stats_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Example Queries:';
  RAISE NOTICE '';
  RAISE NOTICE '-- Top 10 players:';
  RAISE NOTICE 'SELECT rank, full_name, wins, scoring_avg, total_earnings';
  RAISE NOTICE 'FROM current_season_leaderboard';
  RAISE NOTICE 'WHERE rank <= 10';
  RAISE NOTICE 'ORDER BY rank;';
  RAISE NOTICE '';
  RAISE NOTICE '-- Driving distance leaders:';
  RAISE NOTICE 'SELECT full_name, driving_distance';
  RAISE NOTICE 'FROM current_season_leaderboard';
  RAISE NOTICE 'WHERE driving_distance IS NOT NULL';
  RAISE NOTICE 'ORDER BY driving_distance DESC';
  RAISE NOTICE 'LIMIT 10;';
  RAISE NOTICE '';
  RAISE NOTICE '-- To refresh the view:';
  RAISE NOTICE 'SELECT refresh_current_season_stats();';
  RAISE NOTICE '';
END $$;