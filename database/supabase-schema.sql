-- GolfGod Mini - Supabase ESPN-Compatible Schema
-- Designed to match ESPN golf statistics interface
-- Date: 2025-01-16

-- =====================================================
-- CORE TABLES - ESPN Data Structure
-- =====================================================

-- Players table (matches ESPN player profiles)
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    espn_id INTEGER UNIQUE,
    country VARCHAR(100),
    birthdate DATE,
    birthplace VARCHAR(255),
    college VARCHAR(255),
    swing_type VARCHAR(10) CHECK (swing_type IN ('Right', 'Left')),
    height VARCHAR(20),
    weight VARCHAR(20),
    turned_pro INTEGER,
    world_ranking INTEGER,
    fedex_ranking INTEGER,
    photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournaments table (ESPN tournament structure)
CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    espn_tournament_id INTEGER,
    name VARCHAR(255) NOT NULL,
    season INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    course_name VARCHAR(255),
    venue VARCHAR(255),
    tour_type VARCHAR(50) DEFAULT 'PGA TOUR',
    purse BIGINT,
    field_size INTEGER,
    status VARCHAR(20) DEFAULT 'completed',
    url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, season)
);

-- Player Tournaments (main results table - ESPN format)
CREATE TABLE IF NOT EXISTS player_tournaments (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    season INTEGER NOT NULL,
    date_range VARCHAR(50), -- "1/30 - 2/2" format
    tournament_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255),
    venue VARCHAR(255),
    position VARCHAR(10), -- "T9", "1", "T25", "CUT", etc.
    position_numeric INTEGER, -- Numeric position for sorting
    is_tied BOOLEAN DEFAULT false,
    overall_score VARCHAR(50), -- "67-70-69-67" format
    total_score INTEGER, -- 273
    score_to_par INTEGER, -- -15
    earnings_usd INTEGER, -- Earnings in dollars
    earnings_display VARCHAR(20), -- "$535,000" format
    fedex_points INTEGER,
    status VARCHAR(20) DEFAULT 'completed', -- completed/MC/WD/DQ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, tournament_id)
);

-- Tournament Rounds (individual round scores)
CREATE TABLE IF NOT EXISTS tournament_rounds (
    id SERIAL PRIMARY KEY,
    player_tournament_id INTEGER REFERENCES player_tournaments(id) ON DELETE CASCADE,
    round_number INTEGER CHECK (round_number BETWEEN 1 AND 4),
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_tournament_id, round_number)
);

-- Scrape Logs (audit trail for data updates)
CREATE TABLE IF NOT EXISTS scrape_logs (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    season INTEGER,
    scrape_type VARCHAR(50),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    records_processed INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_players_espn_id ON players(espn_id);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

CREATE INDEX IF NOT EXISTS idx_tournaments_season ON tournaments(season);
CREATE INDEX IF NOT EXISTS idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tournaments_espn_id ON tournaments(espn_tournament_id);

CREATE INDEX IF NOT EXISTS idx_player_tournaments_player_season ON player_tournaments(player_id, season);
CREATE INDEX IF NOT EXISTS idx_player_tournaments_tournament ON player_tournaments(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_tournaments_position ON player_tournaments(position_numeric);
CREATE INDEX IF NOT EXISTS idx_player_tournaments_earnings ON player_tournaments(earnings_usd DESC);

CREATE INDEX IF NOT EXISTS idx_tournament_rounds_player_tournament ON tournament_rounds(player_tournament_id);

-- =====================================================
-- VIEWS FOR ESPN-STYLE QUERIES
-- =====================================================

-- Player Season Summary View
CREATE OR REPLACE VIEW player_season_summary AS
SELECT
    p.id as player_id,
    p.name,
    p.espn_id,
    pt.season,
    COUNT(*) as tournaments_played,
    COUNT(CASE WHEN pt.position = '1' THEN 1 END) as wins,
    COUNT(CASE WHEN pt.position_numeric <= 10 AND pt.status = 'completed' THEN 1 END) as top_10s,
    COUNT(CASE WHEN pt.position_numeric <= 25 AND pt.status = 'completed' THEN 1 END) as top_25s,
    COUNT(CASE WHEN pt.status = 'completed' THEN 1 END) as cuts_made,
    COUNT(CASE WHEN pt.status = 'MC' THEN 1 END) as cuts_missed,
    SUM(pt.earnings_usd) as total_earnings,
    SUM(pt.fedex_points) as total_fedex_points,
    ROUND(AVG(CASE WHEN pt.status = 'completed' THEN pt.score_to_par END)::numeric, 2) as avg_score_to_par
FROM players p
JOIN player_tournaments pt ON p.id = pt.player_id
GROUP BY p.id, p.name, p.espn_id, pt.season;

-- Recent Tournaments View (for dashboard)
CREATE OR REPLACE VIEW recent_tournaments AS
SELECT
    t.id,
    t.name as tournament_name,
    t.venue,
    t.course_name,
    t.season,
    t.start_date,
    t.end_date,
    t.tour_type,
    COUNT(DISTINCT pt.player_id) as field_size,
    MAX(pt.earnings_usd) as winner_earnings,
    (SELECT p.name FROM players p
     JOIN player_tournaments pt2 ON p.id = pt2.player_id
     WHERE pt2.tournament_id = t.id AND pt2.position = '1'
     LIMIT 1) as winner_name
FROM tournaments t
LEFT JOIN player_tournaments pt ON t.id = pt.tournament_id
GROUP BY t.id, t.name, t.venue, t.course_name, t.season, t.start_date, t.end_date, t.tour_type
ORDER BY t.start_date DESC;

-- Player Tournament Results ESPN View (formatted for display)
CREATE OR REPLACE VIEW player_tournament_results_espn AS
SELECT
    pt.id,
    pt.player_id,
    pt.tournament_id,
    pt.season as year,
    pt.date_range,
    pt.tournament_name,
    COALESCE(pt.venue, pt.course_name) as course_name,
    pt.position,
    pt.position_numeric,
    pt.is_tied,
    pt.overall_score,
    pt.total_score,
    pt.score_to_par,
    pt.earnings_usd as earnings,
    pt.earnings_display,
    pt.status,
    t.tour_type,
    t.start_date,
    t.end_date,
    t.url as tournament_url,
    -- Aggregate round scores into JSON
    (SELECT json_agg(tr.score ORDER BY tr.round_number)
     FROM tournament_rounds tr
     WHERE tr.player_tournament_id = pt.id) as rounds,
    -- Format score display
    CASE
        WHEN pt.score_to_par IS NULL THEN pt.overall_score
        WHEN pt.score_to_par = 0 THEN CONCAT(pt.total_score::text, ' (E)')
        WHEN pt.score_to_par > 0 THEN CONCAT(pt.total_score::text, ' (+', pt.score_to_par::text, ')')
        ELSE CONCAT(pt.total_score::text, ' (', pt.score_to_par::text, ')')
    END as score_display
FROM player_tournaments pt
JOIN tournaments t ON pt.tournament_id = t.id
ORDER BY t.start_date DESC;

-- Available Years for Player
CREATE OR REPLACE VIEW player_available_years AS
SELECT DISTINCT
    player_id,
    season as year
FROM player_tournaments
ORDER BY season DESC;

-- =====================================================
-- FUNCTIONS FOR DATA MANAGEMENT
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_tournaments_updated_at BEFORE UPDATE ON player_tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for read access (anon users can read all data)
CREATE POLICY "Allow public read access to players" ON players
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tournaments" ON tournaments
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to player_tournaments" ON player_tournaments
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tournament_rounds" ON tournament_rounds
    FOR SELECT USING (true);

-- Scrape logs are admin only
CREATE POLICY "Admin only for scrape_logs" ON scrape_logs
    FOR ALL USING (false);

-- =====================================================
-- SAMPLE DATA FOR SCOTTIE SCHEFFLER
-- =====================================================

-- This will be populated by the seed script, but here's the structure:
-- INSERT INTO players (name, espn_id, country, birthdate, birthplace, college, swing_type, height, weight, turned_pro, world_ranking)
-- VALUES ('Scottie Scheffler', 9478, 'USA', '1996-06-21', 'Dallas, Texas', 'University of Texas', 'Right', '6''3"', '200 lbs', 2018, 1);