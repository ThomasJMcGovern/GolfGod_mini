# GolfGod Mini

A minimal golf performance analytics app built with Bun, React, TypeScript, and Supabase.

## Features

- 📊 **Performance Metrics**: View SG:APP, Fairways Hit %, and Avg Putts/Round
- 🌟 **Genius Splits**: Analyze performance in different wind conditions and AM/PM waves
- 💾 **Data Export**: Export player statistics to CSV
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⚡ **Real-time Connection Status**: Monitor Supabase connection health
- 🛡️ **Type Safety**: Full TypeScript with Zod validation
- 🧪 **Tested**: Comprehensive test suite for metrics calculations

## Prerequisites

- [Bun](https://bun.sh) (v1.0 or later)
- [Supabase](https://supabase.com) account
- macOS/Linux (Windows support via WSL)

## Quick Start

### 1. Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Supabase

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Copy your project URL and anon key from Project Settings → API
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy contents from schema.sql
```

### 4. Configure Environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# For seeding only (remove after use)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional
VITE_ENABLE_DB_LOGGING=false
```

### 5. Seed the Database

```bash
# Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local
bun run seed.ts

# IMPORTANT: Remove SUPABASE_SERVICE_ROLE_KEY after seeding!
```

### 6. Run the App

```bash
bun dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
golfgod-mini/
├── src/
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── logger.ts        # Logging utility
│   │   ├── metrics.ts       # Metrics calculations
│   │   └── metrics.test.ts  # Tests
│   ├── hooks/
│   │   └── useGolfData.ts   # React Query hooks
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   └── MetricsCard.tsx
│   ├── types.ts             # TypeScript types & Zod schemas
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── rounds.csv               # Sample data
├── seed.ts                  # Database seeder
└── schema.sql               # Database schema
```

## Testing

Run the test suite:

```bash
bun test
```

## Features in Detail

### Metrics Calculation

- **SG:APP (Strokes Gained: Approach)**: Average strokes gained on approach shots
- **Fairways Hit %**: Percentage of fairways hit in regulation
- **Avg Putts/Round**: Average number of putts per round

### Genius Splits

- **Wind Split**: Compare performance in windy (≥10mph) vs calm conditions
- **Wave Split**: Analyze AM vs PM tee time performance differences

### Data Export

Export all metrics and round details to CSV format for further analysis.

## Troubleshooting

### Connection Issues

1. Check your Supabase credentials in `.env.local`
2. Verify RLS policies are applied in Supabase
3. Check the connection status indicator in the app header

### No Data Showing

1. Ensure the seed script ran successfully
2. Check that tables have data in Supabase dashboard
3. Verify player and tournament selections

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

## 🚀 Project Status (September 2025)

### ✅ Completed
- **UI/UX Overhaul**: Modern interface with shadcn/ui components
- **Golf-themed Design**: Custom color palette (cream, sand, orange, terracotta, brown)
- **Navigation Structure**: Welcome → Tour Selection → Hub → Player/Tournament/Inside the Ropes
- **Glass Morphism Effects**: Modern depth with backdrop blur
- **Responsive Design**: Mobile-first approach with animations
- **Basic Database Schema**: Players, tournaments, rounds, tours
- **Mock Data System**: Demonstration data for UI development

### 🏗️ In Progress
- **Database Expansion**: Currently at 30% of required data coverage
- **Data Collection Pipeline**: Setting up scrapers and manual entry systems
- **Advanced Metrics**: Implementing "Genius" cross-pollination features

### 📊 Data Coverage Analysis

#### Currently Tracking (30% Complete)
- Basic player profiles and statistics
- Tournament information (dates, purse, field size)
- Round-level data (score, putts, fairways, SG metrics)
- AM/PM wave tracking
- Basic wind data

#### Critical Gaps (70% Remaining)
- **Course Architecture**: Grass types, bunker counts, green sizes, architect info (0% complete)
- **Hole-by-Hole Data**: Individual hole statistics and characteristics (0% complete)
- **Weather Granularity**: Time-of-day weather breakdowns (10% complete)
- **Player Intangibles**: Hometown connections, injury history (0% complete)
- **Advanced Metrics**: 20+ specialized performance categories (0% complete)
- **Historical Data**: 5-7 year course and major championship history (0% complete)

See [DATABASE_ROADMAP.md](./DATABASE_ROADMAP.md) for detailed implementation plan.

## 🎯 Immediate Next Steps (Week 1)

1. **Database Schema Phase 1** 
   ```bash
   # Run enhanced schema migrations
   bun run migrations/phase1.sql
   ```

2. **Data Collection Setup**
   - Deploy PGA Tour stats scraper
   - Create admin portal for manual entry
   - Generate VaporWare demo data

3. **API Development**
   - Build RESTful endpoints for new tables
   - Implement caching layer
   - Add real-time tournament updates

## 📈 MVP Target (8 Weeks)

To reach 80-85% functionality for Beta/Alpha:

- **Week 1-2**: Foundation tables (courses, weather, player history)
- **Week 3-4**: Advanced metrics ("Genius" features)
- **Week 5-6**: Intangibles and external data
- **Week 7-8**: Historical data and testing
- **Week 9+**: Continuous improvement

### Resources Required
- 2 engineers for core development
- 3-5 data collectors for manual entry
- $500/month for premium data APIs
- Supabase Pro plan for production

## 🔄 Recent Updates

- **September 3, 2025**: Fixed Tailwind CSS v4 → v3 compatibility
- **September 3, 2025**: Implemented modern UI with shadcn/ui
- **September 3, 2025**: Created comprehensive database roadmap
- **September 3, 2025**: Analyzed requirements vs current coverage

## Technologies Used

- **Runtime**: Bun
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod
- **Testing**: Bun test runner
- **Build Tool**: Vite

## License

MIT