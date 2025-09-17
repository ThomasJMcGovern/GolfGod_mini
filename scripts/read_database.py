#!/usr/bin/env python3

"""Read and display all data from Supabase database"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("📊 Reading Supabase Database Contents")
print("=" * 60)

# 1. Read Players
print("\n🏌️ PLAYERS TABLE:")
print("-" * 40)
players = supabase.table('players').select('*').order('id').execute()
print(f"Total players: {len(players.data)}")
for player in players.data:
    print(f"  ID: {player['id']}, Name: {player['name']}, ESPN ID: {player.get('espn_id', 'N/A')}")

# 2. Read Tournaments
print("\n🏆 TOURNAMENTS TABLE:")
print("-" * 40)
tournaments = supabase.table('tournaments').select('*').order('season', desc=True).order('name').execute()
print(f"Total tournaments: {len(tournaments.data)}")

# Group by season
seasons = {}
for tournament in tournaments.data:
    season = tournament['season']
    if season not in seasons:
        seasons[season] = []
    seasons[season].append(tournament['name'])

for season in sorted(seasons.keys(), reverse=True):
    print(f"\n  Year {season}: {len(seasons[season])} tournaments")
    for i, name in enumerate(seasons[season][:5]):  # Show first 5
        print(f"    - {name}")
    if len(seasons[season]) > 5:
        print(f"    ... and {len(seasons[season]) - 5} more")

# 3. Read Player Tournament Results
print("\n📈 PLAYER TOURNAMENT RESULTS:")
print("-" * 40)
player_tournaments = supabase.table('player_tournaments').select('*').execute()
print(f"Total player-tournament entries: {len(player_tournaments.data)}")

# Group by player and season
player_stats = {}
for result in player_tournaments.data:
    player_id = result['player_id']
    season = result['season']

    if player_id not in player_stats:
        player_stats[player_id] = {}
    if season not in player_stats[player_id]:
        player_stats[player_id][season] = {
            'count': 0,
            'earnings': 0,
            'wins': 0,
            'top10s': 0
        }

    player_stats[player_id][season]['count'] += 1

    # Sum earnings
    if result.get('earnings_usd'):
        player_stats[player_id][season]['earnings'] += result['earnings_usd']

    # Count wins and top 10s
    if result.get('position') == '1':
        player_stats[player_id][season]['wins'] += 1
    if result.get('position_numeric') and result['position_numeric'] <= 10:
        player_stats[player_id][season]['top10s'] += 1

# Display player stats
for player_id, seasons in player_stats.items():
    # Get player name
    player_name = next((p['name'] for p in players.data if p['id'] == player_id), f"Player {player_id}")
    print(f"\n  {player_name}:")

    for season in sorted(seasons.keys(), reverse=True):
        stats = seasons[season]
        print(f"    {season}: {stats['count']} tournaments, {stats['wins']} wins, {stats['top10s']} top-10s, ${stats['earnings']:,} earnings")

# 4. Read Tournament Rounds
print("\n⛳ TOURNAMENT ROUNDS:")
print("-" * 40)
rounds = supabase.table('tournament_rounds').select('*').execute()
print(f"Total round scores recorded: {len(rounds.data)}")

# Count rounds by round number
round_counts = {}
for round_data in rounds.data:
    round_num = round_data['round_number']
    round_counts[round_num] = round_counts.get(round_num, 0) + 1

for round_num in sorted(round_counts.keys()):
    print(f"  Round {round_num}: {round_counts[round_num]} scores")

print("\n" + "=" * 60)
print("📝 Database Summary:")
print(f"  - {len(players.data)} players")
print(f"  - {len(tournaments.data)} tournaments")
print(f"  - {len(player_tournaments.data)} player-tournament results")
print(f"  - {len(rounds.data)} individual round scores")
print("=" * 60)