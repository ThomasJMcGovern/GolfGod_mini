import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { type PlayerProfile } from '../types';

interface ESPNPlayerHeaderProps {
  player: PlayerProfile;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ESPNPlayerHeader({
  player,
  currentTab = 'results',
  onTabChange
}: ESPNPlayerHeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'news', label: 'News' },
    { id: 'bio', label: 'Bio' },
    { id: 'results', label: 'Results' },
    { id: 'scorecards', label: 'Scorecards' }
  ];

  const formatCurrency = (amount: number | undefined | null): string => {
    // Handle null/undefined values
    if (!amount && amount !== 0) return '$0';

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatBirthdate = (birthdate: string): string => {
    const date = new Date(birthdate);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCountryFlag = (country: string): string => {
    const flagMap: Record<string, string> = {
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'Northern Ireland': '🇬🇧',
      'Spain': '🇪🇸',
      'Norway': '🇳🇴',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Ireland': '🇮🇪',
      'Australia': '🇦🇺',
      'South Africa': '🇿🇦',
      'Canada': '🇨🇦'
    };
    return flagMap[country] || '🏳️';
  };

  return (
    <div className="bg-white">
      {/* Player Profile Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 border-b border-gray-200">
        {/* Player Photo and Flag */}
        <div className="relative flex-shrink-0">
          <div className="relative">
            {/* Player Photo */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-gray-100 border-2 border-white shadow-lg">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2MEMzNS41IDYwIDI0IDQ4LjUgMjQgMzRDMjQgMTkuNSAzNS41IDggNTAgOEM2NC41IDggNzYgMTkuNSA3NiAzNEM3NiA0OC41IDY0LjUgNjAgNTAgNjBaTTUwIDEwMEM3NyAxMDAgMTAwIDc3IDEwMCA1MEMxMDAgMjMgNzcgMCA1MCAwQzIzIDAgMCAyMyAwIDUwQzAgNzcgMjMgMTAwIDUwIDEwMFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+Cg==';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-400">
                    {player.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Country Flag Overlay */}
            {player.country && (
              <div className="absolute -top-2 -right-2 w-8 h-6 bg-white rounded shadow-md border flex items-center justify-center">
                <span className="text-sm">{getCountryFlag(player.country)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Info */}
        <div className="flex-grow">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Name and Basic Info */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                <span className="text-lg font-normal text-gray-600 block lg:inline mr-2">
                  {player.full_name.split(' ')[0].toUpperCase()}
                </span>
                {player.full_name.split(' ').slice(1).join(' ').toUpperCase()}
              </h1>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  {player.country && getCountryFlag(player.country)}
                  {player.country}
                </span>
                {player.world_ranking && (
                  <Badge variant="secondary" className="text-xs">
                    World Ranking: #{player.world_ranking}
                  </Badge>
                )}
              </div>

              {/* Follow Button (ESPN-style) */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold text-sm transition-colors">
                Follow
              </button>
            </div>

            {/* Player Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-6 text-sm">
              {player.birthdate && (
                <div>
                  <span className="text-gray-500 font-medium">BIRTHDATE</span>
                  <div className="font-semibold">
                    {formatBirthdate(player.birthdate)} ({player.age})
                  </div>
                </div>
              )}

              {player.birthplace && (
                <div>
                  <span className="text-gray-500 font-medium">BIRTHPLACE</span>
                  <div className="font-semibold">{player.birthplace}</div>
                </div>
              )}

              {player.college && (
                <div>
                  <span className="text-gray-500 font-medium">COLLEGE</span>
                  <div className="font-semibold">{player.college}</div>
                </div>
              )}

              {player.swing_type && (
                <div>
                  <span className="text-gray-500 font-medium">SWING</span>
                  <div className="font-semibold">{player.swing_type}</div>
                </div>
              )}

              {player.turned_pro && (
                <div>
                  <span className="text-gray-500 font-medium">TURNED PRO</span>
                  <div className="font-semibold">{player.turned_pro}</div>
                </div>
              )}
            </div>
          </div>

          {/* Career Highlights */}
          <div className="mt-6 grid grid-cols-3 gap-6 text-center lg:text-left">
            <div>
              <div className="text-2xl font-bold text-gray-900">{player.career_wins || 0}</div>
              <div className="text-sm text-gray-500">Career Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(player.career_earnings)}
              </div>
              <div className="text-sm text-gray-500">Career Earnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{player.tournaments_last_year || 0}</div>
              <div className="text-sm text-gray-500">Events This Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${currentTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}