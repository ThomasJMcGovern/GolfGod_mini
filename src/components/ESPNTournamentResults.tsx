import { useState } from 'react';
import { Card } from './ui/card';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { type TournamentResultsByTour } from '../types';

interface ESPNTournamentResultsProps {
  tournamentGroups: TournamentResultsByTour[];
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  isLoading?: boolean;
}

export default function ESPNTournamentResults({
  tournamentGroups,
  availableYears,
  selectedYear,
  onYearChange,
  isLoading = false
}: ESPNTournamentResultsProps) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const formatEarnings = (earnings: number | null | undefined): string => {
    if (!earnings) return '--';
    return `$${earnings.toLocaleString()}`;
  };

  const getPositionColor = (position: string | null | undefined): string => {
    if (!position) return 'text-gray-500';

    if (position === '1') return 'text-green-600 font-bold';
    if (position.startsWith('T') && parseInt(position.slice(1)) <= 10) return 'text-blue-600 font-semibold';
    if (position === 'CUT') return 'text-red-500';
    if (position === 'WD' || position === 'DQ') return 'text-orange-500';

    const pos = parseInt(position.replace('T', ''));
    if (pos <= 10) return 'text-blue-600 font-semibold';
    if (pos <= 25) return 'text-gray-700';

    return 'text-gray-500';
  };

  const formatRounds = (rounds: any): string => {
    if (!rounds) return '--';

    try {
      // Handle both array format [67,70,69,67] and object format {"r1":67,"r2":70,"r3":69,"r4":67}
      let roundsArray: number[] = [];

      if (Array.isArray(rounds)) {
        roundsArray = rounds;
      } else if (typeof rounds === 'object') {
        roundsArray = [rounds.r1, rounds.r2, rounds.r3, rounds.r4].filter(Boolean);
      } else if (typeof rounds === 'string') {
        // Parse string format like "[67,70,69,67]"
        const parsed = JSON.parse(rounds);
        if (Array.isArray(parsed)) {
          roundsArray = parsed;
        }
      }

      return roundsArray.join('-');
    } catch {
      return rounds.toString();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tournament Results</h2>
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Tournament Results</h2>

        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="font-medium">{selectedYear}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isYearDropdownOpen && (
            <div className="absolute right-0 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(year);
                    setIsYearDropdownOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tournament Groups */}
      {tournamentGroups.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No tournament results found for {selectedYear}.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {tournamentGroups.map((group) => (
            <div key={`${group.tourType}_${selectedYear}`} className="space-y-4">
              {/* Tour Section Header */}
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {group.displayName}
              </h3>

              {/* Results Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <div className="col-span-2">DATE</div>
                    <div className="col-span-4">TOURNAMENT</div>
                    <div className="col-span-1">POS</div>
                    <div className="col-span-3">OVERALL SCORE</div>
                    <div className="col-span-2 text-right">EARNINGS</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {group.results.map((result) => (
                    <div
                      key={`${result.tournament_name}_${result.start_date}`}
                      className="px-4 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Date */}
                        <div className="col-span-2 text-sm text-gray-600">
                          {result.date_range}
                        </div>

                        {/* Tournament */}
                        <div className="col-span-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                              {result.tournament_name}
                            </div>
                            <div className="text-xs text-gray-500 italic">
                              {result.course_name}
                            </div>
                          </div>
                        </div>

                        {/* Position */}
                        <div className="col-span-1">
                          <span className={`text-sm ${getPositionColor(result.position)}`}>
                            {result.position || '--'}
                          </span>
                        </div>

                        {/* Overall Score */}
                        <div className="col-span-3">
                          <div className="space-y-1">
                            <div className="text-sm text-blue-600 font-medium">
                              {formatRounds(result.rounds_detail || result.rounds)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {result.score_display || '--'}
                            </div>
                          </div>
                        </div>

                        {/* Earnings */}
                        <div className="col-span-2 text-right">
                          <span className="text-sm text-gray-900 font-medium">
                            {formatEarnings(result.earnings)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click overlay to close dropdown */}
      {isYearDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsYearDropdownOpen(false)}
        />
      )}
    </div>
  );
}