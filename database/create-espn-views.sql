-- Create ESPN-style views for the existing database tables
-- These views format the data for the React app

-- Main ESPN results view
CREATE OR REPLACE VIEW player_tournament_results_espn AS
SELECT
    pt.id,
    pt.player_id,
    pt.tournament_id,
    pt.season as year,
    pt.date_range,
    pt.tournament_name,
    pt.tournament_name as course_name, -- Using tournament_name as fallback
    pt.position,
    pt.position_numeric,
    pt.is_tied,
    pt.overall_score,
    pt.total_score,
    pt.score_to_par,
    pt.earnings_usd as earnings,
    pt.earnings_display,
    pt.status,
    'PGA TOUR' as tour_type, -- Default tour type
    t.start_date,
    t.end_date,
    t.url as tournament_url,
    -- Aggregate round scores into JSON array
    (SELECT json_agg(tr.score ORDER BY tr.round_number)
     FROM tournament_rounds tr
     WHERE tr.player_tournament_id = pt.id) as rounds,
    -- Also create rounds_detail for compatibility
    (SELECT json_object_agg(
        CONCAT('r', tr.round_number),
        tr.score
     ) FROM tournament_rounds tr
     WHERE tr.player_tournament_id = pt.id) as rounds_detail,
    -- Format score display
    CASE
        WHEN pt.score_to_par IS NULL THEN pt.overall_score
        WHEN pt.score_to_par = 0 THEN CONCAT(pt.total_score::text, ' (E)')
        WHEN pt.score_to_par > 0 THEN CONCAT(pt.total_score::text, ' (+', pt.score_to_par::text, ')')
        ELSE CONCAT(pt.total_score::text, ' (', pt.score_to_par::text, ')')
    END as score_display
FROM player_tournaments pt
LEFT JOIN tournaments t ON pt.tournament_id = t.id
ORDER BY pt.season DESC, t.start_date DESC;

-- Player available years view
CREATE OR REPLACE VIEW player_available_years AS
SELECT DISTINCT
    player_id,
    season as year
FROM player_tournaments
ORDER BY season DESC;

-- Create or replace the player profiles complete view
CREATE OR REPLACE VIEW player_profiles_complete AS
SELECT
    p.*,
    (SELECT COUNT(*) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as tournaments_played,
    (SELECT COUNT(*) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.position = '1' AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as wins,
    (SELECT COUNT(*) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.position_numeric <= 10 AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as top_10s,
    (SELECT COUNT(*) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.position_numeric <= 25 AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as top_25s,
    (SELECT COUNT(*) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.status = 'completed' AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as cuts_made,
    (SELECT SUM(pt.earnings_usd) FROM player_tournaments pt WHERE pt.player_id = p.id AND pt.season = EXTRACT(YEAR FROM CURRENT_DATE)) as total_earnings,
    0 as fedex_points -- Placeholder since this isn't in the existing schema
FROM players p;

-- Grant permissions for anon users to read these views
GRANT SELECT ON player_tournament_results_espn TO anon;
GRANT SELECT ON player_available_years TO anon;
GRANT SELECT ON player_profiles_complete TO anon;