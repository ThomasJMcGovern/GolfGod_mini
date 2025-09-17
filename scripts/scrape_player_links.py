#!/usr/bin/env python3

"""
Scrape all player links from ESPN Golf Stats page
Saves to CSV file with player names, IDs, and URLs
"""

import requests
from bs4 import BeautifulSoup
import csv
import re
import os
from datetime import datetime

def scrape_espn_player_links():
    """Scrape all player links from ESPN golf stats page"""

    url = "https://www.espn.com/golf/stats/player"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    print(f"🔍 Fetching ESPN golf stats page: {url}")

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all player links with the specific pattern
        player_links = []

        # Look for all anchor tags with class "AnchorLink" that contain player URLs
        anchors = soup.find_all('a', class_='AnchorLink')

        for anchor in anchors:
            href = anchor.get('href', '')
            # Match ESPN player profile URLs
            if '/golf/player/_/id/' in href:
                # Extract player ID and name from URL
                match = re.search(r'/golf/player/_/id/(\d+)/(.+?)(?:\?|$)', href)
                if match:
                    player_id = match.group(1)
                    player_slug = match.group(2)
                    player_name = anchor.get_text(strip=True)

                    # Clean up the URL (remove query parameters if any)
                    clean_url = f"https://www.espn.com/golf/player/_/id/{player_id}/{player_slug}"

                    player_data = {
                        'player_name': player_name,
                        'player_id': player_id,
                        'player_url': clean_url
                    }

                    # Avoid duplicates
                    if player_data not in player_links:
                        player_links.append(player_data)

        # Also try another pattern - sometimes links are in different format
        # Look for all links that match the player profile pattern
        all_links = soup.find_all('a', href=re.compile(r'/golf/player/_/id/\d+'))

        for link in all_links:
            href = link.get('href', '')
            if href.startswith('/'):
                href = f"https://www.espn.com{href}"

            match = re.search(r'/golf/player/_/id/(\d+)/(.+?)(?:\?|$)', href)
            if match:
                player_id = match.group(1)
                player_slug = match.group(2)
                player_name = link.get_text(strip=True)

                # Skip if no player name
                if not player_name or player_name in ['', ' ', '\n']:
                    continue

                clean_url = f"https://www.espn.com/golf/player/_/id/{player_id}/{player_slug}"

                player_data = {
                    'player_name': player_name,
                    'player_id': player_id,
                    'player_url': clean_url
                }

                # Check if already exists (by player_id)
                if not any(p['player_id'] == player_id for p in player_links):
                    player_links.append(player_data)

        print(f"✅ Found {len(player_links)} unique players")

        return player_links

    except requests.RequestException as e:
        print(f"❌ Error fetching ESPN page: {e}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return []


def save_to_csv(player_links, filename='data/espn_players.csv'):
    """Save player links to CSV file"""

    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)

    if not player_links:
        print("⚠️ No player links to save")
        return

    # Sort by player name for better organization
    player_links.sort(key=lambda x: x['player_name'])

    # Write to CSV
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['player_name', 'player_id', 'player_url']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for player in player_links:
            writer.writerow(player)

    print(f"💾 Saved {len(player_links)} players to {filename}")

    # Print first 10 as sample
    print("\n📋 Sample of players found:")
    for player in player_links[:10]:
        print(f"  - {player['player_name']} (ID: {player['player_id']})")

    if len(player_links) > 10:
        print(f"  ... and {len(player_links) - 10} more")


def main():
    """Main function"""
    print("🏌️ ESPN Golf Player Links Scraper")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("-" * 50)

    # Scrape player links
    player_links = scrape_espn_player_links()

    # Save to CSV
    if player_links:
        save_to_csv(player_links)

        print("\n" + "=" * 50)
        print("✅ Scraping complete!")
        print(f"📄 Check data/espn_players.csv for the full list")
    else:
        print("\n❌ No players found. The page structure might have changed.")


if __name__ == "__main__":
    main()