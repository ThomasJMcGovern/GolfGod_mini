import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockTournaments } from "../data/mockData";

type TabType = 'current' | 'completed' | 'upcoming';

export default function TournamentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('current');

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'current', label: "This Week's Tournament" },
    { id: 'completed', label: "Completed", count: 36 },
    { id: 'upcoming', label: "Yet to be Played", count: 12 }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Tournament Central</h1>
              <p className="text-sm text-gray-600">Browse PGA Tour events and schedules</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
              2024-25 SEASON
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-2 border-b-2 font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'border-green-600 text-green-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`
                    ml-2 px-2 py-1 text-xs rounded-full
                    ${activeTab === tab.id 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Current Tournament */}
        {activeTab === 'current' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Tournament Hero Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-green-100 text-sm font-medium mb-2">THIS WEEK</div>
                    <h2 className="text-4xl font-bold mb-2">{mockTournaments.current.name}</h2>
                    <p className="text-green-100">{mockTournaments.current.dates}</p>
                  </div>
                  <div className="text-6xl">🏆</div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div>
                    <div className="text-green-200 text-sm mb-1">Course</div>
                    <div className="font-bold text-lg">{mockTournaments.current.course}</div>
                    <div className="text-green-100 text-sm">{mockTournaments.current.location}</div>
                  </div>
                  <div>
                    <div className="text-green-200 text-sm mb-1">Purse</div>
                    <div className="font-bold text-lg">{mockTournaments.current.purse}</div>
                    <div className="text-green-100 text-sm">Winner's Share: $3.6M</div>
                  </div>
                  <div>
                    <div className="text-green-200 text-sm mb-1">Defending Champion</div>
                    <div className="font-bold text-lg">{mockTournaments.current.defendingChamp}</div>
                    <div className="text-green-100 text-sm">2024 Winner</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-green-800/30 backdrop-blur p-4 flex gap-4">
                <button className="flex-1 px-4 py-2 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors">
                  View Leaderboard
                </button>
                <button className="flex-1 px-4 py-2 bg-green-900/50 text-white font-bold rounded-lg hover:bg-green-900/70 transition-colors border border-green-600">
                  Field & Odds
                </button>
                <button className="flex-1 px-4 py-2 bg-green-900/50 text-white font-bold rounded-lg hover:bg-green-900/70 transition-colors border border-green-600">
                  Course Analysis
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Field Size", value: mockTournaments.current.field, icon: "👥" },
                { label: "Cut Line", value: "Top 65 + Ties", icon: "✂️" },
                { label: "FedEx Points", value: "500", icon: "📊" },
                { label: "Par", value: "71", icon: "⛳" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tournament Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tournament Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Signature Event with Limited Field",
                  "No 36-hole cut",
                  "Hosted by Tiger Woods",
                  "Historic venue since 1926",
                  "Kikuyu grass greens",
                  "Average winning score: -13"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Tournaments */}
        {activeTab === 'completed' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">2024-25 Completed Tournaments</h3>
              <div className="space-y-3">
                {mockTournaments.completed.map((tournament, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{tournament}</span>
                        <span className="ml-3 text-sm text-gray-500">January {15 - idx * 7}, 2025</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Winner: TBD</span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button className="mt-6 w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                View All 36 Completed Tournaments
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Tournaments */}
        {activeTab === 'upcoming' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tournaments</h3>
              <div className="space-y-4">
                {mockTournaments.upcoming.map((tournament, idx) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{tournament}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {idx === 4 ? "April 10-13, 2025" : `March ${idx * 7 + 1}-${idx * 7 + 4}, 2025`}
                        </p>
                      </div>
                      <div className="text-right">
                        {idx === 4 && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            MAJOR
                          </span>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                          {30 - idx * 7} days away
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-900 font-medium">FedEx Cup Playoffs</p>
                    <p className="text-sm text-blue-700 mt-1">
                      The season culminates with the FedEx Cup Playoffs in August, featuring the top 70 players competing for the $75M prize pool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}