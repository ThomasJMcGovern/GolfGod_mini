#!/usr/bin/env python3

"""
Import Scottie Scheffler tournament data from 2015-2025
"""

import sys
sys.path.append('scripts')

from espn_scraper import fetch_espn_data, upsert_player, save_to_database, save_to_json
import time
from datetime import datetime

# Scottie Scheffler's ESPN ID
SCHEFFLER = {'id': 9478, 'name': 'Scottie Scheffler'}

# Years to import (2015-2025)
YEARS = list(range(2015, 2026))  # 2015 through 2025

def main():
    print("🏌️ Importing Scottie Scheffler Data (2015-2025)")
    print("=" * 60)
    print(f"Player: {SCHEFFLER['name']} (ESPN ID: {SCHEFFLER['id']})")
    print(f"Years: {YEARS[0]}-{YEARS[-1]}")
    print("=" * 60)

    # First, upsert the player in database
    player_db_id = upsert_player(SCHEFFLER['id'], SCHEFFLER['name'])
    if not player_db_id:
        print("❌ Failed to create/find player in database")
        return

    print(f"✅ Player ID in database: {player_db_id}\n")

    all_results = {}
    total_tournaments = 0
    total_saved = 0

    for year in YEARS:
        print(f"\n📅 Fetching Year {year}:")
        print("-" * 40)

        # Add delay to be respectful to ESPN's servers
        time.sleep(2)

        # Fetch data from ESPN
        results = fetch_espn_data(SCHEFFLER['id'], year)

        if not results:
            print(f"  No tournaments found for {year}")
            continue

        print(f"  ✅ Found {len(results)} tournaments")
        all_results[year] = results
        total_tournaments += len(results)

        # Save to database
        saved = save_to_database(player_db_id, year, results)
        total_saved += saved

        if saved > 0:
            print(f"  💾 Saved {saved} new tournaments to database")
        else:
            print(f"  ⚠️  All tournaments already exist in database")

        # Show sample of tournaments
        if results and len(results) > 0:
            print(f"  📊 Sample tournaments:")
            for result in results[:3]:
                position = result.get('position', 'N/A')
                tournament = result.get('tournament', 'Unknown')
                earnings = result.get('earnings', '')
                print(f"     - {tournament}: {position} {earnings}")

    # Save backup to JSON
    if all_results:
        save_to_json(SCHEFFLER['name'], SCHEFFLER['id'], all_results)

    # Print summary
    print("\n" + "=" * 60)
    print("📊 IMPORT SUMMARY")
    print("=" * 60)
    print(f"Player: {SCHEFFLER['name']}")
    print(f"Years processed: {len([y for y in YEARS if y in all_results])}")
    print(f"Total tournaments found: {total_tournaments}")
    print(f"New tournaments saved to database: {total_saved}")

    # Show years with data
    if all_results:
        print(f"\n📅 Years with data:")
        for year in sorted(all_results.keys()):
            count = len(all_results[year])
            print(f"  {year}: {count} tournaments")

    print("\n✅ Import complete!")
    print("🎯 Data is now available in your GolfGod Mini app")


if __name__ == "__main__":
    main()