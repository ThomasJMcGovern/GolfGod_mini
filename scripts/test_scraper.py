#!/usr/bin/env python3

"""Test ESPN scraper with limited data"""

import sys
sys.path.append('scripts')

from espn_scraper import fetch_espn_data, upsert_player, save_to_database

# Test with Scottie Scheffler for 2024 only
test_player = {'id': 9478, 'name': 'Scottie Scheffler'}
test_year = 2024

print(f"Testing with {test_player['name']} for year {test_year}")

# Fetch data
results = fetch_espn_data(test_player['id'], test_year)
print(f"Found {len(results)} tournaments")

if results:
    # Show first 3 results
    for i, result in enumerate(results[:3]):
        print(f"\n{i+1}. {result['tournament']}")
        print(f"   Date: {result['date']}")
        print(f"   Position: {result['position']}")
        print(f"   Score: {result['score']}")
        print(f"   Earnings: {result['earnings']}")
        print(f"   Rounds: {result['rounds']}")

    # Try to save to database
    player_id = upsert_player(test_player['id'], test_player['name'])
    if player_id:
        saved = save_to_database(player_id, test_year, results[:3])
        print(f"\nSaved {saved} tournaments to database")