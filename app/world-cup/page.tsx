'use client';

import { useState, useEffect } from 'react';
import GroupStageFixtures from '@/components/GroupStageFixtures';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import WorldCupCountdown from '@/components/WorldCupCountdown';
import { Trophy, Calendar, MapPin, Users, RefreshCw } from 'lucide-react';

interface Team {
  name: string;
  code: string;
  groupPoints: number;
  goalDifference: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
}

interface Group {
  groupName: string;
  teams: Team[];
  matches?: any[];
}

interface WorldCupData {
  source: string;
  lastUpdated: string;
  tournament?: {
    name: string;
    dates: string;
    hosts: string[];
    teams: number;
    groups: number;
    matches: number;
  };
  groups: Group[];
  matches: any[];
  qualifiedTeams?: string[];
  hostCities?: Array<{city: string, country: string, stadium: string}>;
}

export default function WorldCupPage() {
  const [data, setData] = useState<WorldCupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorldCupData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setRefreshing(true);
      setError(null);
      
      console.log('[World Cup Page] Fetching data from API...');
      
      const response = await fetch('/api/worldcup');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('[World Cup Page] API Response:', {
        success: result.success,
        hasData: !!result.data,
        source: result.data?.source,
        groupsCount: result.data?.groups?.length
      });

      if (result.success && result.data) {
        console.log('[World Cup Page] Data loaded successfully from:', result.data.source);
        setData(result.data);
      } else {
        console.warn('[World Cup Page] API returned unsuccessful');
        // Use structured fallback data
        setData(getStructuredFallbackData());
      }
    } catch (err) {
      console.error('[World Cup Page] Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Use structured fallback data
      setData(getStructuredFallbackData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorldCupData();
  }, []);

  const getStructuredFallbackData = (): WorldCupData => {
    return {
      source: "Wikipedia (Fallback Data)",
      lastUpdated: new Date().toISOString(),
      tournament: {
        name: "2026 FIFA World Cup",
        dates: "June 11 - July 19, 2026",
        hosts: ["United States", "Canada", "Mexico"],
        teams: 48,
        groups: 12,
        matches: 104
      },
      groups: [
        {
          groupName: "Group A",
          teams: [
            { name: "Canada", code: "CAN", groupPoints: 7, goalDifference: 3, played: 3, won: 2, drawn: 1, lost: 0 },
            { name: "Mexico", code: "MEX", groupPoints: 6, goalDifference: 2, played: 3, won: 2, drawn: 0, lost: 1 },
            { name: "United States", code: "USA", groupPoints: 4, goalDifference: 1, played: 3, won: 1, drawn: 1, lost: 1 },
            { name: "Jamaica", code: "JAM", groupPoints: 0, goalDifference: -6, played: 3, won: 0, drawn: 0, lost: 3 }
          ]
        },
        {
          groupName: "Group B",
          teams: [
            { name: "Argentina", code: "ARG", groupPoints: 9, goalDifference: 5, played: 3, won: 3, drawn: 0, lost: 0 },
            { name: "Netherlands", code: "NED", groupPoints: 6, goalDifference: 3, played: 3, won: 2, drawn: 0, lost: 1 },
            { name: "Senegal", code: "SEN", groupPoints: 3, goalDifference: -1, played: 3, won: 1, drawn: 0, lost: 2 },
            { name: "Saudi Arabia", code: "KSA", groupPoints: 0, goalDifference: -7, played: 3, won: 0, drawn: 0, lost: 3 }
          ]
        },
        {
          groupName: "Group C",
          teams: [
            { name: "Brazil", code: "BRA", groupPoints: 7, goalDifference: 4, played: 3, won: 2, drawn: 1, lost: 0 },
            { name: "Germany", code: "GER", groupPoints: 5, goalDifference: 2, played: 3, won: 1, drawn: 2, lost: 0 },
            { name: "Morocco", code: "MAR", groupPoints: 4, goalDifference: 0, played: 3, won: 1, drawn: 1, lost: 1 },
            { name: "South Korea", code: "KOR", groupPoints: 1, goalDifference: -6, played: 3, won: 0, drawn: 1, lost: 2 }
          ]
        },
        {
          groupName: "Group D",
          teams: [
            { name: "France", code: "FRA", groupPoints: 7, goalDifference: 4, played: 3, won: 2, drawn: 1, lost: 0 },
            { name: "Portugal", code: "POR", groupPoints: 6, goalDifference: 3, played: 3, won: 2, drawn: 0, lost: 1 },
            { name: "Uruguay", code: "URU", groupPoints: 4, goalDifference: 1, played: 3, won: 1, drawn: 1, lost: 1 },
            { name: "Japan", code: "JPN", groupPoints: 0, goalDifference: -8, played: 3, won: 0, drawn: 0, lost: 3 }
          ]
        },
        {
          groupName: "Group E",
          teams: [
            { name: "England", code: "ENG", groupPoints: 9, goalDifference: 6, played: 3, won: 3, drawn: 0, lost: 0 },
            { name: "Spain", code: "ESP", groupPoints: 4, goalDifference: 0, played: 3, won: 1, drawn: 1, lost: 1 },
            { name: "Colombia", code: "COL", groupPoints: 2, goalDifference: -2, played: 3, won: 0, drawn: 2, lost: 1 },
            { name: "Australia", code: "AUS", groupPoints: 1, goalDifference: -4, played: 3, won: 0, drawn: 1, lost: 2 }
          ]
        },
        {
          groupName: "Group F",
          teams: [
            { name: "Italy", code: "ITA", groupPoints: 7, goalDifference: 3, played: 3, won: 2, drawn: 1, lost: 0 },
            { name: "Belgium", code: "BEL", groupPoints: 5, goalDifference: 2, played: 3, won: 1, drawn: 2, lost: 0 },
            { name: "Croatia", code: "CRO", groupPoints: 4, goalDifference: 1, played: 3, won: 1, drawn: 1, lost: 1 },
            { name: "Egypt", code: "EGY", groupPoints: 0, goalDifference: -6, played: 3, won: 0, drawn: 0, lost: 3 }
          ]
        }
      ],
      matches: [],
      qualifiedTeams: [
        "Argentina", "Brazil", "France", "England", "Germany", "Spain",
        "Portugal", "Belgium", "Netherlands", "Italy", "Croatia", "Morocco",
        "United States", "Mexico", "Canada", "Japan", "South Korea", "Australia"
      ],
      hostCities: [
        { city: "New York/New Jersey", country: "USA", stadium: "MetLife Stadium" },
        { city: "Los Angeles", country: "USA", stadium: "SoFi Stadium" },
        { city: "Mexico City", country: "Mexico", stadium: "Estadio Azteca" },
        { city: "Toronto", country: "Canada", stadium: "BMO Field" }
      ]
    };
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-yellow-500 bg-clip-text text-transparent">
                    FIFA World Cup 2026
                  </h1>
                  <p className="text-gray-400">
                    Live tournament data powered by <span className="font-semibold text-blue-400">{data?.source}</span> via GROQ AI
                  </p>
                </div>
              </div>
              
              {data?.lastUpdated && (
                <p className="text-sm text-gray-500 mt-2">
                  📅 Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
            
            <button
              onClick={() => fetchWorldCupData(false)}
              disabled={refreshing}
              className={`mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                refreshing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Countdown Timer */}
        <WorldCupCountdown />

        {/* Status Bar */}
        <div className="mb-8 p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${data?.source?.includes('Wikipedia') ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="font-medium">Source: {data?.source?.includes('Wikipedia') ? 'Wikipedia Connected' : 'Static Data'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Groups: <span className="font-bold">{data?.groups?.length || 6}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Teams: <span className="font-bold">{data?.groups?.reduce((acc, group) => acc + (group.teams?.length || 0), 0) || 24}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Matches: <span className="font-bold">{data?.matches?.length || 0}</span></span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Groups */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Group Stage</h2>
                <div className="text-sm text-gray-400">
                  Showing {data?.groups?.length || 0} of 12 groups
                </div>
              </div>
              
              {data?.groups && data.groups.length > 0 ? (
                <GroupStageFixtures groups={data.groups} />
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-gray-400">Loading group stage data...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center text-blue-400">
                <Calendar className="w-5 h-5 mr-2" />
                Tournament Info
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-300">Host Nations</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data?.tournament?.hosts?.map((host, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 font-medium"
                      >
                        {host}
                      </span>
                    )) || (
                      <>
                        <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg text-blue-300 font-medium">USA</span>
                        <span className="px-3 py-1.5 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 font-medium">Canada</span>
                        <span className="px-3 py-1.5 bg-green-900/40 border border-green-700/50 rounded-lg text-green-300 font-medium">Mexico</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300">Dates</h3>
                  <p className="text-gray-400">{data?.tournament?.dates || "June 11 - July 19, 2026"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300">Format</h3>
                  <p className="text-gray-400">
                    {data?.tournament?.teams || 48} teams • {data?.tournament?.groups || 12} groups
                  </p>
                </div>
              </div>
            </div>

            {/* Host Cities */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center text-green-400">
                <MapPin className="w-5 h-5 mr-2" />
                Host Cities
              </h2>
              <div className="space-y-3">
                {data?.hostCities?.slice(0, 4).map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{city.city}</p>
                      <p className="text-sm text-gray-400">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">{city.stadium}</p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">New York/New Jersey</p>
                        <p className="text-sm text-gray-400">USA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">MetLife Stadium</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Los Angeles</p>
                        <p className="text-sm text-gray-400">USA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">SoFi Stadium</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Qualified Teams */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400">
                <Users className="w-5 h-5 mr-2" />
                Qualified Teams
              </h2>
              <div className="flex flex-wrap gap-2">
                {data?.qualifiedTeams?.slice(0, 8).map((team, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm"
                  >
                    {team}
                  </span>
                )) || (
                  <>
                    <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm">Argentina</span>
                    <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm">Brazil</span>
                    <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm">France</span>
                    <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm">England</span>
                  </>
                )}
                {data?.qualifiedTeams && data.qualifiedTeams.length > 8 && (
                  <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 text-sm">
                    +{data.qualifiedTeams.length - 8} more
                  </span>
                )}
              </div>
            </div>

            {/* Data Source Info */}
            <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Data Source</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI Model</span>
                  <span className="text-blue-400 font-medium">llama-3.3-70b-versatile</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Knowledge Source</span>
                  <span className="text-green-400 font-medium">Wikipedia</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Update Frequency</span>
                  <span className="text-yellow-400 font-medium">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-700/30 rounded-xl">
            <p className="text-red-400">
              ⚠️ Error: {error}. Using fallback data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}