'use client';

import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    console.log('Searching for:', searchQuery);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FutbolAI Explorer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered football intelligence for the 2026 FIFA World Cup
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search players, teams, or football terms..."
                className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Example searches */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Lionel Messi', 'Argentina', 'World Cup 2026', 'Brazil team', 'Premier League'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching football data...</p>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a 
              href="/world-cup" 
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="text-blue-600 text-4xl mb-4">⚽</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">World Cup 2026</h3>
              <p className="text-gray-600">Official schedule, groups, and match information</p>
              <div className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                View Schedule
              </div>
            </a>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-green-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Player Stats</h3>
              <p className="text-gray-600">AI-powered player analysis and statistics</p>
              <div className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
                Coming Soon
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-red-600 text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Video Highlights</h3>
              <p className="text-gray-600">Match highlights and player compilations</p>
              <div className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/world-cup" className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              World Cup Schedule
            </a>
            <a href="/api/worldcup" className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
              API Data
            </a>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Player Database
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Team Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}