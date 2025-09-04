-- Enhanced GolfGod Database Schema
-- Additional tables and columns for the full user experience

-- 1) Tours table
CREATE TABLE IF NOT EXISTS tour (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT,
  region TEXT, -- 'North America', 'Europe', 'Asia', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tours
INSERT INTO tour (name, abbreviation, region) VALUES 
  ('PGA Tour', 'PGA', 'North America'),
  ('European Tour', 'ET', 'Europe'),
  ('Asian Tour', 'AT', 'Asia'),
  ('Korn Ferry Tour', 'KFT', 'North America')
ON CONFLICT (name) DO NOTHING;

-- 2) Enhanced player table with profile information
ALTER TABLE player ADD COLUMN IF NOT EXISTS tour_id BIGINT REFERENCES tour(id);
ALTER TABLE player ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE player ADD COLUMN IF NOT EXISTS birthplace TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS height_inches INT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS weight_lbs INT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS turned_pro INT; -- year turned pro
ALTER TABLE player ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 3) Tournament status enum
CREATE TYPE tournament_status AS ENUM ('upcoming', 'current', 'completed');

-- Enhanced tournament table
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS tour_id BIGINT REFERENCES tour(id);
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS status tournament_status DEFAULT 'upcoming';
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS purse BIGINT; -- prize money in dollars
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS field_size INT;
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS defending_champion_id BIGINT REFERENCES player(id);
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS venue_city TEXT;
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS venue_state TEXT;
ALTER TABLE tournament ADD COLUMN IF NOT EXISTS venue_country TEXT DEFAULT 'USA';

-- 4) Player yearly statistics table
CREATE TABLE IF NOT EXISTS player_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id) ON DELETE CASCADE,
  year INT NOT NULL,
  tour_id BIGINT REFERENCES tour(id),
  
  -- Basic Stats
  events_played INT,
  cuts_made INT,
  wins INT,
  top_10s INT,
  top_25s INT,
  earnings BIGINT,
  fedex_cup_points INT,
  world_ranking INT,
  
  -- Scoring Stats
  scoring_avg NUMERIC(5,2),
  rounds_under_70 INT,
  rounds_60s INT,
  
  -- Driving Stats
  driving_distance_avg NUMERIC(5,1),
  driving_accuracy_pct NUMERIC(5,2),
  
  -- Approach Stats
  gir_pct NUMERIC(5,2), -- Greens in Regulation %
  proximity_to_hole_avg NUMERIC(5,1), -- in feet
  
  -- Short Game Stats
  scrambling_pct NUMERIC(5,2),
  sand_save_pct NUMERIC(5,2),
  
  -- Putting Stats
  putts_per_round_avg NUMERIC(5,2),
  one_putt_pct NUMERIC(5,2),
  putts_per_gir NUMERIC(5,2),
  putting_avg NUMERIC(5,3),
  
  -- Strokes Gained Stats
  sg_total NUMERIC(5,2),
  sg_tee_to_green NUMERIC(5,2),
  sg_off_the_tee NUMERIC(5,2),
  sg_approach NUMERIC(5,2),
  sg_around_green NUMERIC(5,2),
  sg_putting NUMERIC(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, year, tour_id)
);

-- 5) Inside the Ropes content (placeholder for future features)
CREATE TABLE IF NOT EXISTS inside_the_ropes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT, -- 'Course Analysis', 'Weather Impact', 'Player Form', etc.
  content JSONB,
  is_premium BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6) Player tournament history (for Tournament Overview section)
CREATE TABLE IF NOT EXISTS player_tournament_history (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id) ON DELETE CASCADE,
  tournament_id BIGINT REFERENCES tournament(id) ON DELETE CASCADE,
  year INT,
  finish_position INT,
  prize_money INT,
  total_score INT,
  score_to_par INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, tournament_id, year)
);

-- 7) Update RLS policies for new tables
ALTER TABLE tour ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE inside_the_ropes ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tournament_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read tours" ON tour FOR SELECT USING (true);
CREATE POLICY "public read player_stats" ON player_stats FOR SELECT USING (true);
CREATE POLICY "public read inside_the_ropes" ON inside_the_ropes FOR SELECT USING (true);
CREATE POLICY "public read player_tournament_history" ON player_tournament_history FOR SELECT USING (true);

-- 8) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_tour ON player(tour_id);
CREATE INDEX IF NOT EXISTS idx_tournament_tour ON tournament(tour_id);
CREATE INDEX IF NOT EXISTS idx_tournament_status ON tournament(status);
CREATE INDEX IF NOT EXISTS idx_player_stats_year ON player_stats(year);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_stats(player_id);

-- 9) Sample data for demonstration
-- Update existing players with profile info
UPDATE player 
SET tour_id = 1, -- PGA Tour
    birthdate = '1989-05-04',
    birthplace = 'Holywood, Northern Ireland',
    height_inches = 69,
    weight_lbs = 161,
    turned_pro = 2007,
    college = NULL
WHERE full_name = 'Rory McIlroy';

UPDATE player 
SET tour_id = 1,
    birthdate = '1996-06-21',
    birthplace = 'Ridgewood, NJ',
    height_inches = 71,
    weight_lbs = 180,
    turned_pro = 2018,
    college = 'University of Texas'
WHERE full_name = 'Scottie Scheffler';

-- Update tournament statuses
UPDATE tournament 
SET tour_id = 1,
    status = 'completed',
    purse = 20000000,
    field_size = 156
WHERE name LIKE '%2025%';