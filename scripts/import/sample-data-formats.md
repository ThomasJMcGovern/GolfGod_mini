# Data Import Formats - GolfGod Mini

This document describes the expected format for your data files when importing into Railway PostgreSQL.

## File Formats Supported

- **CSV**: Comma-separated values with headers
- **JSON**: JavaScript Object Notation (array of objects)

## Players Data Format

### CSV Example (`players.csv`)
```csv
full_name,country,birthdate,birthplace,college,swing_type,height,weight,turned_pro,world_ranking,fedex_ranking,photo_url
Scottie Scheffler,USA,1996-06-21,"Dallas, Texas",University of Texas,Right,6'3",200 lbs,2018,1,1,/images/players/scottie-scheffler.jpg
Rory McIlroy,Northern Ireland,1989-05-04,"Holywood, Northern Ireland",,Right,5'9",161 lbs,2007,2,5,/images/players/rory-mcilroy.jpg
```

### JSON Example (`players.json`)
```json
[
  {
    "full_name": "Scottie Scheffler",
    "country": "USA",
    "birthdate": "1996-06-21",
    "birthplace": "Dallas, Texas",
    "college": "University of Texas",
    "swing_type": "Right",
    "height": "6'3\"",
    "weight": "200 lbs",
    "turned_pro": 2018,
    "world_ranking": 1,
    "fedex_ranking": 1,
    "photo_url": "/images/players/scottie-scheffler.jpg"
  }
]
```

## Tournaments Data Format

### CSV Example (`tournaments.csv`)
```csv
name,start_date,end_date,course_name,course_name_display,course_location,purse,tour_type,year,status
The Sentry,2025-01-04,2025-01-07,Kapalua Resort (Plantation Course),Kapalua Resort (Plantation Course),"Kapalua, HI",20000000,PGA_TOUR,2025,completed
Sony Open in Hawaii,2025-01-11,2025-01-14,Waialae Country Club,Waialae Country Club,"Honolulu, HI",8300000,PGA_TOUR,2025,completed
```

**Note**: Purse should be in cents (multiply dollars by 100) to avoid floating point issues.

## Tournament Results Data Format

### CSV Example (`tournament_results.csv`)
```csv
tournament_id,player_id,position,total_score,score_to_par,earnings,rounds,rounds_detail,year
1,1,T5,267,-25,69050000,"[66, 64, 71, 66]","{""r1"": 66, ""r2"": 64, ""r3"": 71, ""r4"": 66}",2025
3,1,T17,267,-21,13230000,"[67, 66, 69, 65]","{""r1"": 67, ""r2"": 66, ""r3"": 69, ""r4"": 65}",2025
```

**Notes**:
- `tournament_id` and `player_id` must reference existing records
- `earnings` should be in cents
- `rounds` is a JSON array of scores
- `rounds_detail` is a JSON object with round-by-round details

## Player Stats Data Format

### CSV Example (`player_stats.csv`)
```csv
player_id,season,events_played,wins,top_10s,top_25s,cuts_made,cuts_missed,total_earnings,scoring_avg,driving_distance,driving_accuracy,gir_percentage,putts_per_round,scrambling,fedex_cup_points
1,2025,15,8,12,14,15,0,2500000000,68.2,310.5,65.2,72.8,28.1,85.4,3500
1,2024,20,6,15,18,19,1,2800000000,68.8,308.2,64.8,71.5,28.3,83.2,4200
```

**Notes**:
- `total_earnings` should be in cents
- Percentages should be in decimal format (65.2 for 65.2%)
- `player_id` must reference existing player records

## Import Commands

After preparing your data files, use these commands to import:

```bash
# Import players (dry run first to test)
bun scripts/import/data-importer.ts --type players --file data/players.csv --dry-run

# Import players (actual import)
bun scripts/import/data-importer.ts --type players --file data/players.csv

# Import tournaments
bun scripts/import/data-importer.ts --type tournaments --file data/tournaments.csv

# Import tournament results
bun scripts/import/data-importer.ts --type results --file data/tournament_results.csv

# Import player statistics
bun scripts/import/data-importer.ts --type stats --file data/player_stats.csv

# Import with custom batch size
bun scripts/import/data-importer.ts --type players --file data/players.csv --batch 50
```

## Data Validation

The import script will:
- Validate all data against TypeScript schemas
- Transform string numbers to appropriate types
- Handle null/empty values appropriately
- Provide detailed error messages for invalid data
- Support upsert operations (update existing, insert new)

## Tips for Data Preparation

1. **Required Fields**:
   - Players: `full_name`
   - Tournaments: `name`, `year`
   - Results: `tournament_id`, `player_id`
   - Stats: `player_id`, `season`

2. **Data Types**:
   - Dates: Use ISO format (YYYY-MM-DD)
   - Money: Always use cents (multiply dollars by 100)
   - JSON fields: Use proper JSON syntax in CSV (escape quotes)

3. **IDs and References**:
   - Import players first, then tournaments, then results
   - Use the database IDs for foreign key references
   - Check the database after each import to get correct IDs

4. **Testing**:
   - Always run with `--dry-run` first
   - Start with small test files
   - Verify data integrity after each import