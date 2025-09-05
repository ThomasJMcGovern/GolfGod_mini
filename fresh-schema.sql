-- GolfGod Mini - Fresh Simplified Schema
-- Drop and recreate all tables for a clean start
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS tournament_results CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS round CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS tournament CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS client_log CASCADE;

-- Also drop import-related tables
DROP TABLE IF EXISTS import_staging CASCADE;
DROP TABLE IF EXISTS import_session CASCADE;
DROP TABLE IF EXISTS import_mapping_rules CASCADE;
DROP TABLE IF EXISTS import_log CASCADE;
DROP TABLE IF EXISTS import_entity_cache CASCADE;

-- Drop other enhanced schema tables
DROP TABLE IF EXISTS weather_conditions CASCADE;
DROP TABLE IF EXISTS player_course_stats CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS tour CASCADE;
DROP TABLE IF EXISTS inside_the_ropes CASCADE;
DROP TABLE IF EXISTS user_picks CASCADE;
DROP TABLE IF EXISTS player_matchups CASCADE;
DROP TABLE IF EXISTS player_tournament_history CASCADE;

-- Drop any custom types
DROP TYPE IF EXISTS tournament_status CASCADE;

-- =====================================================
-- STEP 2: CREATE SIMPLE SCHEMA (4 tables only)
-- =====================================================

-- 1. Players table (golfers)
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL UNIQUE,
  country TEXT,
  turned_pro INT,
  world_ranking INT,
  fedex_ranking INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tournaments table (events)
CREATE TABLE tournaments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  start_date DATE,
  end_date DATE,
  course_name TEXT,
  course_location TEXT,
  purse DECIMAL(12,2),
  field_size INT,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'current', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tournament Results table (leaderboard/results)
CREATE TABLE tournament_results (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position TEXT, -- "1", "T2", "CUT", "WD", "DQ"
  total_score INT, -- 272, 285, etc
  score_to_par INT, -- -10, +2, E (stored as 0)
  rounds JSONB, -- [68, 70, 69, 71] or {"r1": 68, "r2": 70, "r3": 69, "r4": 71}
  earnings DECIMAL(10,2),
  fedex_points INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, player_id)
);

-- 4. Player Stats table (seasonal statistics)
CREATE TABLE player_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season INT NOT NULL,
  events_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  top_10s INT DEFAULT 0,
  top_25s INT DEFAULT 0,
  cuts_made INT DEFAULT 0,
  cuts_missed INT DEFAULT 0,
  scoring_avg DECIMAL(5,2),
  driving_distance DECIMAL(5,1),
  driving_accuracy DECIMAL(5,2), -- percentage
  gir_percentage DECIMAL(5,2), -- greens in regulation
  putts_per_round DECIMAL(5,2),
  scrambling DECIMAL(5,2), -- percentage
  total_earnings DECIMAL(12,2),
  fedex_cup_points INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season)
);

-- =====================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Players indexes
CREATE INDEX idx_players_world_ranking ON players(world_ranking);
CREATE INDEX idx_players_country ON players(country);

-- Tournaments indexes
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date DESC);
CREATE INDEX idx_tournaments_status ON tournaments(status);

-- Tournament Results indexes
CREATE INDEX idx_results_tournament ON tournament_results(tournament_id);
CREATE INDEX idx_results_player ON tournament_results(player_id);
CREATE INDEX idx_results_position ON tournament_results(position);

-- Player Stats indexes
CREATE INDEX idx_stats_player ON player_stats(player_id);
CREATE INDEX idx_stats_season ON player_stats(season);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for anonymous users
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tournament_results FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_stats FOR SELECT USING (true);

-- =====================================================
-- STEP 5: CREATE HELPFUL VIEWS
-- =====================================================

-- Current tournament leaderboard view
CREATE OR REPLACE VIEW current_leaderboard AS
SELECT 
  t.name as tournament_name,
  t.start_date,
  p.full_name as player_name,
  p.country,
  tr.position,
  tr.score_to_par,
  tr.total_score,
  tr.rounds,
  tr.earnings
FROM tournament_results tr
JOIN tournaments t ON tr.tournament_id = t.id
JOIN players p ON tr.player_id = p.id
WHERE t.status = 'current'
ORDER BY 
  CASE 
    WHEN tr.position ~ '^\d+$' THEN CAST(tr.position AS INT)
    ELSE 999
  END,
  tr.score_to_par;

-- Player recent form view (last 5 tournaments)
CREATE OR REPLACE VIEW player_recent_form AS
WITH recent_results AS (
  SELECT 
    p.id as player_id,
    p.full_name,
    t.name as tournament_name,
    t.start_date,
    tr.position,
    tr.score_to_par,
    ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY t.start_date DESC) as recency
  FROM players p
  JOIN tournament_results tr ON p.id = tr.player_id
  JOIN tournaments t ON tr.tournament_id = t.id
  WHERE t.status = 'completed'
)
SELECT * FROM recent_results WHERE recency <= 5;

-- =====================================================
-- STEP 6: GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on all tables to anon users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant all permissions to authenticated users (for admin)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- STEP 7: ADD SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample players
INSERT INTO players (full_name, country, turned_pro, world_ranking) VALUES
  ('Scottie Scheffler', 'USA', 2018, 1),
  ('Rory McIlroy', 'Northern Ireland', 2007, 2),
  ('Viktor Hovland', 'Norway', 2019, 3),
  ('Patrick Cantlay', 'USA', 2011, 4),
  ('Jon Rahm', 'Spain', 2016, 5)
ON CONFLICT (full_name) DO NOTHING;

-- Insert sample tournaments
INSERT INTO tournaments (name, start_date, end_date, course_name, course_location, purse, status) VALUES
  ('The Masters', '2024-04-11', '2024-04-14', 'Augusta National', 'Augusta, GA', 20000000, 'completed'),
  ('U.S. Open', '2024-06-13', '2024-06-16', 'Pinehurst No. 2', 'Pinehurst, NC', 20000000, 'completed'),
  ('The Open Championship', '2024-07-18', '2024-07-21', 'Royal Troon', 'Scotland', 17000000, 'completed'),
  ('PGA Championship', '2024-05-16', '2024-05-19', 'Valhalla', 'Louisville, KY', 18500000, 'completed'),
  ('THE PLAYERS Championship', '2024-03-14', '2024-03-17', 'TPC Sawgrass', 'Ponte Vedra Beach, FL', 25000000, 'completed')
ON CONFLICT (name) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'GolfGod Fresh Schema created successfully!';
  RAISE NOTICE 'Tables created: players, tournaments, tournament_results, player_stats';
  RAISE NOTICE 'Views created: current_leaderboard, player_recent_form';
  RAISE NOTICE 'Sample data added for 5 players and 5 tournaments';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Add tournament results using the Supabase dashboard';
  RAISE NOTICE '2. Add player stats for the current season';
  RAISE NOTICE '3. Test the app with real data';
END $$;