import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { groqService } from '../services/groqService';
import { worldCupGroups, worldCupMatches } from '../data/worldCupData';

// Add these imports at the top if needed
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const WorldCup2026 = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch data on component mount
  useEffect(() => {
    fetchWorldCupData();
  }, []);

  const fetchWorldCupData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch live data from Wikipedia via GROQ
      const [groupsData, matchesData] = await Promise.all([
        groqService.getWorldCupGroups(),
        groqService.getMatchSchedule()
      ]);
      
      setGroups(groupsData.groups || []);
      setMatches(matchesData.matches || []);
      setLastUpdated(new Date().toISOString());
      
      // Fallback to static data if API returns empty
      if (!groupsData.groups || groupsData.groups.length === 0) {
        setGroups(worldCupGroups);
        console.log('Using fallback static data for groups');
      }
      
      if (!matchesData.matches || matchesData.matches.length === 0) {
        setMatches(worldCupMatches);
        console.log('Using fallback static data for matches');
      }
      
    } catch (err: any) {
      console.error('Error fetching World Cup data:', err);
      setError('Failed to load World Cup data. Please try again.');
      
      // Fallback to static data
      setGroups(worldCupGroups);
      setMatches(worldCupMatches);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTeamClick = (teamName: string) => {
    router.push(`/team/${encodeURIComponent(teamName)}`);
  };

  const handleRefresh = () => {
    fetchWorldCupData();
  };

  // Render loading state
  if (isLoading && groups.length === 0) {
    return (
      <Layout title="World Cup 2026">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching latest World Cup data from Wikipedia...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error && groups.length === 0) {
    return (
      <Layout title="World Cup 2026 - Error">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Data</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="FIFA World Cup 2026">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">FIFA World Cup 2026</h1>
            <p className="text-xl mb-6">USA • Canada • Mexico</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p>June 11 - July 19, 2026</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p>48 Teams • 16 Host Cities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('groups')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'groups'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => handleTabChange('matches')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Match Schedule
            </button>
            
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Loading...
                  </>
                ) : (
                  '↻ Refresh Data'
                )}
              </button>
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Tournament Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Host Nations</h3>
                    <p className="text-blue-600">United States, Canada, Mexico</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Teams</h3>
                    <p className="text-green-600">48 teams (expanded format)</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Matches</h3>
                    <p className="text-purple-600">104 matches total</p>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    The 2026 FIFA World Cup will be the 23rd FIFA World Cup, hosted jointly by 
                    16 cities across the United States, Canada, and Mexico. This will be the 
                    first World Cup to feature 48 teams, expanded from 32.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Group Stage</h2>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading group data...</p>
                  </div>
                ) : groups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {groups.map((group: any) => (
                      <div key={group.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg mb-4 text-center">{group.name}</h3>
                        <div className="space-y-3">
                          {group.teams?.map((team: any, index: number) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                              onClick={() => handleTeamClick(team.name)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{team.flagEmoji || '🏴'}</span>
                                <span className="font-medium">{team.name}</span>
                              </div>
                              <span className="text-gray-500 text-sm">{team.fifaCode}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No group data available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Match Schedule</h2>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading match schedule...</p>
                  </div>
                ) : matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.slice(0, 10).map((match: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{match.date}</span>
                            <span className="ml-4 text-gray-600">{match.stage}</span>
                          </div>
                          <span className="text-gray-500">{match.venue}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-4">
                          <span 
                            className="font-bold cursor-pointer hover:text-blue-600"
                            onClick={() => handleTeamClick(match.team1)}
                          >
                            {match.team1}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span 
                            className="font-bold cursor-pointer hover:text-blue-600"
                            onClick={() => handleTeamClick(match.team2)}
                          >
                            {match.team2}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No match data available yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Data Source Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Data powered by GROQ AI fetching current information from Wikipedia</p>
            <p className="mt-1">Click "Refresh Data" to get the latest updates</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorldCup2026;