import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CollapsibleSection, { CollapsibleItem } from "./CollapsibleSection";
import { usePlayers } from "../hooks/useGolfData";
import { 
  mockPlayerProfiles, 
  mock2024Stats, 
  mockTournamentOverview 
} from "../data/mockData";

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const { data: players = [], isLoading } = usePlayers();

  const handlePlayerSelect = (playerName: string) => {
    setSelectedPlayer(playerName);
  };

  const playerProfile = selectedPlayer ? mockPlayerProfiles[selectedPlayer as keyof typeof mockPlayerProfiles] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/hub")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Player Analytics</h1>
              <p className="text-sm text-gray-600">Select a player to view detailed statistics</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
              PGA TOUR
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Player Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Player</h2>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handlePlayerSelect(player.full_name)}
                      className={`
                        w-full px-4 py-3 rounded-lg text-left transition-all
                        ${selectedPlayer === player.full_name 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{player.full_name}</span>
                        {player.world_ranking && (
                          <span className={`text-sm ${selectedPlayer === player.full_name ? 'text-green-100' : 'text-gray-500'}`}>
                            #{player.world_ranking}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Search */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Player Details */}
          <div className="lg:col-span-2">
            {!selectedPlayer ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">⛳</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a Player
                </h3>
                <p className="text-gray-600">
                  Choose a player from the list to view their profile, statistics, and tournament history
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Player Header */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPlayer}
                      </h2>
                      {playerProfile && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">World Rank:</span>
                            <span className="ml-2 font-bold">#{playerProfile.worldRanking}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">FedEx Rank:</span>
                            <span className="ml-2 font-bold">#{playerProfile.fedexRank}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Career Wins:</span>
                            <span className="ml-2 font-bold">{playerProfile.careerWins}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Major Wins:</span>
                            <span className="ml-2 font-bold">{playerProfile.majorWins}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-4xl">👤</div>
                  </div>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-4">
                  {/* Profile Section */}
                  <CollapsibleSection title="Profile" defaultOpen={true}>
                    {playerProfile ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <CollapsibleItem label="Birthdate" value={playerProfile.birthdate} />
                        <CollapsibleItem label="Birthplace" value={playerProfile.birthplace} />
                        <CollapsibleItem label="Height" value={playerProfile.height} />
                        <CollapsibleItem label="Weight" value={playerProfile.weight} />
                        <CollapsibleItem label="Turned Pro" value={playerProfile.turnedPro} />
                        <CollapsibleItem label="College" value={playerProfile.college || "N/A"} />
                      </div>
                    ) : (
                      <p className="text-gray-500">Profile data not available</p>
                    )}
                  </CollapsibleSection>

                  {/* 2024 Stats Section */}
                  <CollapsibleSection title="2024 Stats">
                    <div className="space-y-6">
                      {/* Scoring */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-green-600">📊</span> Scoring
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {mock2024Stats.scoring.map((stat, idx) => (
                            <CollapsibleItem 
                              key={idx}
                              label={stat.label} 
                              value={stat.value}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Driving */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-blue-600">🏌️</span> Driving
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {mock2024Stats.driving.map((stat, idx) => (
                            <CollapsibleItem 
                              key={idx}
                              label={stat.label} 
                              value={stat.value}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Strokes Gained */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-purple-600">📈</span> Strokes Gained
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {mock2024Stats.strokesGained.map((stat, idx) => (
                            <CollapsibleItem 
                              key={idx}
                              label={stat.label} 
                              value={stat.value}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Tournament Overview Section */}
                  <CollapsibleSection title="Tournament Overview">
                    <div className="space-y-6">
                      {/* Recent Performance */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Recent Major Performance</h4>
                        <div className="space-y-2">
                          {mockTournamentOverview.recentPerformance.map((event, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                              <div>
                                <span className="font-medium">{event.tournament}</span>
                                <span className="text-sm text-gray-500 ml-2">({event.year})</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-green-600">{event.finish}</span>
                                <span className="text-sm text-gray-600">{event.score}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Course History */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Course History</h4>
                        <div className="space-y-2">
                          {mockTournamentOverview.courseHistory.slice(0, 3).map((course, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium mb-1">{course.course}</div>
                              <div className="grid grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Rounds:</span>
                                  <span className="ml-1 font-bold">{course.rounds}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Avg:</span>
                                  <span className="ml-1 font-bold">{course.scoring}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Wins:</span>
                                  <span className="ml-1 font-bold">{course.wins}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">T10:</span>
                                  <span className="ml-1 font-bold">{course.top10s}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Additional Sections (Coming Soon) */}
                  <CollapsibleSection title="Advanced Metrics" badge="PREMIUM">
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🔒</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Content</h4>
                      <p className="text-gray-600 mb-4">
                        Advanced analytics and predictive models available with premium subscription
                      </p>
                      <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
                        Upgrade to Premium
                      </button>
                    </div>
                  </CollapsibleSection>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}