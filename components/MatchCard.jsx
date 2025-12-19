'use client';

import { useState } from 'react';

export default function MatchCard({ match }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format time for display
  const formatTime = (time) => {
    if (!time) return 'TBD';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{match.displayDate || match.date}</h3>
            <p className="text-sm opacity-90">{formatTime(match.time)}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              {match.group}
            </span>
          </div>
        </div>
        <p className="text-sm mt-2 opacity-90">
          <i className="fas fa-location-dot mr-2"></i>
          {match.venue}
        </p>
      </div>
      
      {/* Teams */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Team 1 */}
          <div className="text-center flex-1">
            <div className="mb-3">
              <img 
                src={match.team1Flag} 
                alt={`${match.team1} flag`}
                className="w-16 h-12 mx-auto object-cover rounded shadow"
                onError={(e) => {
                  e.target.src = `https://flagcdn.com/w80/un.png`;
                }}
              />
            </div>
            <h4 className="font-bold text-lg">{match.team1}</h4>
            {match.score?.team1 !== null && (
              <div className="text-2xl font-bold mt-2">{match.score.team1}</div>
            )}
          </div>
          
          {/* VS */}
          <div className="mx-6">
            <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-gray-600 font-bold">VS</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {match.status === 'scheduled' ? 'Upcoming' : match.status}
              </span>
            </div>
          </div>
          
          {/* Team 2 */}
          <div className="text-center flex-1">
            <div className="mb-3">
              <img 
                src={match.team2Flag} 
                alt={`${match.team2} flag`}
                className="w-16 h-12 mx-auto object-cover rounded shadow"
                onError={(e) => {
                  e.target.src = `https://flagcdn.com/w80/un.png`;
                }}
              />
            </div>
            <h4 className="font-bold text-lg">{match.team2}</h4>
            {match.score?.team2 !== null && (
              <div className="text-2xl font-bold mt-2">{match.score.team2}</div>
            )}
          </div>
        </div>
        
        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
          <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'} ml-2`}></i>
        </button>
        
        {/* Additional Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-medium">{new Date(match.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div>
                <span className="text-gray-600">Local Time:</span>
                <p className="font-medium">{formatTime(match.time)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Venue:</span>
                <p className="font-medium">{match.venue}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}