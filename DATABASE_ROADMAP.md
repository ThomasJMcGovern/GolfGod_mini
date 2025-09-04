# GolfGod Database Roadmap 🏌️‍♂️

## Current Status (As of September 2025)

### ✅ What We Have (30% Complete)
- Basic player profiles and stats
- Tournament structure
- Simple round tracking
- Basic strokes gained metrics
- AM/PM wave tracking
- Wind speed (basic)

### 🎯 Critical Missing Components

## Phase 1: Foundation (Weeks 1-2)
**Priority: CRITICAL** - Core functionality required for MVP

### 1.1 Course Architecture Tables
```sql
CREATE TABLE course (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  architect TEXT,
  year_built INT,
  total_yardage INT,
  par INT,
  slope_rating NUMERIC,
  course_rating NUMERIC
);

CREATE TABLE course_details (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES course(id),
  grass_type_greens TEXT,
  grass_type_fairways TEXT,
  grass_type_rough TEXT,
  green_size_avg_sqft INT,
  stimpmeter_typical NUMERIC,
  bunker_count INT,
  water_hazards_count INT,
  tree_density TEXT CHECK (tree_density IN ('heavy', 'medium', 'light', 'minimal')),
  favors_shape TEXT CHECK (favors_shape IN ('draw', 'fade', 'neutral')),
  altitude_feet INT
);

CREATE TABLE hole (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES course(id),
  hole_number INT CHECK (hole_number BETWEEN 1 AND 18),
  par INT CHECK (par BETWEEN 3 AND 5),
  yardage INT,
  handicap INT,
  has_water BOOLEAN,
  bunkers_count INT,
  tee_shot_difficulty TEXT,
  approach_difficulty TEXT,
  UNIQUE(course_id, hole_number)
);
```

### 1.2 Weather Tracking Enhancement
```sql
CREATE TABLE weather_conditions (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT REFERENCES tournament(id),
  round_no INT,
  time_slot TEXT CHECK (time_slot IN ('early_am', 'late_am', 'early_pm', 'late_pm')),
  temperature_f INT,
  wind_speed_mph NUMERIC,
  wind_direction TEXT,
  precipitation TEXT,
  humidity_pct INT,
  conditions TEXT
);
```

### 1.3 Player Course History
```sql
CREATE TABLE player_course_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  course_id BIGINT REFERENCES course(id),
  rounds_played INT DEFAULT 0,
  scoring_avg NUMERIC,
  best_score INT,
  worst_score INT,
  cuts_made INT,
  wins INT,
  top_10s INT,
  earnings BIGINT,
  last_played DATE
);
```

## Phase 2: Advanced Metrics (Weeks 3-4)
**Priority: HIGH** - Differentiating "Genius" features

### 2.1 Granular Performance Tracking
```sql
CREATE TABLE round_splits (
  id BIGSERIAL PRIMARY KEY,
  round_id BIGINT REFERENCES round(id),
  front_nine_score INT,
  back_nine_score INT,
  thu_fri BOOLEAN, -- true for Thu/Fri, false for Sat/Sun
  holes_1_6_score INT,
  holes_7_12_score INT,
  holes_13_18_score INT
);

CREATE TABLE grass_performance (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  grass_type TEXT,
  stat_type TEXT, -- 'putting', 'approach', 'scrambling'
  rounds_played INT,
  performance_metric NUMERIC
);

CREATE TABLE wind_performance (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  wind_category TEXT CHECK (wind_category IN ('calm', 'light', 'moderate', 'strong')),
  sg_app_avg NUMERIC,
  driving_accuracy NUMERIC,
  gir_pct NUMERIC,
  scoring_avg NUMERIC
);
```

### 2.2 Specialized Scoring Patterns
```sql
CREATE TABLE par3_performance (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  yardage_bracket TEXT, -- '100-135', '136-165', '166-200', '201-225', '225+'
  birdie_pct NUMERIC,
  par_pct NUMERIC,
  bogey_plus_pct NUMERIC,
  scoring_avg NUMERIC
);

CREATE TABLE scoring_streaks (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  tournament_id BIGINT REFERENCES tournament(id),
  consecutive_birdies INT,
  consecutive_pars INT,
  bounce_back_rate NUMERIC -- birdie after bogey
);
```

## Phase 3: Intangibles & External Data (Weeks 5-6)
**Priority: MEDIUM** - Enhancement features

### 3.1 Player Connections
```sql
CREATE TABLE player_intangibles (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  hometown_lat NUMERIC,
  hometown_lng NUMERIC,
  college_lat NUMERIC,
  college_lng NUMERIC,
  home_course_id BIGINT REFERENCES course(id),
  family_connections JSONB, -- flexible storage for various connections
  injury_history JSONB,
  equipment_changes JSONB
);

CREATE TABLE caddy_history (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT REFERENCES player(id),
  caddy_name TEXT,
  start_date DATE,
  end_date DATE,
  wins_together INT,
  earnings_together BIGINT
);
```

### 3.2 Betting & Odds Integration
```sql
CREATE TABLE tournament_odds (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT REFERENCES tournament(id),
  player_id BIGINT REFERENCES player(id),
  opening_odds TEXT,
  closing_odds TEXT,
  odds_movement JSONB,
  final_position INT,
  payout_multiple NUMERIC
);
```

## Phase 4: Historical Deep Dive (Weeks 7-8)
**Priority: LOW** - Long-term value features

### 4.1 Multi-Year Tracking
```sql
CREATE TABLE course_history (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES course(id),
  year INT,
  winning_score INT,
  cut_line INT,
  scoring_avg NUMERIC,
  weather_summary TEXT,
  notable_events TEXT
);

CREATE TABLE major_championship_history (
  id BIGSERIAL PRIMARY KEY,
  championship_name TEXT,
  year INT,
  course_id BIGINT REFERENCES course(id),
  winner_id BIGINT REFERENCES player(id),
  winning_score INT,
  playoff BOOLEAN,
  weather_factor TEXT
);
```

## Data Collection Strategy

### Immediate Actions (Week 1)
1. **Scraper Development** (Bun/TypeScript)
   - PGA Tour stats API
   - ESPN player profiles
   - Weather.com historical data
   - Course websites

2. **Manual Data Entry Portal**
   - Simple admin UI for course details
   - Intangibles entry form
   - Data verification workflow

3. **VaporWare Generation**
   - Create realistic fake data for demo
   - Use statistical distributions from real golf
   - Generate 2-3 years of historical data

### Data Sources Priority
1. **Automated** (Week 1-2)
   - PGA Tour official stats
   - ESPN rankings/profiles
   - Weather APIs

2. **Semi-Automated** (Week 3-4)
   - Course websites (scraping)
   - Vegas odds sites
   - Social media (player updates)

3. **Manual Entry** (Ongoing)
   - Course architect info
   - Grass types
   - Intangibles
   - Historical anecdotes

## Success Metrics

### MVP Requirements (80-85% functionality)
- [ ] All Phase 1 tables populated
- [ ] 50% of Phase 2 tables populated
- [ ] Core "Genius" metrics functional
- [ ] 100+ players with full profiles
- [ ] 20+ courses with complete details
- [ ] Current season data complete

### Data Quality Targets
- Player stats: 95% accuracy
- Course details: 100% accuracy (manual verified)
- Weather data: Real-time during tournaments
- Historical data: 3-5 years minimum

## Technical Implementation Notes

### Database Optimizations
- Materialized views for complex queries
- Indexes on all foreign keys
- Partitioning for historical data
- JSON columns for flexible attributes

### API Design
- RESTful endpoints for each data domain
- GraphQL for complex queries
- WebSocket for live tournament data
- Batch endpoints for bulk operations

### Caching Strategy
- Redis for hot data (current tournament)
- CDN for static course data
- Local storage for user preferences
- Service worker for offline access

## Timeline Summary

**Weeks 1-2**: Foundation (Critical)
**Weeks 3-4**: Advanced Metrics (High)
**Weeks 5-6**: Intangibles (Medium)
**Weeks 7-8**: Historical (Low)
**Week 9+**: Continuous improvement and data quality

## Next Steps

1. **Immediate** (Today)
   - Run Phase 1 SQL migrations
   - Set up scraper infrastructure
   - Create admin data entry UI

2. **This Week**
   - Populate course table with 20 courses
   - Import current PGA Tour player list
   - Set up weather data pipeline

3. **Next Week**
   - Begin Phase 2 implementation
   - Start manual intangibles collection
   - Demo with partial real data

## Resources Needed

- **Development**: 2 engineers for 8 weeks
- **Data Collection**: 3-5 contractors for manual entry
- **APIs**: $500/month for premium data access
- **Infrastructure**: Supabase Pro plan minimum

---

*Last Updated: September 2025*
*Status: 30% Complete - Basic schema in place*
*Target: 85% by MVP launch*