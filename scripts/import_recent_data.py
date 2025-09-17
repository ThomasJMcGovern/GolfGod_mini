#!/usr/bin/env python3

"""Import recent tournament data for top 3 players, last 3 years"""

import sys
sys.path.append('scripts')

from espn_scraper import fetch_espn_data, upsert_player, save_to_database, save_to_json
import time

# Top 3 players
PLAYERS = [
    {'id': 9478, 'name': 'Scottie Scheffler'},
    {'id': 8793, 'name': 'Rory McIlroy'},
    {'id': 5467, 'name': 'Jordan Spieth'}
]

# Last 3 years
YEARS = [2022, 2023, 2024]

print("🏌️ ESPN Golf Data Import - Recent Years")
print("=" * 50)
print(f"Players: {', '.join([p['name'] for p in PLAYERS])}")
print(f"Years: {', '.join(map(str, YEARS))}")
print("=" * 50)

total_saved = 0

for player in PLAYERS:
    print(f"\n📊 Processing {player['name']} (ESPN ID: {player['id']})")
    print("-" * 40)

    # Upsert player
    player_db_id = upsert_player(player['id'], player['name'])
    if not player_db_id:
        print(f"Failed to upsert player, skipping...")
        continue

    all_results = {}

    for year in YEARS:
        print(f"\n  📅 Year {year}:")

        # Rate limiting
        time.sleep(2)

        # Fetch data
        results = fetch_espn_data(player['id'], year)

        if not results:
            print(f"    No tournaments found")
            continue

        print(f"    Found {len(results)} tournaments")
        all_results[year] = results

        # Save to database
        saved = save_to_database(player_db_id, year, results)
        total_saved += saved
        print(f"    ✅ Saved {saved} new tournaments to database")

    # Save backup to JSON
    if all_results:
        save_to_json(player['name'], player['id'], all_results)

print("\n" + "=" * 50)
print(f"✅ Import completed! Total new tournaments saved: {total_saved}")
print("\nYou can now view the data in your GolfGod Mini app!")