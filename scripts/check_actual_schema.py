#!/usr/bin/env python3

"""Check actual Supabase schema"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking actual Supabase schema...\n")

# Check tournaments table
print("Testing tournaments table:")
try:
    # Try to insert a test tournament with minimal fields
    response = supabase.table('tournaments').insert({
        'name': 'TEST_TOURNAMENT_DELETE_ME',
        'season': 2024
    }).execute()

    if response.data:
        print(f"✅ Created test tournament: {response.data[0]}")
        tournament_id = response.data[0]['id']

        # Delete the test tournament
        supabase.table('tournaments').delete().eq('id', tournament_id).execute()
        print("✅ Deleted test tournament")
except Exception as e:
    print(f"❌ Error with tournaments table: {e}")

print("\nTesting player_tournaments table:")
try:
    # Check what columns exist
    response = supabase.table('player_tournaments').select('*').limit(1).execute()

    if response.data and len(response.data) > 0:
        print("Available columns:")
        for key in response.data[0].keys():
            print(f"  - {key}")
    else:
        print("No data in player_tournaments table")
except Exception as e:
    print(f"❌ Error reading player_tournaments: {e}")