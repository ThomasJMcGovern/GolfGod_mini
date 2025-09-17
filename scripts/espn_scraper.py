#!/usr/bin/env python3

"""
ESPN Golf Data Scraper
Fetches tournament results for players from 2015-2024
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# ESPN players to scrape
ESPN_PLAYERS = [
    {'id': 9478, 'name': 'Scottie Scheffler'},
    {'id': 8793, 'name': 'Rory McIlroy'},
    {'id': 5467, 'name': 'Jordan Spieth'},
    {'id': 6798, 'name': 'Justin Thomas'},
    {'id': 3448, 'name': 'Tiger Woods'},
    {'id': 1810, 'name': 'Phil Mickelson'},
    {'id': 9780, 'name': 'Collin Morikawa'},
    {'id': 11046, 'name': 'Viktor Hovland'},
    {'id': 10404, 'name': 'Xander Schauffele'},
    {'id': 9794, 'name': 'Bryson DeChambeau'}
]


def fetch_espn_data(player_id: int, year: int) -> List[Dict]:
    """Fetch tournament results from ESPN for a specific player and year"""

    # ESPN URL format for specific seasons
    url = f"https://www.espn.com/golf/player/results/_/id/{player_id}/season/{year}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the results table
        tables = soup.find_all('table', class_='Table')
        if not tables:
            print(f"  No results table found for year {year}")
            return []

        results = []

        for table in tables:
            rows = table.find_all('tr')

            for row in rows:
                cells = row.find_all('td')

                # Skip rows without enough cells or header rows
                if len(cells) < 5:
                    continue

                # Extract data from cells
                date = cells[0].get_text(strip=True)
                if not date or date == 'DATE':
                    continue

                # Tournament name and course are often combined
                tournament_text = cells[1].get_text(separator="|", strip=True)
                tournament_parts = tournament_text.split("|")
                tournament = tournament_parts[0] if tournament_parts else tournament_text
                course = tournament_parts[1] if len(tournament_parts) > 1 else ''

                position = cells[2].get_text(strip=True) if len(cells) > 2 else ''

                # ESPN layout varies - score might be in different columns
                # Check for the pattern of scores (usually 3-digit numbers or E/+/- patterns)
                score = ''
                earnings = ''
                rounds = []

                for i in range(3, len(cells)):
                    cell_text = cells[i].get_text(strip=True)

                    # Check if it's a total score (e.g., "273 (-15)")
                    if '(' in cell_text and ')' in cell_text and not score:
                        score = cell_text
                    # Check if it's earnings (starts with $ or is a large number)
                    elif ('$' in cell_text or (cell_text.replace(',', '').isdigit() and len(cell_text) > 3)) and not earnings:
                        earnings = cell_text
                    # Check if it's a round score (2-3 digit number)
                    elif cell_text.isdigit() and 50 <= int(cell_text) <= 90:
                        rounds.append(int(cell_text))

                results.append({
                    'date': date,
                    'tournament': tournament,
                    'course': course,
                    'position': position,
                    'score': score,
                    'earnings': earnings,
                    'rounds': rounds
                })

        return results

    except requests.RequestException as e:
        print(f"  Error fetching data for year {year}: {e}")
        return []
    except Exception as e:
        print(f"  Unexpected error for year {year}: {e}")
        return []


def parse_position(position: str) -> tuple:
    """Parse position string to get numeric value and tied flag"""
    if not position or position in ['CUT', 'MC', 'WD', 'DQ']:
        return None, False

    is_tied = position.startswith('T')
    position_clean = position.replace('T', '')

    try:
        numeric = int(position_clean)
        return numeric, is_tied
    except ValueError:
        return None, False


def parse_score(score: str) -> tuple:
    """Parse score string to extract total and to-par"""
    if not score or score == '--':
        return None, None

    # Match patterns like "273 (-15)" or "283 (E)"
    import re
    match = re.match(r'(\d+)\s*\(([+-]?\d+|E)\)', score)
    if match:
        total = int(match.group(1))
        to_par_str = match.group(2)
        to_par = 0 if to_par_str == 'E' else int(to_par_str)
        return total, to_par

    return None, None


def parse_earnings(earnings: str) -> Optional[int]:
    """Parse earnings string to numeric value (as integer)"""
    if not earnings or earnings == '--':
        return None

    # Remove currency symbols and commas
    cleaned = earnings.replace('$', '').replace(',', '').strip()

    try:
        # Convert to int (round if necessary)
        return int(float(cleaned))
    except ValueError:
        return None


def upsert_player(espn_id: int, name: str) -> Optional[int]:
    """Insert or update player in database"""
    if not supabase:
        return None

    try:
        # Check if player exists
        response = supabase.table('players').select('id').eq('espn_id', espn_id).execute()

        if response.data and len(response.data) > 0:
            player_id = response.data[0]['id']
            print(f"  Player {name} already exists with ID {player_id}")
            return player_id

        # Insert new player (without country field since it doesn't exist)
        response = supabase.table('players').insert({
            'name': name,
            'espn_id': espn_id
        }).execute()

        if response.data and len(response.data) > 0:
            player_id = response.data[0]['id']
            print(f"  Created player {name} with ID {player_id}")
            return player_id

    except Exception as e:
        print(f"  Error upserting player {name}: {e}")

    return None


def get_or_create_tournament(tournament_name: str, year: int) -> Optional[int]:
    """Get existing tournament or create a new one"""
    if not supabase:
        return None

    try:
        # Check if tournament exists
        response = supabase.table('tournaments').select('id').eq('name', tournament_name).eq('season', year).execute()

        if response.data and len(response.data) > 0:
            return response.data[0]['id']

        # Create new tournament
        response = supabase.table('tournaments').insert({
            'name': tournament_name,
            'season': year
        }).execute()

        if response.data and len(response.data) > 0:
            return response.data[0]['id']
    except Exception as e:
        print(f"      Error creating tournament {tournament_name}: {e}")

    return None


def save_to_database(player_id: int, year: int, results: List[Dict]) -> int:
    """Save tournament results to database"""
    if not supabase:
        return 0

    saved_count = 0

    for result in results:
        try:
            position_numeric, is_tied = parse_position(result['position'])
            total_score, score_to_par = parse_score(result['score'])
            earnings_usd = parse_earnings(result['earnings'])

            # Determine status
            status = 'completed'
            if result['position'] in ['CUT', 'MC']:
                status = 'cut'
            elif result['position'] == 'WD':
                status = 'withdrawn'
            elif result['position'] == 'DQ':
                status = 'disqualified'

            # Get or create tournament
            clean_tournament_name = result['tournament']
            tournament_id = get_or_create_tournament(clean_tournament_name, year)
            if not tournament_id:
                tournament_id = 0  # Fallback if we can't create tournament

            # Check if result already exists
            existing = supabase.table('player_tournaments').select('id').eq('player_id', player_id).eq('tournament_name', clean_tournament_name).eq('season', year).execute()

            if existing.data and len(existing.data) > 0:
                print(f"    ⚠️  {clean_tournament_name} - already exists")
                continue

            # Insert tournament result
            response = supabase.table('player_tournaments').insert({
                'player_id': player_id,
                'tournament_id': tournament_id,
                'season': year,
                'tournament_name': clean_tournament_name,
                'date_range': result['date'],
                'position': result['position'],
                'position_numeric': position_numeric,
                'is_tied': is_tied,
                'overall_score': result['score'],
                'total_score': total_score,
                'score_to_par': score_to_par,
                'earnings_usd': earnings_usd,
                'earnings_display': f"${earnings_usd:,}" if earnings_usd else '--',
                'status': status
            }).execute()

            if response.data and len(response.data) > 0:
                tournament_result_id = response.data[0]['id']

                # Insert round scores
                if result['rounds']:
                    rounds_data = []
                    for i, score in enumerate(result['rounds']):
                        rounds_data.append({
                            'player_tournament_id': tournament_result_id,
                            'round_number': i + 1,
                            'score': score
                        })

                    supabase.table('tournament_rounds').insert(rounds_data).execute()

                print(f"    ✅ {result['tournament']} - {result['position']}")
                saved_count += 1

        except Exception as e:
            print(f"    ❌ {result['tournament']} - Error: {e}")

    return saved_count


def save_to_json(player_name: str, player_id: int, all_results: Dict[int, List[Dict]]):
    """Save results to JSON file as backup"""

    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)

    filename = f"data/{player_name.replace(' ', '_').lower()}_{player_id}.json"

    # Format data for JSON
    formatted_data = []
    for year, results in all_results.items():
        if results:
            formatted_data.append({
                'year': year,
                'tournament_count': len(results),
                'tournaments': results
            })

    with open(filename, 'w') as f:
        json.dump({
            'player_name': player_name,
            'espn_id': player_id,
            'scraped_at': datetime.now().isoformat(),
            'years': formatted_data
        }, f, indent=2)

    print(f"  💾 Saved backup to {filename}")


def main():
    """Main scraping function"""
    print("🏌️ ESPN Golf Data Scraper")
    print("=" * 50)

    # Years to scrape (2015-2024)
    current_year = datetime.now().year
    years = list(range(2015, min(current_year + 1, 2025)))

    print(f"\n📅 Scraping years: {years[0]}-{years[-1]}")
    print(f"👥 Players to scrape: {len(ESPN_PLAYERS)}")

    for player in ESPN_PLAYERS:
        print(f"\n{'='*50}")
        print(f"📊 Processing {player['name']} (ESPN ID: {player['id']})")
        print(f"{'='*50}")

        # Upsert player in database
        player_db_id = upsert_player(player['id'], player['name']) if supabase else None

        all_results = {}
        total_tournaments = 0

        for year in years:
            print(f"\n  📅 Year {year}:")

            # Respect rate limiting
            time.sleep(1)

            # Fetch data
            results = fetch_espn_data(player['id'], year)

            if not results:
                print(f"    No tournaments found")
                continue

            print(f"    Found {len(results)} tournaments")
            all_results[year] = results
            total_tournaments += len(results)

            # Save to database if available
            if supabase and player_db_id:
                saved = save_to_database(player_db_id, year, results)
                print(f"    Saved {saved} tournaments to database")

        # Save to JSON as backup
        if all_results:
            save_to_json(player['name'], player['id'], all_results)
            print(f"\n  📊 Total: {total_tournaments} tournaments across {len(all_results)} years")

    print("\n" + "="*50)
    print("✅ Scraping completed!")

    if not supabase:
        print("\n⚠️  Note: Database connection not available.")
        print("   Data saved to JSON files in the 'data' directory.")
        print("   Configure .env.local with Supabase credentials to enable database storage.")


if __name__ == "__main__":
    main()