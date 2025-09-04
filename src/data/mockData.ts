// Mock data for demonstration purposes

export const mockPlayerProfiles = {
  "Rory McIlroy": {
    birthdate: "May 4, 1989",
    birthplace: "Holywood, Northern Ireland",
    height: "5'9\"",
    weight: "161 lbs",
    turnedPro: 2007,
    college: "None",
    worldRanking: 3,
    fedexRank: 5,
    careerWins: 24,
    majorWins: 4
  },
  "Scottie Scheffler": {
    birthdate: "June 21, 1996", 
    birthplace: "Ridgewood, NJ",
    height: "6'3\"",
    weight: "200 lbs",
    turnedPro: 2018,
    college: "University of Texas",
    worldRanking: 1,
    fedexRank: 1,
    careerWins: 13,
    majorWins: 2
  },
  "Jon Rahm": {
    birthdate: "November 10, 1994",
    birthplace: "Barrika, Spain", 
    height: "6'2\"",
    weight: "220 lbs",
    turnedPro: 2016,
    college: "Arizona State",
    worldRanking: 4,
    fedexRank: 12,
    careerWins: 11,
    majorWins: 2
  },
  "Collin Morikawa": {
    birthdate: "February 6, 1997",
    birthplace: "Los Angeles, CA",
    height: "5'9\"",
    weight: "160 lbs",
    turnedPro: 2019,
    college: "UC Berkeley",
    worldRanking: 7,
    fedexRank: 8,
    careerWins: 6,
    majorWins: 2
  },
  "Phil Mickelson": {
    birthdate: "June 16, 1970",
    birthplace: "San Diego, CA",
    height: "6'3\"",
    weight: "200 lbs", 
    turnedPro: 1992,
    college: "Arizona State",
    worldRanking: 168,
    fedexRank: 95,
    careerWins: 45,
    majorWins: 6
  }
};

export const mock2024Stats = {
  scoring: [
    { label: "Scoring Average", value: "69.58", description: "Rank: 3rd" },
    { label: "Rounds Under 70", value: "42", description: "58% of rounds" },
    { label: "Low Round", value: "62", description: "AT&T Pebble Beach" },
    { label: "Rounds in 60s", value: "28", description: "39% of rounds" }
  ],
  driving: [
    { label: "Driving Distance", value: "312.4", description: "Rank: 15th" },
    { label: "Driving Accuracy", value: "62.5%", description: "Rank: 78th" },
    { label: "Left Rough Tendency", value: "19.2%", description: "Miss tendency" },
    { label: "Right Rough Tendency", value: "18.3%", description: "Miss tendency" }
  ],
  approach: [
    { label: "Greens in Regulation", value: "68.9%", description: "Rank: 12th" },
    { label: "Proximity to Hole", value: "35'2\"", description: "Rank: 8th" },
    { label: "Approach from 150-175", value: "23'6\"", description: "Rank: 5th" },
    { label: "Approach from 200+", value: "42'3\"", description: "Rank: 18th" }
  ],
  shortGame: [
    { label: "Scrambling", value: "62.1%", description: "Rank: 24th" },
    { label: "Sand Save %", value: "55.8%", description: "Rank: 45th" },
    { label: "Proximity from Sand", value: "8'2\"", description: "Rank: 31st" },
    { label: "Up & Down %", value: "58.9%", description: "Rank: 38th" }
  ],
  putting: [
    { label: "Putts per Round", value: "28.4", description: "Rank: 15th" },
    { label: "One-Putt %", value: "41.2%", description: "Rank: 8th" },
    { label: "Putts per GIR", value: "1.72", description: "Rank: 22nd" },
    { label: "3-Putt Avoidance", value: "2.8%", description: "Rank: 12th" }
  ],
  strokesGained: [
    { label: "SG: Total", value: "+1.823", description: "Rank: 4th" },
    { label: "SG: Off-the-Tee", value: "+0.542", description: "Rank: 18th" },
    { label: "SG: Approach", value: "+0.698", description: "Rank: 6th" },
    { label: "SG: Around-Green", value: "+0.234", description: "Rank: 28th" },
    { label: "SG: Putting", value: "+0.349", description: "Rank: 14th" }
  ]
};

export const mockTournamentOverview = {
  recentPerformance: [
    { tournament: "The Masters", year: 2024, finish: "T7", score: "-5", earnings: "$435,000" },
    { tournament: "PGA Championship", year: 2024, finish: "T12", score: "-3", earnings: "$285,000" },
    { tournament: "U.S. Open", year: 2024, finish: "T5", score: "-2", earnings: "$580,000" },
    { tournament: "The Open Championship", year: 2024, finish: "2", score: "-15", earnings: "$1,455,000" }
  ],
  courseHistory: [
    { course: "Augusta National", rounds: 48, scoring: "71.2", best: "64", wins: 0, top10s: 8 },
    { course: "Pebble Beach", rounds: 24, scoring: "69.8", best: "65", wins: 1, top10s: 4 },
    { course: "St. Andrews", rounds: 16, scoring: "68.9", best: "63", wins: 1, top10s: 3 },
    { course: "TPC Sawgrass", rounds: 32, scoring: "70.5", best: "66", wins: 1, top10s: 5 }
  ],
  headToHead: [
    { opponent: "Scottie Scheffler", wins: 12, losses: 18, ties: 3 },
    { opponent: "Jon Rahm", wins: 15, losses: 14, ties: 2 },
    { opponent: "Viktor Hovland", wins: 18, losses: 8, ties: 1 },
    { opponent: "Patrick Cantlay", wins: 14, losses: 13, ties: 4 }
  ]
};

export const mockTournaments = {
  current: {
    name: "Genesis Invitational",
    dates: "February 13-16, 2025",
    course: "Riviera Country Club",
    location: "Pacific Palisades, CA",
    purse: "$20,000,000",
    defendingChamp: "Hideki Matsuyama",
    field: 120
  },
  completed: [
    "Sony Open in Hawaii",
    "The American Express", 
    "Farmers Insurance Open",
    "AT&T Pebble Beach Pro-Am",
    "WM Phoenix Open"
  ],
  upcoming: [
    "The Honda Classic",
    "Arnold Palmer Invitational",
    "THE PLAYERS Championship",
    "Valspar Championship",
    "The Masters Tournament"
  ]
};

export const insideTheRopesContent = [
  { 
    title: "Course Strategy: Riviera Country Club",
    category: "Course Analysis",
    preview: "Breaking down the iconic layout and key holes...",
    isPremium: true
  },
  {
    title: "Weather Impact Analysis",
    category: "Conditions",
    preview: "How wind patterns affect scoring at Genesis...",
    isPremium: false
  },
  {
    title: "Statistical Deep Dive: Approach Play",
    category: "Analytics",
    preview: "Why approach shots determine winners at Riviera...",
    isPremium: true
  },
  {
    title: "Player Form Tracker",
    category: "Trends",
    preview: "Hot players coming into the Genesis Invitational...",
    isPremium: false
  },
  {
    title: "Betting Angles & Value Plays",
    category: "Wagering",
    preview: "Statistical edges for this week's tournament...",
    isPremium: true
  }
];