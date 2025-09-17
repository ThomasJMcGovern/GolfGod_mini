# Supabase Views Setup Instructions

## Quick Setup

The app needs one optional view to be created in your Supabase database for enhanced ESPN-style formatting. However, the app will work without it by querying the raw tables directly.

### Option 1: Create the View (Optional - Enhanced Display)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `database/create-espn-views.sql`
4. Click **Run** to execute the SQL

This will create:
- `player_tournament_results_espn` - ESPN-formatted tournament results
- `player_available_years` - Available years for player data
- `player_profiles_complete` - Complete player profiles with stats

### Option 2: Use Existing Tables (Currently Active)

The app is already configured to work with your existing tables:
- `players` table (with `name` field mapped to `full_name`)
- `player_tournaments` table for tournament results
- `tournament_rounds` table for round scores
- `tournaments` table for tournament info

## Current Status

✅ **Database Connection**: Working
✅ **Tables Access**: All tables accessible
✅ **Data Display**: ScottieScheffler's 2025 data available
✅ **App Running**: http://localhost:5173

## Testing the Integration

1. Open http://localhost:5173 in your browser
2. Navigate to **PGA Tour** in the main navigation
3. Click **Choose Player**
4. Select **Scottie Scheffler** from the dropdown
5. View tournament results in ESPN-style format

## Notes

- The app uses mock data as fallback if database is unavailable
- All queries are optimized to work with your existing schema
- No schema changes are required to your existing database
- The views are optional enhancements for better formatting