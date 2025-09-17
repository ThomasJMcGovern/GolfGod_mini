# Railway PostgreSQL Setup Guide - GolfGod Mini

Complete guide to migrate from mock data to Railway PostgreSQL database.

## 🎯 Overview

This guide will help you:
1. Set up a Railway project with PostgreSQL
2. Configure your environment variables
3. Deploy the database schema
4. Import your golf data
5. Test the application with real data

## 📋 Prerequisites

- [Railway.app](https://railway.app) account (free tier available)
- Your golf data files (CSV or JSON format)
- Node.js/Bun environment set up

## 🚀 Step 1: Railway Project Setup

### 1.1 Create Railway Project

1. **Sign up/Login** to [Railway.app](https://railway.app)
2. **Create New Project** → "Deploy PostgreSQL"
3. **Project Name**: `golfgod-mini-db` (or your preferred name)
4. **Wait for deployment** (usually 1-2 minutes)

### 1.2 Get Database Credentials

1. **Go to your project** on Railway dashboard
2. **Click on PostgreSQL service**
3. **Go to "Variables" tab**
4. **Copy the following variables**:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

## 🔧 Step 2: Environment Configuration

### 2.1 Create Local Environment File

```bash
# Copy the template
cp .env.sample .env.local
```

### 2.2 Configure Environment Variables

Edit `.env.local` with your Railway credentials:

```env
# Your Railway PostgreSQL connection string
DATABASE_URL="postgresql://postgres.username:password@hostname:5432/railway"
DIRECT_URL="postgresql://postgres.username:password@hostname:5432/railway"

# Individual connection details (from Railway)
DB_HOST="hostname.railway.app"
DB_PORT="5432"
DB_NAME="railway"
DB_USER="postgres"
DB_PASSWORD="your-password"

# Application settings
NODE_ENV="development"
VITE_APP_NAME="GolfGod Mini"
```

**Important**: Replace the placeholder values with your actual Railway credentials.

## 🗄️ Step 3: Database Schema Deployment

### 3.1 Connect to Railway Database

You can use the Railway dashboard's built-in database client or connect via command line:

```bash
# Using Railway CLI (recommended)
npm install -g @railway/cli
railway login
railway link [your-project-id]
railway run psql $DATABASE_URL
```

Or use any PostgreSQL client with your connection string.

### 3.2 Deploy the Schema

Run the migration script:

```sql
-- Copy and paste the contents of database/migrations/001_initial_schema.sql
-- This will create all tables, indexes, views, and sample data
```

### 3.3 Verify Schema Deployment

Check that tables were created:

```sql
-- List all tables
\dt

-- Expected tables:
-- players
-- tournaments
-- tournament_results
-- player_stats

-- Check views
\dv

-- Expected views:
-- player_profiles_complete
-- player_tournament_results_espn
-- current_season_leaderboard
```

## 📊 Step 4: Data Import

### 4.1 Prepare Your Data Files

Follow the format guide in `scripts/import/sample-data-formats.md`:

- **Players**: `data/players.csv` or `data/players.json`
- **Tournaments**: `data/tournaments.csv` or `data/tournaments.json`
- **Results**: `data/tournament_results.csv` or `data/tournament_results.json`
- **Stats**: `data/player_stats.csv` or `data/player_stats.json`

### 4.2 Import Data (Recommended Order)

```bash
# 1. Import players first (required for foreign keys)
bun scripts/import/data-importer.ts --type players --file data/players.csv --dry-run
bun scripts/import/data-importer.ts --type players --file data/players.csv

# 2. Import tournaments
bun scripts/import/data-importer.ts --type tournaments --file data/tournaments.csv --dry-run
bun scripts/import/data-importer.ts --type tournaments --file data/tournaments.csv

# 3. Import tournament results (requires players and tournaments)
bun scripts/import/data-importer.ts --type results --file data/tournament_results.csv --dry-run
bun scripts/import/data-importer.ts --type results --file data/tournament_results.csv

# 4. Import player statistics
bun scripts/import/data-importer.ts --type stats --file data/player_stats.csv --dry-run
bun scripts/import/data-importer.ts --type stats --file data/player_stats.csv
```

### 4.3 Verify Data Import

Check your data was imported correctly:

```sql
-- Check record counts
SELECT COUNT(*) FROM players;
SELECT COUNT(*) FROM tournaments;
SELECT COUNT(*) FROM tournament_results;
SELECT COUNT(*) FROM player_stats;

-- Test ESPN-style view
SELECT * FROM player_tournament_results_espn LIMIT 5;

-- Test player profiles
SELECT * FROM player_profiles_complete LIMIT 5;
```

## 🧪 Step 5: Application Testing

### 5.1 Test Database Connection

```bash
# Start the development server
bun dev

# The app should now connect to Railway instead of mock data
# Check the browser console for any connection errors
```

### 5.2 Test Application Features

1. **Welcome Screen**: http://localhost:5173/
2. **Player Dashboard**: http://localhost:5173/player
3. **ESPN Results**: http://localhost:5173/player/1
4. **Tournament Dashboard**: http://localhost:5173/tournament

### 5.3 Verify Real Data

- Player list should show your imported players
- Tournament results should display your real data
- ESPN-style formatting should work correctly
- Year filtering should work with your data years

## 🔍 Troubleshooting

### Common Issues

**Connection Errors**:
```
Error: Missing required environment variables
```
- ✅ Check `.env.local` has correct Railway credentials
- ✅ Restart development server after changing environment

**Schema Errors**:
```
Error: relation "players" does not exist
```
- ✅ Verify schema was deployed correctly
- ✅ Check you're connected to the right database

**Data Import Errors**:
```
Error: Failed to import players
```
- ✅ Check data file format matches expected schema
- ✅ Use `--dry-run` first to test
- ✅ Verify foreign key references exist

**Application Errors**:
```
Error: Database connection failed
```
- ✅ Check Railway service is running
- ✅ Verify environment variables are correct
- ✅ Check network connectivity

### Debug Commands

```bash
# Test database connection
bun -e "import('./src/lib/database.js').then(db => db.checkDatabaseConnection().then(console.log))"

# Check environment variables
bun -e "console.log(process.env.DATABASE_URL)"

# Test query
bun -e "import('./src/lib/database.js').then(db => db.getDatabase().from('players').select('*').limit(1).then(console.log))"
```

## 🚀 Step 6: Production Deployment

### 6.1 Railway App Deployment (Optional)

You can also deploy your app to Railway:

1. **Create new service** in your Railway project
2. **Connect your GitHub repository**
3. **Set environment variables** in Railway dashboard
4. **Deploy automatically** on git push

### 6.2 Environment Variables for Production

In Railway dashboard, set these environment variables for your app service:

```
DATABASE_URL=[same as your PostgreSQL service]
DIRECT_URL=[same as your PostgreSQL service]
NODE_ENV=production
VITE_APP_NAME=GolfGod Mini
```

## 📚 Data Management

### Adding New Data

```bash
# Add new players
bun scripts/import/data-importer.ts --type players --file data/new_players.csv

# Add new tournaments
bun scripts/import/data-importer.ts --type tournaments --file data/new_tournaments.csv

# Update existing data (upsert mode)
bun scripts/import/data-importer.ts --type results --file data/updated_results.csv
```

### Backup and Restore

```bash
# Backup database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **Database Access**: Railway provides secure connections by default
3. **Connection Limits**: Monitor your Railway usage to avoid limits
4. **Data Validation**: All imports are validated against TypeScript schemas

## 🎉 Success!

Your GolfGod Mini application is now running with real data on Railway PostgreSQL!

**What you've accomplished**:
- ✅ Railway PostgreSQL database setup
- ✅ Complete ESPN-style schema deployment
- ✅ Real golf data import and validation
- ✅ Application migration from mock to real data
- ✅ Enhanced error handling and monitoring

## 📞 Support

- **Railway Documentation**: https://docs.railway.app/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Supabase Client Documentation**: https://supabase.com/docs/reference/javascript/
- **Issues**: Check the application logs and Railway dashboard for detailed error information