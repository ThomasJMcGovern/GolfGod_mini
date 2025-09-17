-- GolfGod Mini - Railway PostgreSQL Schema
-- Enhanced ESPN-style golf tournament database
-- Date: 2025-01-16

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Players table (ESPN-style with comprehensive profile data)
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL UNIQUE,
    country TEXT,
    turned_pro INTEGER,
    world_ranking INTEGER,
    fedex_ranking INTEGER,

    -- ESPN-style profile fields
    birthdate DATE,
    birthplace TEXT,
    college TEXT,
    swing_type TEXT CHECK (swing_type IN ('Right', 'Left')),
    height TEXT,
    weight TEXT,
    photo_url TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournaments table (multi-tour support with ESPN classification)
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    course_name TEXT,
    course_name_display TEXT,
    course_location TEXT,
    purse BIGINT, -- Prize money in cents to avoid floating point issues
    field_size INTEGER,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'current', 'completed')),

    -- ESPN-style tournament classification
    tour_type TEXT DEFAULT 'PGA_TOUR', -- PGA_TOUR, OLYMPICS, EUROPEAN_TOUR, LIV, etc.
    year INTEGER NOT NULL,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique tournament per year
    UNIQUE(name, year)
);

-- Tournament Results table (comprehensive scoring and earnings data)
CREATE TABLE tournament_results (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Scoring data
    position TEXT, -- "1", "T2", "CUT", "WD", etc.
    total_score INTEGER,
    score_to_par INTEGER,
    rounds JSONB, -- Array of round scores: [68, 71, 69, 70]
    rounds_detail JSONB, -- Detailed round data: {"r1": 68, "r2": 71, "r3": 69, "r4": 70}

    -- Financial data
    earnings BIGINT DEFAULT 0, -- Earnings in cents
    fedex_points INTEGER DEFAULT 0,

    -- Year for easy filtering (derived from tournament)
    year INTEGER NOT NULL,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique player per tournament
    UNIQUE(tournament_id, player_id)
);

-- Player Stats table (seasonal performance metrics)
CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    season INTEGER NOT NULL,

    -- Tournament participation
    events_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    top_10s INTEGER DEFAULT 0,
    top_25s INTEGER DEFAULT 0,
    cuts_made INTEGER DEFAULT 0,
    cuts_missed INTEGER DEFAULT 0,

    -- Performance metrics
    scoring_avg DECIMAL(4,2), -- Average score per round
    driving_distance DECIMAL(5,1), -- Average driving distance in yards
    driving_accuracy DECIMAL(5,2), -- Percentage of fairways hit
    gir_percentage DECIMAL(5,2), -- Greens in regulation percentage
    putts_per_round DECIMAL(4,2), -- Average putts per round
    scrambling DECIMAL(5,2), -- Scrambling percentage

    -- Financial data
    total_earnings BIGINT DEFAULT 0, -- Season earnings in cents
    fedex_cup_points INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique player per season
    UNIQUE(player_id, season)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Player indexes
CREATE INDEX idx_players_country ON players(country);
CREATE INDEX idx_players_world_ranking ON players(world_ranking);
CREATE INDEX idx_players_name_search ON players USING gin(to_tsvector('english', full_name));

-- Tournament indexes
CREATE INDEX idx_tournaments_year ON tournaments(year);
CREATE INDEX idx_tournaments_tour_type ON tournaments(tour_type);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournaments_status ON tournaments(status);

-- Tournament results indexes
CREATE INDEX idx_results_player_year ON tournament_results(player_id, year);
CREATE INDEX idx_results_tournament ON tournament_results(tournament_id);
CREATE INDEX idx_results_earnings ON tournament_results(earnings DESC);
CREATE INDEX idx_results_position ON tournament_results(position);

-- Player stats indexes
CREATE INDEX idx_stats_player_season ON player_stats(player_id, season);
CREATE INDEX idx_stats_season ON player_stats(season);
CREATE INDEX idx_stats_earnings ON player_stats(total_earnings DESC);

-- =============================================================================
-- DATABASE VIEWS FOR ESPN-STYLE QUERIES
-- =============================================================================

-- Complete player profiles (ESPN-style with career statistics)
CREATE OR REPLACE VIEW player_profiles_complete AS
SELECT
    p.*,
    -- Calculate age from birthdate
    CASE
        WHEN p.birthdate IS NOT NULL
        THEN DATE_PART('year', CURRENT_DATE) - DATE_PART('year', p.birthdate)
        ELSE NULL
    END as age,

    -- Career statistics (from latest season stats)
    COALESCE(latest_stats.events_played, 0) as tournaments_last_year,
    COALESCE(career_earnings.total, 0) as career_earnings,
    COALESCE(career_wins.total, 0) as career_wins

FROM players p
LEFT JOIN (
    -- Get latest season stats
    SELECT DISTINCT ON (player_id)
        player_id, events_played
    FROM player_stats
    ORDER BY player_id, season DESC
) latest_stats ON p.id = latest_stats.player_id
LEFT JOIN (
    -- Calculate total career earnings
    SELECT
        player_id,
        SUM(total_earnings) as total
    FROM player_stats
    GROUP BY player_id
) career_earnings ON p.id = career_earnings.player_id
LEFT JOIN (
    -- Calculate total career wins
    SELECT
        player_id,
        SUM(wins) as total
    FROM player_stats
    GROUP BY player_id
) career_wins ON p.id = career_wins.player_id;

-- ESPN-style tournament results (formatted for display)
CREATE OR REPLACE VIEW player_tournament_results_espn AS
SELECT
    tr.player_id,
    p.full_name as player_name,
    p.country,
    p.photo_url,
    t.year,
    t.tour_type,
    t.start_date,
    t.end_date,
    t.name as tournament_name,
    t.course_name,
    t.course_location,
    tr.position,
    tr.total_score,
    tr.score_to_par,
    tr.earnings,
    tr.rounds,
    tr.rounds_detail,

    -- Formatted display fields (ESPN-style)
    CASE
        WHEN t.start_date IS NOT NULL AND t.end_date IS NOT NULL
        THEN TO_CHAR(t.start_date, 'MM/DD') || ' - ' || TO_CHAR(t.end_date, 'MM/DD')
        WHEN t.start_date IS NOT NULL
        THEN TO_CHAR(t.start_date, 'MM/DD')
        ELSE ''
    END as date_range,

    CASE
        WHEN tr.total_score IS NOT NULL AND tr.score_to_par IS NOT NULL
        THEN tr.total_score::text || ' (' ||
             CASE WHEN tr.score_to_par > 0 THEN '+' ELSE '' END ||
             tr.score_to_par::text || ')'
        WHEN tr.total_score IS NOT NULL
        THEN tr.total_score::text
        ELSE ''
    END as score_display

FROM tournament_results tr
JOIN players p ON tr.player_id = p.id
JOIN tournaments t ON tr.tournament_id = t.id
ORDER BY t.start_date DESC;

-- Current season leaderboard (for rankings and performance)
CREATE OR REPLACE VIEW current_season_leaderboard AS
SELECT
    ROW_NUMBER() OVER (ORDER BY ps.total_earnings DESC) as rank,
    p.id as player_id,
    p.full_name as player_name,
    p.country,
    p.photo_url,
    ps.season,
    ps.events_played,
    ps.wins,
    ps.top_10s,
    ps.total_earnings,
    ps.fedex_cup_points,
    ps.scoring_avg
FROM player_stats ps
JOIN players p ON ps.player_id = p.id
WHERE ps.season = DATE_PART('year', CURRENT_DATE)
ORDER BY ps.total_earnings DESC;

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_results_updated_at BEFORE UPDATE ON tournament_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON player_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-populate year in tournament_results from tournament
CREATE OR REPLACE FUNCTION set_tournament_result_year()
RETURNS TRIGGER AS $$
BEGIN
    SELECT year INTO NEW.year FROM tournaments WHERE id = NEW.tournament_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_result_year_trigger BEFORE INSERT OR UPDATE ON tournament_results
    FOR EACH ROW EXECUTE FUNCTION set_tournament_result_year();

-- =============================================================================
-- SAMPLE DATA (based on your mock data)
-- =============================================================================

-- Insert sample players (from your mock data)
INSERT INTO players (full_name, country, birthdate, birthplace, college, swing_type, height, weight, turned_pro, world_ranking, fedex_ranking, photo_url) VALUES
('Scottie Scheffler', 'USA', '1996-06-21', 'Dallas, Texas', 'University of Texas', 'Right', '6''3"', '200 lbs', 2018, 1, 1, '/images/players/scottie-scheffler.jpg'),
('Rory McIlroy', 'Northern Ireland', '1989-05-04', 'Holywood, Northern Ireland', NULL, 'Right', '5''9"', '161 lbs', 2007, 2, 5, '/images/players/rory-mcilroy.jpg'),
('Viktor Hovland', 'Norway', '1997-09-18', 'Oslo, Norway', 'Oklahoma State University', 'Right', '5''10"', '165 lbs', 2019, 3, 12, '/images/players/viktor-hovland.jpg'),
('Patrick Cantlay', 'USA', '1992-03-17', 'Long Beach, California', 'UCLA', 'Right', '6''0"', '175 lbs', 2011, 4, 8, '/images/players/patrick-cantlay.jpg'),
('Jon Rahm', 'Spain', '1994-11-10', 'Barrika, Spain', 'Arizona State University', 'Right', '6''2"', '220 lbs', 2016, 5, 15, '/images/players/jon-rahm.jpg');

-- Insert sample tournaments
INSERT INTO tournaments (name, start_date, end_date, course_name, course_name_display, course_location, purse, tour_type, year, status) VALUES
('The Sentry', '2025-01-04', '2025-01-07', 'Kapalua Resort (Plantation Course)', 'Kapalua Resort (Plantation Course)', 'Kapalua, HI', 2000000000, 'PGA_TOUR', 2025, 'completed'),
('Sony Open in Hawaii', '2025-01-11', '2025-01-14', 'Waialae Country Club', 'Waialae Country Club', 'Honolulu, HI', 830000000, 'PGA_TOUR', 2025, 'completed'),
('The American Express', '2025-01-18', '2025-01-21', 'Pete Dye Stadium Course', 'Pete Dye Stadium Course', 'La Quinta, CA', 880000000, 'PGA_TOUR', 2025, 'completed'),
('AT&T Pebble Beach Pro-Am', '2025-02-01', '2025-02-03', 'Pebble Beach Golf Links', 'Pebble Beach Golf Links', 'Pebble Beach, CA', 900000000, 'PGA_TOUR', 2025, 'completed'),
('Masters Tournament', '2025-04-10', '2025-04-13', 'Augusta National Golf Club', 'Augusta National Golf Club', 'Augusta, GA', 1800000000, 'PGA_TOUR', 2025, 'completed'),
('Olympic Men''s Golf Competition', '2024-08-01', '2024-08-04', 'Le Golf National', 'Le Golf National', 'Saint-Quentin-en-Yvelines, France', 0, 'OLYMPICS', 2024, 'completed');

-- Insert sample tournament results (Scottie Scheffler's results)
INSERT INTO tournament_results (tournament_id, player_id, position, total_score, score_to_par, earnings, rounds, rounds_detail) VALUES
(1, 1, 'T5', 267, -25, 69050000, '[66, 64, 71, 66]', '{"r1": 66, "r2": 64, "r3": 71, "r4": 66}'),
(3, 1, 'T17', 267, -21, 13230000, '[67, 66, 69, 65]', '{"r1": 67, "r2": 66, "r3": 69, "r4": 65}'),
(4, 1, 'T6', 203, -13, 64250000, '[69, 64, 70]', '{"r1": 69, "r2": 64, "r3": 70}'),
(5, 1, '4', 280, -8, 100800000, '[68, 71, 72, 69]', '{"r1": 68, "r2": 71, "r3": 72, "r4": 69}'),
(6, 1, '1', 265, -19, 0, '[67, 69, 67, 62]', '{"r1": 67, "r2": 69, "r3": 67, "r4": 62}');

-- Insert sample player stats
INSERT INTO player_stats (player_id, season, events_played, wins, top_10s, top_25s, cuts_made, total_earnings, scoring_avg, driving_distance, driving_accuracy, gir_percentage, putts_per_round) VALUES
(1, 2025, 15, 8, 12, 14, 15, 2500000000, 68.2, 310.5, 65.2, 72.8, 28.1),
(1, 2024, 20, 6, 15, 18, 19, 2800000000, 68.8, 308.2, 64.8, 71.5, 28.3);

-- =============================================================================
-- PERMISSIONS AND SECURITY
-- =============================================================================

-- Create application role for connection pooling
-- CREATE ROLE app_user WITH LOGIN PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE your_database TO app_user;
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

COMMENT ON SCHEMA public IS 'GolfGod Mini - ESPN-style golf tournament database';
COMMENT ON TABLE players IS 'Professional golfer profiles with ESPN-style biographical data';
COMMENT ON TABLE tournaments IS 'Golf tournaments across multiple tours (PGA, Olympics, etc.)';
COMMENT ON TABLE tournament_results IS 'Player performance in tournaments with comprehensive scoring data';
COMMENT ON TABLE player_stats IS 'Seasonal performance statistics and career metrics';
COMMENT ON VIEW player_profiles_complete IS 'Complete player profiles with calculated career statistics';
COMMENT ON VIEW player_tournament_results_espn IS 'ESPN-formatted tournament results for display';
COMMENT ON VIEW current_season_leaderboard IS 'Current season money list and performance rankings';