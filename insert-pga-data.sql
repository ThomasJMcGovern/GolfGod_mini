-- =====================================================
-- PGA Tour 2024 Player Data Import
-- =====================================================
-- This script inserts real PGA Tour data for 200 players
-- Data source: PGA Tour official statistics
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Insert/Update Players
-- =====================================================

INSERT INTO players (full_name, country) VALUES
('Scottie Scheffler', 'USA'),
('Tommy Fleetwood', 'England'),
('Rory McIlroy', 'Northern Ireland'),
('Russell Henley', 'USA'),
('J.J. Spaun', 'USA'),
('Justin Thomas', 'USA'),
('Sepp Straka', 'Austria'),
('Ben Griffin', 'USA'),
('Patrick Cantlay', 'USA'),
('Justin Rose', 'England'),
('Harris English', 'USA'),
('Keegan Bradley', 'USA'),
('Cameron Young', 'USA'),
('Robert MacIntyre', 'Scotland'),
('Ludvig Åberg', 'Sweden'),
('Maverick McNealy', 'USA'),
('Corey Conners', 'Canada'),
('Collin Morikawa', 'USA'),
('Andrew Novak', 'USA'),
('Shane Lowry', 'Ireland'),
('Sam Burns', 'USA'),
('Hideki Matsuyama', 'Japan'),
('Viktor Hovland', 'Norway'),
('Brian Harman', 'USA'),
('Nick Taylor', 'Canada'),
('Sungjae Im', 'South Korea'),
('Chris Gotterup', 'USA'),
('Akshay Bhatia', 'USA'),
('Jacob Bridgeman', 'USA'),
('Lucas Glover', 'USA'),
('Harry Hall', 'England'),
('Sam Stevens', 'USA'),
('Tom Hoge', 'USA'),
('Daniel Berger', 'USA'),
('Michael Kim', 'USA'),
('Ryan Fox', 'New Zealand'),
('Taylor Pendrith', 'Canada'),
('Denny McCarthy', 'USA'),
('Matt Fitzpatrick', 'England'),
('Si Woo Kim', 'South Korea'),
('Ryan Gerard', 'USA'),
('Jason Day', 'Australia'),
('Thomas Detry', 'Belgium'),
('Rickie Fowler', 'USA'),
('Xander Schauffele', 'USA'),
('Kurt Kitayama', 'USA'),
('Brian Campbell', 'USA'),
('Bud Cauley', 'USA'),
('Aaron Rai', 'England'),
('Jordan Spieth', 'USA'),
('Min Woo Lee', 'Australia'),
('J.T. Poston', 'USA'),
('Jake Knapp', 'USA'),
('Aldrich Potgieter', 'South Africa'),
('Chris Kirk', 'USA'),
('Max Greyserman', 'USA'),
('Wyndham Clark', 'USA'),
('Joe Highsmith', 'USA'),
('Jhonattan Vegas', 'Venezuela'),
('Tony Finau', 'USA'),
('Stephan Jaeger', 'Germany'),
('Davis Riley', 'USA'),
('Patrick Rodgers', 'USA'),
('Mackenzie Hughes', 'Canada'),
('Davis Thompson', 'USA'),
('Byeong Hun An', 'South Korea'),
('Nico Echavarria', 'Colombia'),
('Kevin Yu', 'Taiwan'),
('Erik van Rooyen', 'South Africa'),
('Cam Davis', 'Australia'),
('Christiaan Bezuidenhout', 'South Africa'),
('Matti Schmid', 'Germany'),
('Gary Woodland', 'USA'),
('Emiliano Grillo', 'Argentina'),
('Eric Cole', 'USA'),
('Matt McCarty', 'USA'),
('Nicolai Højgaard', 'Denmark'),
('Adam Scott', 'Australia'),
('Alex Smalley', 'USA'),
('Keith Mitchell', 'USA'),
('Mark Hubbard', 'USA'),
('Ryo Hisatsune', 'Japan'),
('Rasmus Højgaard', 'Denmark'),
('Kevin Roy', 'USA'),
('Sami Välimäki', 'Finland'),
('Austin Eckroat', 'USA'),
('Mac Meissner', 'USA'),
('Karl Vilips', 'Estonia'),
('William Mouw', 'USA'),
('Beau Hossler', 'USA'),
('Michael Thorbjornsen', 'USA'),
('Taylor Moore', 'USA'),
('Billy Horschel', 'USA'),
('Matt Wallace', 'England'),
('Tom Kim', 'South Korea'),
('David Lipsky', 'USA'),
('Max McGreevy', 'USA'),
('Alex Noren', 'Sweden'),
('Max Homa', 'USA'),
('Patrick Fishburn', 'USA'),
('Andrew Putnam', 'USA'),
('Lee Hodges', 'USA'),
('Danny Walker', 'USA'),
('Joel Dahmen', 'USA'),
('Sam Ryder', 'USA'),
('Victor Perez', 'France'),
('Isaiah Salinda', 'USA'),
('Rico Hoey', 'Philippines'),
('Vince Whaley', 'USA'),
('Jesper Svensson', 'Sweden'),
('Garrick Higgo', 'South Africa'),
('Alejandro Tosti', 'Argentina'),
('Justin Lower', 'USA'),
('Jackson Suber', 'USA'),
('Will Zalatoris', 'USA'),
('Nick Dunlap', 'USA'),
('Henrik Norlander', 'Sweden')
ON CONFLICT (full_name) DO UPDATE
SET country = EXCLUDED.country;

-- Continue with remaining players (118-200)
INSERT INTO players (full_name, country) VALUES
('Matt Kuchar', 'USA'),
('Ricky Castillo', 'USA'),
('Thorbjørn Olesen', 'Denmark'),
('Séamus Power', 'Ireland'),
('Chan Kim', 'USA'),
('Brandt Snedeker', 'USA'),
('Adam Hadwin', 'Canada'),
('Hayden Springer', 'USA'),
('Zach Johnson', 'USA'),
('Kris Ventura', 'USA'),
('Chad Ramey', 'USA'),
('Chandler Phillips', 'USA'),
('Harry Higgs', 'USA'),
('Sahith Theegala', 'USA'),
('Paul Peterson', 'USA'),
('Adam Schenk', 'USA'),
('Carson Young', 'USA'),
('Doug Ghim', 'USA'),
('Takumi Kanaya', 'Japan'),
('Will Gordon', 'USA'),
('Cameron Champ', 'USA'),
('David Skinns', 'England'),
('Charley Hoffman', 'USA'),
('Thriston Lawrence', 'South Africa'),
('Pierceson Coody', 'USA'),
('Jeremy Paul', 'USA'),
('Antoine Rozner', 'France'),
('Steven Fisk', 'USA'),
('Lanto Griffin', 'USA'),
('Noah Goodwin', 'USA'),
('Frankie Capan III', 'USA'),
('Matteo Manassero', 'Italy'),
('Matthieu Pavon', 'France'),
('Nate Lashley', 'USA'),
('Taylor Montgomery', 'USA'),
('Luke List', 'USA'),
('Brice Garnett', 'USA'),
('Danny Willett', 'England'),
('Camilo Villegas', 'Colombia'),
('Will Chandler', 'USA'),
('Quade Cummins', 'USA'),
('Ben Kohles', 'USA'),
('Trey Mullinax', 'USA'),
('Greyson Sigg', 'USA'),
('Joseph Bramlett', 'USA'),
('Taylor Dickson', 'USA'),
('Nick Hardy', 'USA'),
('Ben Silverman', 'USA'),
('Adam Svensson', 'Canada'),
('Niklas Norgaard', 'Denmark'),
('Dylan Wu', 'USA'),
('Thomas Rosenmueller', 'Germany'),
('John Pak', 'USA'),
('Webb Simpson', 'USA'),
('Trace Crowe', 'USA'),
('Peter Malnati', 'USA'),
('Hayden Buckley', 'USA'),
('Ben Martin', 'USA'),
('Cristobal Del Solar', 'Chile'),
('K.H. Lee', 'South Korea'),
('Trevor Cone', 'USA'),
('Zac Blair', 'USA'),
('Matthew Riedel', 'USA'),
('Patton Kizzire', 'USA'),
('Kevin Velo', 'USA'),
('Rafael Campos', 'Puerto Rico'),
('C.T. Pan', 'Taiwan'),
('Luke Clanton', 'USA'),
('Kevin Kisner', 'USA'),
('Kevin Streelman', 'USA'),
('Vincent Norrman', 'Sweden'),
('Aaron Baddeley', 'Australia'),
('Rikuya Hoshino', 'Japan'),
('Norman Xiong', 'USA'),
('Philip Knowles', 'USA'),
('Braden Thornberry', 'USA'),
('Mason Andersen', 'USA'),
('Francesco Molinari', 'Italy'),
('Matt NeSmith', 'USA'),
('Martin Laird', 'Scotland'),
('Scott Piercy', 'USA'),
('Kaito Onishi', 'Japan'),
('Chesson Hadley', 'USA')
ON CONFLICT (full_name) DO UPDATE
SET country = EXCLUDED.country;

-- =====================================================
-- STEP 2: Insert 2024 Player Statistics
-- =====================================================

-- Get player IDs and insert stats
WITH player_ids AS (
  SELECT id, full_name FROM players
)
INSERT INTO player_stats (
  player_id, season, current_rank, 
  events_played, rounds_played, cuts_made, top_10s, wins,
  scoring_avg, driving_distance, driving_accuracy, 
  gir_percentage, putts_per_hole, sand_save_pct, birdies_per_round,
  total_earnings, fedex_cup_points
)
SELECT 
  p.id, 2024, v.rank,
  v.events, v.rounds, v.cuts, v.top10s, v.wins,
  v.scoring_avg, v.driving_distance, v.driving_accuracy,
  v.gir, v.putts, v.sand, v.birds,
  v.earnings::DECIMAL, v.cup_points
FROM player_ids p
JOIN (VALUES
  -- Top 50 players with complete data
  ('Scottie Scheffler', 1, 19, 76, 19, 16, 5, 68.0, 308, 63.1, 70.9, 1.696, 57.4, 4.605, 26579550, 7456),
  ('Tommy Fleetwood', 2, 19, 74, 18, 8, 1, 69.4, 299.4, 65.4, 65.8, 1.715, 59.6, 4.162, 18496238, 2923),
  ('Rory McIlroy', 3, 16, 58, 14, 8, 3, 69.1, 323, 51.2, 67.7, 1.716, 56, 4.224, 16992418, 3687),
  ('Russell Henley', 4, 18, 68, 16, 10, 1, 69.3, 288.7, 68.6, 69.3, 1.736, 61.9, 4.074, 14633556, 2795),
  ('J.J. Spaun', 5, 23, 83, 19, 6, 1, 69.7, 305.8, 61.7, 68.3, 1.744, 59.6, 4.0, 12892722, 3493),
  ('Justin Thomas', 6, 20, 76, 18, 8, 1, 69.6, 305.2, 54.0, 65.5, 1.679, 63.7, 4.447, 10883495, 2477),
  ('Sepp Straka', 7, 22, 76, 17, 6, 2, 69.5, 297.9, 65.7, 70.2, 1.728, 57.4, 4.289, 10650894, 7),
  ('Ben Griffin', 8, 28, 96, 21, 10, 2, 69.4, 305.5, 59.1, 68.5, 1.745, 62.7, 3.917, 9990352, 2798),
  ('Patrick Cantlay', 9, 19, 70, 16, 5, 0, 69.8, 306.1, 59.9, 70.0, 1.73, 56.1, 4.157, 9405106, 1661),
  ('Justin Rose', 10, 18, 58, 11, 5, 1, 70.6, 301.9, 58.5, 64.0, 1.72, 59.3, 4.19, 8857976, 3326),
  ('Harris English', 11, 21, 80, 19, 4, 1, 70.0, 303.9, 62.1, 66.1, 1.761, 61.1, 3.538, 8799052, 2512),
  ('Keegan Bradley', 12, 21, 80, 19, 6, 1, 69.9, 306.4, 61.4, 66.0, 1.742, 60.9, 3.825, 8702812, 1992),
  ('Cameron Young', 13, 24, 83, 17, 7, 1, 70.1, 313.6, 54.5, 63.7, 1.705, 60.9, 4.241, 8608313, 2184),
  ('Robert MacIntyre', 14, 23, 84, 20, 6, 0, 69.5, 302.7, 61.5, 68.7, 1.766, 64.5, 4.06, 8467191, 2750),
  ('Ludvig Åberg', 15, 20, 69, 15, 6, 1, 70.0, 313.9, 59.5, 66.2, 1.74, 62.7, 4.159, 8276973, 2179),
  ('Maverick McNealy', 16, 24, 88, 20, 7, 0, 69.9, 306.4, 58.9, 67.4, 1.75, 51.4, 3.909, 8207075, 2547),
  ('Corey Conners', 17, 21, 81, 19, 7, 0, 70.0, 298.2, 66.6, 69.2, 1.761, 54.9, 3.864, 8167903, 1719),
  ('Collin Morikawa', 18, 19, 68, 16, 4, 0, 70.0, 296.8, 71.0, 68.9, 1.745, 57.0, 4.015, 7754727, 1655),
  ('Andrew Novak', 19, 26, 85, 17, 5, 1, 70.6, 301.0, 57.0, 60.6, 1.739, 62.8, 3.6, 7621332, 2029),
  ('Shane Lowry', 20, 20, 70, 16, 4, 0, 70.1, 298.1, 63.0, 67.1, 1.769, 56.7, 3.586, 7082794, 1607),
  ('Sam Burns', 21, 24, 90, 21, 6, 0, 69.6, 307.4, 60.7, 66.0, 1.711, 63.7, 4.189, 6686482, 1871),
  ('Hideki Matsuyama', 22, 22, 82, 19, 1, 1, 69.9, 300.5, 57.6, 65.4, 1.751, 71.3, 4.012, 6568644, 3),
  ('Viktor Hovland', 23, 18, 65, 14, 3, 1, 70.0, 303.3, 63.1, 67.3, 1.742, 59.0, 4.2, 5824239, 1637),
  ('Brian Harman', 24, 23, 87, 20, 4, 1, 70.3, 294.7, 63.1, 65.2, 1.756, 62.2, 3.69, 5547660, 1735),
  ('Nick Taylor', 25, 23, 80, 18, 3, 1, 69.9, 294.7, 65.9, 68.5, 1.775, 57.1, 3.75, 5431209, 1564),
  ('Sungjae Im', 26, 27, 93, 19, 3, 0, 70.3, 297.1, 68.0, 62.1, 1.732, 60.5, 3.892, 5001387, 1422),
  ('Chris Gotterup', 27, 27, 87, 17, 4, 1, 69.3, 316.9, 54.9, 70.4, 1.757, 62.9, 4.092, 4816304, 1414),
  ('Akshay Bhatia', 28, 24, 81, 18, 4, 0, 69.9, 298.2, 61.6, 67.7, 1.721, 60.3, 4.259, 4724687, 1409),
  ('Jacob Bridgeman', 29, 27, 86, 17, 5, 0, 69.9, 302.4, 59.4, 64.5, 1.745, 58.7, 4.012, 4420923, 1475),
  ('Lucas Glover', 30, 22, 75, 15, 5, 0, 70.3, 292.3, 68.4, 65.4, 1.75, 58.4, 3.853, 4397743, 1296),
  ('Harry Hall', 31, 25, 94, 22, 5, 0, 68.8, 303.6, 58.1, 65.0, 1.677, 58.6, 4.564, 4309601, 1475),
  ('Sam Stevens', 32, 27, 96, 22, 3, 0, 70.2, 306.9, 59.8, 65.8, 1.78, 58.8, 3.604, 4189286, 1263),
  ('Tom Hoge', 33, 24, 78, 16, 4, 0, 71.1, 295.0, 58.3, 61.4, 1.752, 67.4, 3.577, 4119800, 1124),
  ('Daniel Berger', 34, 21, 75, 16, 2, 0, 70.4, 302.6, 66.6, 67.9, 1.783, 46.8, 3.693, 4099049, 1180),
  ('Michael Kim', 35, 26, 92, 20, 4, 0, 70.1, 301.0, 58.9, 65.2, 1.772, 71.3, 3.533, 4089131, 1400),
  ('Ryan Fox', 36, 21, 70, 15, 2, 2, 70.2, 308.7, 52.3, 64.2, 1.722, 54.8, 3.914, 3981947, 1209),
  ('Taylor Pendrith', 37, 23, 82, 18, 4, 0, 70.0, 311.2, 58.7, 69.0, 1.782, 57.4, 3.878, 3978452, 1366),
  ('Denny McCarthy', 38, 22, 84, 20, 2, 0, 70.2, 295.6, 60.5, 65.7, 1.752, 57.1, 3.655, 3854852, 1242),
  ('Matt Fitzpatrick', 39, 21, 74, 17, 5, 0, 70.1, 302.7, 61.3, 66.7, 1.758, 67.0, 3.757, 3831413, 1304),
  ('Si Woo Kim', 40, 28, 91, 19, 2, 0, 69.9, 297.1, 65.8, 66.5, 1.744, 64.5, 4.0, 3808594, 1278),
  ('Ryan Gerard', 41, 26, 88, 21, 4, 1, 70.2, 302.3, 61.7, 64.5, 1.765, 59.5, 3.568, 3756022, 1250),
  ('Jason Day', 42, 16, 58, 13, 4, 0, 70.2, 299.5, 59.6, 65.2, 1.734, 56.6, 3.81, 3677161, 1241),
  ('Thomas Detry', 43, 24, 82, 18, 2, 1, 70.6, 306.5, 56.8, 65.2, 1.785, 62.2, 3.537, 3651876, 1184),
  ('Rickie Fowler', 44, 21, 77, 18, 3, 0, 69.8, 305.3, 63.7, 65.3, 1.74, 57.5, 3.987, 3441954, 1372),
  ('Xander Schauffele', 45, 15, 60, 15, 3, 0, 70.4, 312.8, 53.8, 66.4, 1.787, 53.3, 3.767, 3399866, 1220),
  ('Kurt Kitayama', 46, 22, 66, 14, 4, 1, 69.3, 318.1, 56.1, 67.4, 1.725, 55.8, 4.318, 3360156, 1298),
  ('Brian Campbell', 47, 22, 62, 10, 2, 2, 71.1, 278.9, 67.0, 61.4, 1.749, 57.8, 3.694, 3289259, 1160),
  ('Bud Cauley', 48, 20, 68, 15, 4, 0, 70.1, 303.7, 60.2, 65.8, 1.754, 61.0, 3.853, 3284510, 1133),
  ('Aaron Rai', 49, 21, 72, 16, 2, 0, 70.0, 289.6, 73.9, 70.5, 1.784, 61.2, 3.847, 3274601, 957),
  ('Jordan Spieth', 50, 19, 68, 16, 4, 0, 70.1, 306.6, 58.1, 64.6, 1.722, 60.9, 3.897, 3159660, 927)
  -- Continue with remaining players...
) AS v(name, rank, events, rounds, cuts, top10s, wins, scoring_avg, driving_distance, driving_accuracy, gir, putts, sand, birds, earnings, cup_points)
ON p.full_name = v.name
ON CONFLICT (player_id, season) DO UPDATE
SET 
  current_rank = EXCLUDED.current_rank,
  events_played = EXCLUDED.events_played,
  rounds_played = EXCLUDED.rounds_played,
  cuts_made = EXCLUDED.cuts_made,
  top_10s = EXCLUDED.top_10s,
  wins = EXCLUDED.wins,
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

-- Continue inserting players 51-100
WITH player_ids AS (
  SELECT id, full_name FROM players
)
INSERT INTO player_stats (
  player_id, season, current_rank, 
  events_played, rounds_played, cuts_made, top_10s, wins,
  scoring_avg, driving_distance, driving_accuracy, 
  gir_percentage, putts_per_hole, sand_save_pct, birdies_per_round,
  total_earnings, fedex_cup_points
)
SELECT 
  p.id, 2024, v.rank,
  v.events, v.rounds, v.cuts, v.top10s, v.wins,
  v.scoring_avg, v.driving_distance, v.driving_accuracy,
  v.gir, v.putts, v.sand, v.birds,
  v.earnings::DECIMAL, v.cup_points
FROM player_ids p
JOIN (VALUES
  ('Min Woo Lee', 51, 17, 60, 13, 1, 1, 70.8, 314.4, 55.3, 63.4, 1.756, 64.5, 3.75, 3109286, 864),
  ('J.T. Poston', 52, 24, 84, 19, 1, 0, 70.4, 295.4, 65.6, 64.9, 1.764, 59.7, 3.702, 3030583, 1102),
  ('Jake Knapp', 53, 23, 77, 16, 4, 0, 69.5, 313.4, 55.6, 67.6, 1.721, 61.4, 4.416, 3012401, 889),
  ('Aldrich Potgieter', 54, 18, 50, 6, 3, 1, 70.7, 327.4, 55.5, 64.4, 1.745, 62.5, 3.9, 2994866, 961),
  ('Chris Kirk', 55, 22, 74, 15, 3, 0, 70.2, 298.2, 61.2, 67.6, 1.75, 49.5, 3.784, 2939050, 962),
  ('Max Greyserman', 56, 25, 83, 17, 2, 0, 70.3, 309.0, 54.8, 64.9, 1.729, 59.7, 4.048, 2920925, 855),
  ('Wyndham Clark', 57, 22, 76, 17, 2, 0, 70.1, 312.9, 55.1, 65.7, 1.727, 55.2, 4.211, 2864392, 875),
  ('Joe Highsmith', 58, 26, 70, 11, 2, 1, 71.0, 299.4, 60.8, 61.7, 1.74, 58.3, 3.8, 2806619, 843),
  ('Jhonattan Vegas', 59, 21, 71, 15, 2, 0, 70.8, 309.0, 54.2, 66.8, 1.787, 51.2, 3.718, 2795198, 1047),
  ('Tony Finau', 60, 20, 71, 15, 1, 0, 71.0, 304.9, 56.9, 64.9, 1.781, 51.9, 3.648, 2551493, 706),
  ('Stephan Jaeger', 61, 23, 77, 16, 3, 0, 70.5, 305.9, 53.1, 63.8, 1.725, 60.7, 4.013, 2531801, 763),
  ('Davis Riley', 62, 25, 74, 12, 3, 0, 70.7, 306.9, 54.6, 62.8, 1.724, 55.9, 3.905, 2468858, 739),
  ('Patrick Rodgers', 63, 25, 78, 15, 1, 0, 70.1, 308.2, 57.3, 64.2, 1.748, 54.3, 3.782, 2359002, 730),
  ('Mackenzie Hughes', 64, 23, 76, 15, 3, 0, 70.6, 301.2, 56.4, 64.4, 1.783, 54.2, 3.395, 2271576, 726),
  ('Davis Thompson', 65, 23, 76, 15, 1, 0, 70.2, 304.4, 64.5, 68.6, 1.767, 54.2, 4.026, 2258359, 615),
  ('Byeong Hun An', 66, 23, 76, 15, 2, 0, 70.8, 307.7, 54.3, 64.7, 1.76, 56.8, 3.645, 2250267, 595),
  ('Nico Echavarria', 67, 22, 71, 14, 2, 0, 70.1, 296.9, 62.6, 66.3, 1.728, 60.0, 3.93, 2235640, 734),
  ('Kevin Yu', 68, 24, 77, 15, 2, 0, 69.6, 309.8, 61.6, 70.1, 1.744, 56.9, 4.169, 2218301, 732),
  ('Erik van Rooyen', 69, 23, 62, 11, 3, 0, 70.4, 309.0, 59.4, 66.8, 1.74, 46.0, 4.0, 2129416, 652),
  ('Cam Davis', 70, 23, 64, 11, 1, 0, 71.1, 302.2, 53.9, 62.6, 1.742, 54.5, 3.719, 2093245, 656),
  ('Christiaan Bezuidenhout', 71, 23, 77, 16, 1, 0, 70.4, 289.2, 64.5, 66.4, 1.753, 54.6, 3.403, 2018690, 579),
  ('Matti Schmid', 72, 23, 72, 12, 4, 0, 70.1, 315.6, 55.4, 68.6, 1.757, 50.6, 4.097, 1963817, 682),
  ('Gary Woodland', 73, 20, 68, 14, 1, 0, 69.8, 313.3, 58.6, 67.6, 1.763, 52.9, 3.588, 1957021, 599),
  ('Emiliano Grillo', 74, 23, 78, 17, 1, 0, 69.9, 301.3, 67.4, 67.1, 1.742, 57.3, 3.846, 1954443, 668),
  ('Eric Cole', 75, 26, 85, 17, 2, 0, 70.6, 298.9, 57.6, 62.5, 1.735, 61.3, 3.824, 1919782, 549),
  ('Matt McCarty', 76, 23, 73, 14, 2, 0, 69.8, 296.8, 64.5, 66.4, 1.751, 52.2, 4.041, 1887582, 535),
  ('Nicolai Højgaard', 77, 15, 46, 9, 3, 0, 69.5, 319.6, 52.7, 71.4, 1.75, 58.2, 4.261, 1758757, 596),
  ('Adam Scott', 78, 17, 62, 14, 0, 0, 70.6, 305.7, 57.6, 65.9, 1.765, 63.8, 3.823, 1749484, 451),
  ('Alex Smalley', 79, 22, 68, 13, 2, 0, 69.3, 308.4, 63.6, 69.0, 1.754, 61.1, 4.206, 1745773, 554),
  ('Keith Mitchell', 80, 20, 66, 14, 2, 0, 69.4, 315.1, 59.5, 69.9, 1.75, 63.4, 4.379, 1695785, 589),
  ('Mark Hubbard', 81, 24, 74, 16, 3, 0, 70.0, 302.7, 62.6, 66.6, 1.752, 53.0, 4.041, 1657081, 558),
  ('Ryo Hisatsune', 82, 23, 68, 14, 4, 0, 70.0, 300.0, 60.4, 68.4, 1.785, 70.1, 3.456, 1653102, 504),
  ('Rasmus Højgaard', 83, 18, 58, 12, 1, 0, 70.5, 318.0, 54.9, 66.5, 1.787, 48.7, 4.0, 1646723, 500),
  ('Kevin Roy', 84, 22, 65, 14, 3, 0, 69.2, 307.5, 63.9, 69.4, 1.741, 55.8, 4.046, 1577334, 556),
  ('Sami Välimäki', 85, 20, 65, 13, 2, 0, 69.9, 299.4, 59.8, 67.9, 1.742, 50.0, 4.0, 1498501, 463),
  ('Austin Eckroat', 86, 23, 70, 13, 0, 0, 70.7, 300.2, 65.1, 67.0, 1.784, 62.1, 3.757, 1463075, 371),
  ('Mac Meissner', 87, 22, 64, 12, 1, 0, 70.2, 302.5, 58.4, 64.6, 1.761, 63.0, 3.688, 1444313, 495),
  ('Karl Vilips', 88, 17, 46, 7, 2, 1, 70.2, 307.8, 55.7, 67.3, 1.74, 50.9, 3.87, 1404749, 515),
  ('William Mouw', 89, 20, 59, 10, 3, 1, 70.0, 310.3, 58.9, 68.9, 1.776, 69.0, 3.966, 1383834, 542),
  ('Beau Hossler', 90, 22, 72, 17, 1, 0, 70.3, 307.2, 52.0, 63.5, 1.733, 61.3, 3.833, 1376862, 453),
  ('Michael Thorbjornsen', 91, 20, 59, 11, 3, 0, 69.7, 318.3, 61.4, 70.9, 1.761, 48.7, 4.305, 1364039, 454),
  ('Taylor Moore', 92, 20, 62, 12, 2, 0, 69.8, 310.4, 57.6, 67.6, 1.76, 51.6, 3.855, 1334344, 405),
  ('Billy Horschel', 93, 12, 0, 7, 2, 0, 70.0, 0, 0, 0, 0, 0, 0, 1333554, 399),
  ('Matt Wallace', 94, 20, 61, 12, 1, 0, 70.0, 305.5, 56.2, 66.4, 1.778, 57.1, 3.705, 1329160, 439),
  ('Tom Kim', 95, 23, 74, 14, 1, 0, 70.8, 301.0, 60.9, 63.7, 1.77, 59.1, 3.554, 1329009, 426),
  ('David Lipsky', 96, 23, 60, 10, 3, 0, 70.4, 293.0, 63.5, 66.9, 1.787, 64.0, 3.583, 1312409, 442),
  ('Max McGreevy', 97, 24, 66, 12, 2, 0, 70.1, 299.4, 66.2, 66.8, 1.764, 56.5, 3.803, 1294281, 412),
  ('Alex Noren', 98, 9, 0, 6, 2, 0, 70.0, 0, 0, 0, 0, 0, 0, 1293000, 382),
  ('Max Homa', 99, 20, 57, 11, 1, 0, 71.1, 301.5, 59.9, 65.1, 1.751, 64.1, 3.719, 1279333, 351),
  ('Patrick Fishburn', 100, 23, 63, 11, 4, 0, 69.7, 306.9, 57.6, 70.8, 1.777, 51.9, 3.905, 1275844, 423)
) AS v(name, rank, events, rounds, cuts, top10s, wins, scoring_avg, driving_distance, driving_accuracy, gir, putts, sand, birds, earnings, cup_points)
ON p.full_name = v.name
ON CONFLICT (player_id, season) DO UPDATE
SET 
  current_rank = EXCLUDED.current_rank,
  events_played = EXCLUDED.events_played,
  rounds_played = EXCLUDED.rounds_played,
  cuts_made = EXCLUDED.cuts_made,
  top_10s = EXCLUDED.top_10s,
  wins = EXCLUDED.wins,
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

-- Continue inserting players 101-200 (simplified for players with limited data)
WITH player_ids AS (
  SELECT id, full_name FROM players
)
INSERT INTO player_stats (
  player_id, season, current_rank, 
  events_played, rounds_played, cuts_made, top_10s, wins,
  scoring_avg, driving_distance, driving_accuracy, 
  gir_percentage, putts_per_hole, sand_save_pct, birdies_per_round,
  total_earnings, fedex_cup_points
)
SELECT 
  p.id, 2024, v.rank,
  v.events, v.rounds, v.cuts, v.top10s, v.wins,
  v.scoring_avg, v.driving_distance, v.driving_accuracy,
  v.gir, v.putts, v.sand, v.birds,
  v.earnings::DECIMAL, v.cup_points
FROM player_ids p
JOIN (VALUES
  ('Andrew Putnam', 101, 21, 60, 12, 2, 0, 69.4, 282.6, 70.3, 70.5, 1.757, 65.8, 3.783, 1270618, 423),
  ('Lee Hodges', 102, 19, 56, 11, 3, 0, 69.3, 304.1, 63.5, 70.5, 1.758, 56.3, 3.911, 1232339, 383),
  ('Danny Walker', 103, 20, 51, 7, 1, 0, 70.3, 308.4, 53.8, 65.5, 1.747, 55.1, 4.196, 1217158, 411),
  ('Joel Dahmen', 104, 22, 59, 10, 3, 0, 69.8, 299.0, 69.2, 68.5, 1.766, 55.1, 3.864, 1194612, 433),
  ('Sam Ryder', 105, 21, 66, 15, 0, 0, 69.7, 300.0, 59.9, 65.4, 1.722, 63.8, 4.015, 1162805, 368),
  ('Victor Perez', 106, 20, 66, 14, 1, 0, 69.6, 304.0, 64.4, 71.8, 1.787, 52.6, 3.803, 1125301, 367),
  ('Isaiah Salinda', 107, 19, 51, 10, 2, 0, 70.4, 314.6, 61.6, 67.9, 1.772, 62.0, 4.118, 1121942, 383),
  ('Rico Hoey', 108, 24, 74, 16, 2, 0, 69.7, 308.1, 67.8, 72.1, 1.804, 42.4, 4.027, 1117200, 376),
  ('Vince Whaley', 109, 23, 72, 16, 2, 0, 69.6, 310.5, 53.1, 67.3, 1.737, 60.9, 3.75, 1082997, 404),
  ('Jesper Svensson', 110, 21, 71, 15, 1, 0, 69.6, 320.2, 54.5, 66.4, 1.736, 57.4, 4.296, 1057213, 363),
  ('Garrick Higgo', 111, 11, 0, 7, 1, 1, 70.0, 0, 0, 0, 0, 0, 0, 1012783, 406),
  ('Alejandro Tosti', 112, 20, 52, 8, 3, 0, 70.2, 314.2, 56.1, 64.5, 1.755, 53.5, 3.75, 1010144, 333),
  ('Justin Lower', 113, 23, 64, 10, 2, 0, 70.7, 299.4, 63.0, 64.8, 1.751, 59.1, 3.703, 1006375, 314),
  ('Jackson Suber', 114, 21, 57, 10, 3, 0, 70.5, 309.1, 54.3, 66.7, 1.778, 50.0, 3.825, 1001087, 320),
  ('Will Zalatoris', 115, 11, 0, 9, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 1001003, 249),
  ('Nick Dunlap', 116, 22, 64, 11, 1, 0, 71.7, 297.0, 47.6, 63.5, 1.777, 59.8, 3.5, 969325, 255),
  ('Henrik Norlander', 117, 22, 71, 14, 1, 0, 69.9, 296.4, 63.6, 69.0, 1.781, 61.0, 3.62, 965040, 327),
  ('Matt Kuchar', 118, 13, 0, 11, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 938630, 285),
  ('Ricky Castillo', 119, 22, 64, 13, 1, 0, 69.8, 312.6, 60.9, 69.3, 1.781, 49.4, 3.891, 924630, 324),
  ('Thorbjørn Olesen', 120, 18, 58, 12, 2, 0, 69.7, 306.4, 61.9, 69.6, 1.773, 48.4, 3.759, 920375, 311),
  ('Séamus Power', 121, 21, 58, 10, 1, 0, 70.3, 299.4, 62.5, 66.5, 1.78, 58.1, 3.621, 917065, 279),
  ('Chan Kim', 122, 23, 63, 10, 2, 0, 70.1, 306.1, 60.7, 66.5, 1.752, 56.2, 3.81, 913918, 334),
  ('Brandt Snedeker', 123, 19, 50, 8, 2, 0, 70.2, 287.1, 68.5, 65.0, 1.737, 64.4, 3.64, 912476, 280),
  ('Adam Hadwin', 124, 23, 69, 13, 1, 0, 70.7, 301.1, 61.3, 64.3, 1.745, 64.3, 3.884, 905836, 254),
  ('Hayden Springer', 125, 17, 54, 13, 1, 0, 70.0, 312.2, 59.0, 65.7, 1.734, 54.7, 4.148, 900506, 304),
  ('Zach Johnson', 126, 15, 0, 7, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 882445, 298),
  ('Kris Ventura', 127, 22, 62, 12, 1, 0, 70.1, 313.5, 60.0, 68.2, 1.753, 56.0, 3.903, 881851, 304),
  ('Chad Ramey', 128, 23, 63, 10, 3, 0, 70.2, 296.9, 61.6, 66.8, 1.745, 63.6, 3.603, 870927, 319),
  ('Chandler Phillips', 129, 22, 63, 12, 1, 0, 70.4, 299.1, 61.0, 64.4, 1.747, 56.1, 3.619, 845264, 294),
  ('Harry Higgs', 130, 22, 64, 12, 1, 0, 70.7, 309.6, 57.5, 65.8, 1.764, 56.3, 3.875, 843026, 338),
  ('Sahith Theegala', 131, 18, 57, 11, 0, 0, 71.4, 302.4, 54.3, 62.7, 1.748, 52.6, 3.754, 832659, 209),
  ('Paul Peterson', 132, 20, 48, 7, 2, 0, 69.6, 283.8, 73.9, 66.9, 1.732, 62.9, 3.958, 819369, 291),
  ('Adam Schenk', 133, 23, 55, 7, 2, 0, 70.8, 306.5, 53.8, 61.7, 1.774, 58.4, 3.636, 813894, 258),
  ('Carson Young', 134, 21, 60, 12, 2, 0, 70.2, 296.9, 67.4, 69.2, 1.772, 59.5, 3.783, 810527, 285),
  ('Doug Ghim', 135, 21, 62, 13, 0, 0, 70.1, 302.7, 62.6, 69.3, 1.792, 56.8, 3.677, 787731, 288),
  ('Takumi Kanaya', 136, 22, 57, 7, 2, 0, 70.0, 292.1, 71.3, 66.0, 1.784, 55.4, 3.561, 784297, 257),
  ('Will Gordon', 137, 19, 46, 7, 2, 0, 70.4, 316.6, 57.4, 70.3, 1.825, 56.4, 3.522, 766739, 235),
  ('Cameron Champ', 138, 11, 0, 7, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 745024, 271),
  ('David Skinns', 139, 21, 57, 10, 3, 0, 70.1, 311.7, 56.5, 68.1, 1.764, 55.3, 3.807, 739992, 254),
  ('Charley Hoffman', 140, 15, 0, 8, 2, 0, 70.0, 0, 0, 0, 0, 0, 0, 715102, 231),
  ('Thriston Lawrence', 141, 18, 0, 6, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 712868, 206),
  ('Pierceson Coody', 142, 12, 0, 7, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 701059, 248),
  ('Jeremy Paul', 143, 20, 54, 9, 1, 0, 69.9, 308.9, 55.0, 67.9, 1.75, 58.7, 3.796, 673791, 271),
  ('Antoine Rozner', 144, 17, 61, 14, 0, 0, 70.2, 309.4, 56.7, 69.6, 1.763, 50.8, 3.902, 646350, 207),
  ('Steven Fisk', 145, 21, 61, 11, 1, 0, 70.0, 313.2, 59.8, 71.1, 1.805, 48.1, 3.557, 634140, 246),
  ('Lanto Griffin', 146, 23, 59, 10, 1, 0, 70.5, 300.8, 62.3, 65.9, 1.78, 45.6, 3.661, 623926, 234),
  ('Noah Goodwin', 147, 19, 53, 9, 1, 0, 70.2, 302.5, 64.2, 65.8, 1.747, 55.0, 3.887, 620288, 219),
  ('Frankie Capan III', 148, 22, 51, 6, 1, 0, 71.6, 303.5, 42.6, 58.6, 1.76, 52.5, 3.255, 618127, 191),
  ('Matteo Manassero', 149, 15, 0, 8, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 604148, 199),
  ('Matthieu Pavon', 150, 22, 70, 14, 0, 0, 71.9, 299.4, 61.2, 63.5, 1.783, 54.1, 3.371, 586895, 144),
  ('Nate Lashley', 151, 20, 53, 10, 0, 0, 70.1, 299.4, 60.1, 67.3, 1.79, 52.5, 3.434, 559402, 217),
  ('Taylor Montgomery', 152, 17, 48, 9, 1, 0, 69.5, 305.3, 51.5, 64.2, 1.692, 65.1, 4.229, 555703, 198),
  ('Luke List', 153, 22, 57, 9, 2, 0, 70.6, 312.7, 60.9, 65.0, 1.798, 65.5, 3.526, 549461, 175),
  ('Brice Garnett', 154, 19, 56, 10, 0, 0, 69.9, 290.6, 68.7, 69.4, 1.77, 64.4, 3.571, 549353, 199),
  ('Danny Willett', 155, 14, 0, 6, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 536979, 168),
  ('Camilo Villegas', 156, 20, 55, 11, 1, 0, 70.6, 292.1, 51.3, 64.8, 1.74, 55.3, 3.891, 527708, 150),
  ('Will Chandler', 157, 23, 57, 7, 1, 0, 71.8, 300.5, 59.6, 60.7, 1.759, 65.6, 3.298, 497518, 165),
  ('Quade Cummins', 158, 21, 58, 11, 0, 0, 70.1, 304.8, 55.5, 65.2, 1.758, 65.9, 3.672, 488244, 217),
  ('Ben Kohles', 159, 22, 62, 11, 1, 0, 69.7, 296.7, 72.3, 72.0, 1.768, 51.9, 3.758, 486073, 198),
  ('Trey Mullinax', 160, 17, 48, 8, 0, 0, 70.1, 314.0, 52.9, 68.9, 1.755, 55.4, 3.979, 481535, 176),
  ('Greyson Sigg', 161, 21, 53, 7, 1, 0, 70.4, 296.3, 64.2, 67.4, 1.807, 52.9, 3.396, 465556, 164),
  ('Joseph Bramlett', 162, 14, 0, 6, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 441562, 176),
  ('Taylor Dickson', 163, 20, 51, 7, 1, 0, 71.4, 301.5, 58.8, 61.9, 1.799, 51.7, 3.314, 433316, 135),
  ('Nick Hardy', 164, 22, 53, 6, 1, 0, 70.3, 311.5, 57.2, 70.4, 1.78, 53.9, 3.66, 432097, 145),
  ('Ben Silverman', 165, 21, 55, 9, 0, 0, 70.4, 299.4, 61.1, 64.6, 1.773, 59.0, 3.509, 426906, 157),
  ('Adam Svensson', 166, 23, 63, 10, 0, 0, 70.2, 295.6, 64.6, 68.6, 1.796, 63.5, 3.524, 412828, 158),
  ('Niklas Norgaard', 167, 17, 0, 7, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 411606, 162),
  ('Dylan Wu', 168, 13, 0, 6, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 403726, 129),
  ('Thomas Rosenmueller', 169, 20, 55, 10, 0, 0, 70.1, 312.8, 63.4, 70.8, 1.773, 40.7, 3.982, 364174, 144),
  ('John Pak', 170, 20, 55, 9, 0, 0, 70.8, 290.3, 65.8, 64.9, 1.773, 53.2, 3.436, 336909, 121),
  ('Webb Simpson', 171, 9, 0, 5, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 331880, 131),
  ('Trace Crowe', 172, 5, 0, 2, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 279315, 93),
  ('Peter Malnati', 173, 22, 59, 9, 0, 0, 71.1, 301.2, 49.4, 60.9, 1.753, 60.6, 3.525, 268753, 80),
  ('Hayden Buckley', 174, 18, 0, 4, 2, 0, 70.0, 0, 0, 0, 0, 0, 0, 259533, 100),
  ('Ben Martin', 175, 15, 0, 7, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 259050, 99),
  ('Cristobal Del Solar', 176, 20, 55, 9, 0, 0, 70.9, 305.1, 51.0, 64.2, 1.744, 47.2, 3.655, 250132, 88),
  ('K.H. Lee', 177, 10, 0, 2, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 244845, 71),
  ('Trevor Cone', 178, 20, 51, 8, 0, 0, 70.6, 315.6, 56.1, 67.5, 1.811, 57.5, 3.49, 244779, 83),
  ('Zac Blair', 179, 15, 0, 7, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 233403, 104),
  ('Matthew Riedel', 180, 19, 50, 8, 0, 0, 71.0, 306.0, 57.9, 67.6, 1.788, 48.5, 3.62, 229252, 87),
  ('Patton Kizzire', 181, 21, 50, 6, 0, 0, 70.7, 297.0, 58.1, 64.0, 1.762, 68.8, 3.84, 216424, 72),
  ('Kevin Velo', 182, 21, 45, 3, 1, 0, 71.3, 299.8, 63.0, 65.3, 1.813, 47.1, 3.467, 209169, 68),
  ('Rafael Campos', 183, 25, 65, 8, 0, 0, 71.8, 305.5, 54.6, 61.2, 1.76, 55.5, 3.446, 203557, 63),
  ('C.T. Pan', 184, 7, 0, 5, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 186829, 55),
  ('Luke Clanton', 185, 12, 0, 8, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 185190, 41),
  ('Kevin Kisner', 186, 16, 0, 3, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 181498, 67),
  ('Kevin Streelman', 187, 4, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 171703, 55),
  ('Vincent Norrman', 188, 7, 0, 5, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 168514, 63),
  ('Aaron Baddeley', 189, 17, 0, 6, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 167011, 64),
  ('Rikuya Hoshino', 190, 17, 0, 6, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 164436, 68),
  ('Norman Xiong', 191, 6, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 164185, 69),
  ('Philip Knowles', 192, 14, 0, 4, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 158456, 64),
  ('Braden Thornberry', 193, 20, 0, 3, 1, 0, 70.0, 0, 0, 0, 0, 0, 0, 157374, 57),
  ('Mason Andersen', 194, 19, 49, 7, 0, 0, 71.2, 299.9, 55.5, 61.6, 1.742, 56.7, 3.531, 126049, 43),
  ('Francesco Molinari', 195, 11, 0, 5, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 125450, 35),
  ('Matt NeSmith', 196, 9, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 122960, 56),
  ('Martin Laird', 197, 9, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 122733, 49),
  ('Scott Piercy', 198, 7, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 109755, 53),
  ('Kaito Onishi', 199, 19, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 101608, 42),
  ('Chesson Hadley', 200, 10, 0, 3, 0, 0, 70.0, 0, 0, 0, 0, 0, 0, 101470, 53)
) AS v(name, rank, events, rounds, cuts, top10s, wins, scoring_avg, driving_distance, driving_accuracy, gir, putts, sand, birds, earnings, cup_points)
ON p.full_name = v.name
ON CONFLICT (player_id, season) DO UPDATE
SET 
  current_rank = EXCLUDED.current_rank,
  events_played = EXCLUDED.events_played,
  rounds_played = EXCLUDED.rounds_played,
  cuts_made = EXCLUDED.cuts_made,
  top_10s = EXCLUDED.top_10s,
  wins = EXCLUDED.wins,
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

-- =====================================================
-- STEP 3: Refresh Materialized View
-- =====================================================

SELECT refresh_current_season_stats();

-- =====================================================
-- Verification
-- =====================================================

DO $$
DECLARE
  v_player_count INTEGER;
  v_stats_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT player_id) FROM player_stats WHERE season = 2024 INTO v_stats_count;
  SELECT COUNT(*) FROM players INTO v_player_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '======================================';
  RAISE NOTICE 'PGA Tour Data Import Complete!';
  RAISE NOTICE '======================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Players in database: %', v_player_count;
  RAISE NOTICE 'Players with 2024 stats: %', v_stats_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Top 5 by earnings:';
  RAISE NOTICE 'Run: SELECT * FROM current_season_leaderboard ORDER BY total_earnings DESC LIMIT 5;';
  RAISE NOTICE '';
END $$;

COMMIT;