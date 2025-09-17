import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ESPNPlayerHeader from './ESPNPlayerHeader';
import ESPNTournamentResults from './ESPNTournamentResults';
import { Card } from './ui/card';
import {
  usePlayerProfile,
  usePlayerTournamentResultsByTour,
  usePlayerTournamentYears
} from '../hooks/useGolfData';

export default function ESPNPlayerResults() {
  const { playerId } = useParams<{ playerId: string }>();
  const [currentTab, setCurrentTab] = useState('results');
  const [selectedYear, setSelectedYear] = useState(2025);

  const playerIdNum = playerId ? parseInt(playerId) : null;

  // Fetch player data
  const {
    data: player,
    isLoading: playerLoading,
    error: playerError
  } = usePlayerProfile(playerIdNum);

  const {
    data: availableYears = [],
    isLoading: yearsLoading
  } = usePlayerTournamentYears(playerIdNum);

  const {
    data: tournamentGroups = [],
    isLoading: resultsLoading,
    error: resultsError
  } = usePlayerTournamentResultsByTour(playerIdNum, selectedYear);

  // Set initial year when data loads
  React.useEffect(() => {
    if (availableYears.length > 0 && selectedYear !== availableYears[0]) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears]);

  // Loading states
  if (playerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="flex gap-6">
                <div className="w-40 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-grow space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Content skeleton */}
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error states
  if (playerError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Player Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the player you're looking for.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </Card>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Player Data</h2>
          <p className="text-gray-600">
            Player data is not available at this time.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Player Header */}
        <ESPNPlayerHeader
          player={player}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* Main Content */}
        <div className="px-6 py-8">
          {currentTab === 'results' && (
            <ESPNTournamentResults
              tournamentGroups={tournamentGroups}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              isLoading={resultsLoading || yearsLoading}
            />
          )}

          {currentTab === 'overview' && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
              <p className="text-gray-600">
                Player overview content will be implemented here.
              </p>
            </Card>
          )}

          {currentTab === 'bio' && (
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="space-y-1 text-sm">
                      {player.birthdate && (
                        <p><span className="font-medium">Born:</span> {new Date(player.birthdate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      )}
                      {player.birthplace && <p><span className="font-medium">Birthplace:</span> {player.birthplace}</p>}
                      {player.height && <p><span className="font-medium">Height:</span> {player.height}</p>}
                      {player.weight && <p><span className="font-medium">Weight:</span> {player.weight}</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Golf Information</h4>
                    <div className="space-y-1 text-sm">
                      {player.turned_pro && <p><span className="font-medium">Turned Professional:</span> {player.turned_pro}</p>}
                      {player.college && <p><span className="font-medium">College:</span> {player.college}</p>}
                      {player.swing_type && <p><span className="font-medium">Plays:</span> {player.swing_type}-handed</p>}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {(currentTab === 'news' || currentTab === 'scorecards') && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentTab === 'news' ? 'News' : 'Scorecards'}
              </h3>
              <p className="text-gray-600">
                {currentTab === 'news'
                  ? 'Latest news and updates will be displayed here.'
                  : 'Detailed scorecards will be available here.'
                }
              </p>
            </Card>
          )}

          {/* Error handling for results */}
          {currentTab === 'results' && resultsError && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Results</h3>
              <p className="text-gray-600 mb-4">
                There was an error loading tournament results. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}