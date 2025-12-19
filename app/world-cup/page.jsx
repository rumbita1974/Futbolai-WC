'use client';

import { useEffect, useState } from 'react';
import { getWorldCupMatches } from '@/services/worldCupService';

export default function WorldCupPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadMatches();
  }, []);
  
  async function loadMatches() {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading matches...');
      const matchData = await getWorldCupMatches();
      console.log(`Loaded ${matchData.length} matches`);
      setMatches(matchData);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading FIFA World Cup 2026 schedule...</p>
        <p className="text-sm text-gray-500">From: /data/schedule.json</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">⚠️ Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadMatches}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          FIFA World Cup 2026 Schedule
        </h1>
        <p className="text-gray-600 text-lg">
          North America • June 11 - July 19, 2026
        </p>
        <div className="mt-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mr-2">
            {matches.length} Matches
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full mr-2">
            Real FIFA Data
          </span>
          <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1 rounded-full">
            Group Stage + Knockout
          </span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Matches</h2>
        <p className="text-gray-600 mb-6">
          Showing {matches.length} matches from the official FIFA World Cup 2026 schedule.
        </p>
      </div>
      
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
          <p className="text-gray-600">Check the data file at /public/data/schedule.json</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">{match.date}</span>
                  {match.group && (
                    <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {match.group}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold">{match.displayDate}</h3>
                <p className="text-gray-600">{match.venue}</p>
              </div>
              
              <div className="flex items-center justify-between my-6">
                <div className="text-center flex-1">
                  <div className="mb-2">
                    <img 
                      src={match.team1Flag} 
                      alt={match.team1}
                      className="w-16 h-12 mx-auto object-cover rounded"
                    />
                  </div>
                  <h4 className="font-bold">{match.team1}</h4>
                </div>
                
                <div className="mx-4">
                  <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-gray-700">vs</span>
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="mb-2">
                    <img 
                      src={match.team2Flag} 
                      alt={match.team2}
                      className="w-16 h-12 mx-auto object-cover rounded"
                    />
                  </div>
                  <h4 className="font-bold">{match.team2}</h4>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Time: {match.time}</span>
                  <span>{match.round}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Data Source</h3>
          <p className="text-gray-600">
            This schedule is parsed from the official FIFA World Cup 2026 schedule file.
            All 104 matches (72 group stage + 32 knockout) are included.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>File: <code>FIFA-World-Cup-2026-schedule.txt</code></p>
            <p>Generated JSON: <code>/public/data/schedule.json</code></p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}