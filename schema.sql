-- GolfGod Mini Database Schema
-- Run this in your Supabase SQL editor

-- 1) Core tables
CREATE TABLE IF NOT EXISTS player (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  handedness TEXT CHECK (handedness IN ('R','L')) DEFAULT 'R',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE,
  course TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Minimal per-round facts (keep it tiny)
CREATE TABLE IF NOT EXISTS round (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT REFERENCES tournament(id) ON DELETE CASCADE,
  player_id BIGINT REFERENCES player(id) ON DELETE CASCADE,
  round_no INT CHECK (round_no BETWEEN 1 AND 4),
  wave TEXT CHECK (wave IN ('AM','PM')),
  score_to_par INT,              -- e.g. -2, +1
  sg_app NUMERIC,                -- strokes gained approach
  putts INT,                     -- putts in the round
  fairways_hit INT,
  fairways_total INT,
  wind_mph NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional lightweight client logging (dev only)
CREATE TABLE IF NOT EXISTS client_log (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  level TEXT,
  message TEXT,
  meta JSONB
);

-- 2) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_round_tournament ON round(tournament_id);
CREATE INDEX IF NOT EXISTS idx_round_player ON round(player_id);
CREATE INDEX IF NOT EXISTS idx_round_composite ON round(tournament_id, player_id);

-- 3) RLS (Row Level Security) - read-only for anon users
ALTER TABLE player ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament ENABLE ROW LEVEL SECURITY;
ALTER TABLE round ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public read players" ON player;
DROP POLICY IF EXISTS "public read tournaments" ON tournament;
DROP POLICY IF EXISTS "public read rounds" ON round;
DROP POLICY IF EXISTS "anon insert client_log" ON client_log;

-- Create new policies
CREATE POLICY "public read players" ON player 
  FOR SELECT USING (true);

CREATE POLICY "public read tournaments" ON tournament 
  FOR SELECT USING (true);

CREATE POLICY "public read rounds" ON round 
  FOR SELECT USING (true);

-- Allow anon inserts to client_log (dev only; remove in prod)
CREATE POLICY "anon insert client_log" ON client_log 
  FOR INSERT WITH CHECK (true);

-- 4) Optional: Create a view for player statistics
CREATE OR REPLACE VIEW player_tournament_stats AS
SELECT 
  p.id as player_id,
  p.full_name as player_name,
  t.id as tournament_id,
  t.name as tournament_name,
  COUNT(r.id) as rounds_played,
  AVG(r.sg_app) as avg_sg_app,
  AVG(r.putts) as avg_putts,
  CASE 
    WHEN SUM(r.fairways_total) > 0 
    THEN (SUM(r.fairways_hit)::NUMERIC / SUM(r.fairways_total) * 100)
    ELSE NULL 
  END as fairway_pct,
  AVG(r.score_to_par) as avg_score_to_par
FROM player p
CROSS JOIN tournament t
LEFT JOIN round r ON r.player_id = p.id AND r.tournament_id = t.id
GROUP BY p.id, p.full_name, t.id, t.name;

-- Grant permissions for the view
GRANT SELECT ON player_tournament_stats TO anon, authenticated;

-- 5) Success message
DO $$
BEGIN
  RAISE NOTICE 'GolfGod Mini schema created successfully!';
  RAISE NOTICE 'Tables created: player, tournament, round, client_log';
  RAISE NOTICE 'View created: player_tournament_stats';
  RAISE NOTICE 'RLS policies applied for read-only access';
END $$;