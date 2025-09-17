#!/usr/bin/env python3

"""Clear all data from Supabase database (with confirmation)"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("⚠️  DATABASE CLEARING UTILITY")
print("=" * 60)

# First show what will be deleted
print("\n📊 Current Database Contents:")
print("-" * 40)

# Count records in each table
tables = {
    'tournament_rounds': None,
    'player_tournaments': None,
    'tournaments': None,
    'players': None
}

for table in tables.keys():
    try:
        result = supabase.table(table).select('id', count='exact').execute()
        count = len(result.data)
        tables[table] = count
        print(f"  {table}: {count} records")
    except Exception as e:
        print(f"  {table}: Error reading - {e}")

print("\n⚠️  WARNING: This will delete:")
print("  - All tournament round scores")
print("  - All player tournament results")
print("  - All tournaments")
print("  - All players")
print("\nThis action cannot be undone!")

# Ask for confirmation
response = input("\nAre you sure you want to clear all data? Type 'YES DELETE ALL' to confirm: ")

if response != "YES DELETE ALL":
    print("\n❌ Operation cancelled. No data was deleted.")
    sys.exit(0)

print("\n🗑️  Clearing database...")
print("-" * 40)

# Clear tables in order (respecting foreign key constraints)
# 1. Clear tournament_rounds first (references player_tournaments)
try:
    print("Deleting tournament_rounds...", end=" ")
    supabase.table('tournament_rounds').delete().neq('id', -1).execute()  # neq trick to delete all
    print("✅")
except Exception as e:
    print(f"❌ Error: {e}")

# 2. Clear player_tournaments (references players and tournaments)
try:
    print("Deleting player_tournaments...", end=" ")
    supabase.table('player_tournaments').delete().neq('id', -1).execute()
    print("✅")
except Exception as e:
    print(f"❌ Error: {e}")

# 3. Clear tournaments
try:
    print("Deleting tournaments...", end=" ")
    supabase.table('tournaments').delete().neq('id', -1).execute()
    print("✅")
except Exception as e:
    print(f"❌ Error: {e}")

# 4. Clear players
try:
    print("Deleting players...", end=" ")
    supabase.table('players').delete().neq('id', -1).execute()
    print("✅")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)

# Verify deletion
print("\n📊 Final Database State:")
print("-" * 40)

for table in tables.keys():
    try:
        result = supabase.table(table).select('id', count='exact').execute()
        count = len(result.data)
        status = "✅ CLEARED" if count == 0 else f"⚠️  {count} records remain"
        print(f"  {table}: {status}")
    except Exception as e:
        print(f"  {table}: Error reading - {e}")

print("\n✅ Database clearing complete!")