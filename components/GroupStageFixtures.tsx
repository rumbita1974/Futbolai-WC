// components/GroupStageFixtures.tsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Match } from '../types';
import { TeamContext } from '../context/TeamContext';
import Link from 'next/link';

interface GroupStageFixturesProps {
  matches?: Match[];
  onTeamClick?: (teamName: string) => void;
}

const GroupStageFixtures: React.FC<GroupStageFixturesProps> = ({ matches: propMatches, onTeamClick }) => {
  const teamContext = useContext(TeamContext);
  
  // Safe access to context values
  const filteredMatches = teamContext?.filteredMatches || [];
  const matches = propMatches || filteredMatches;
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Get unique dates for filter - FIXED: Use Array.from
  const matchDates = useMemo(() => {
    const dates = matches.map(match => match.date);
    return Array.from(new Set(dates)).sort();
  }, [matches]);

  // Get unique venues for filter
  const venues = useMemo(() => {
    const venueList = matches.map(match => match.venue);
    return ['all', ...Array.from(new Set(venueList)).sort()];
  }, [matches]);

  // Get unique stages for filter
  const stages = useMemo(() => {
    const stageList = matches.map(match => match.stage);
    return ['all', ...Array.from(new Set(stageList)).sort()];
  }, [matches]);

  // Get unique groups from matches using Array.from
  const availableGroups = Array.from(new Set(matches.map(match => match.group))).sort();

  // Filter matches based on selected filters
  const filteredMatchesList = useMemo(() => {
    return matches.filter(match => {
      if (selectedDate !== 'all' && match.date !== selectedDate) return false;
      if (selectedStage !== 'all' && match.stage !== selectedStage) return false;
      if (selectedVenue !== 'all' && match.venue !== selectedVenue) return false;
      if (selectedGroup !== 'all' && match.group !== selectedGroup) return false;
      return true;
    });
  }, [matches, selectedDate, selectedStage, selectedVenue, selectedGroup]);

  // Group matches by group
  const matchesByGroup = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    filteredMatchesList.forEach(match => {
      if (!groups[match.group]) {
        groups[match.group] = [];
      }
      groups[match.group].push(match);
    });
    return groups;
  }, [filteredMatchesList]);

  const toggleGroup = (group: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(group)) {
      newExpandedGroups.delete(group);
    } else {
      newExpandedGroups.add(group);
    }
    setExpandedGroups(newExpandedGroups);
  };

  // Expand all groups on mount
  useEffect(() => {
    const allGroups = new Set(availableGroups);
    setExpandedGroups(allGroups);
  }, [availableGroups]);

  // Reset filters when matches change
  useEffect(() => {
    setSelectedDate('all');
    setSelectedStage('all');
    setSelectedVenue('all');
    setSelectedGroup('all');
  }, [matches]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeStr;
    }
  };

  const getMatchStatus = (match: Match) => {
    if (match.status === 'completed') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
          FT: {match.homeScore} - {match.awayScore}
        </span>
      );
    } else if (match.status === 'in_progress') {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded animate-pulse">
          LIVE
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
          {formatTime(match.time)}
        </span>
      );
    }
  };

  // Helper function to create team slug
  const createTeamSlug = (teamName: string) => {
    return teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  if (!teamContext) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading fixtures...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Group Stage Fixtures</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            {matchDates.map(date => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Venues</option>
            {venues.map(venue => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Groups</option>
            {availableGroups.map(group => (
              <option key={group} value={group}>
                Group {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Group Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableGroups.map(group => (
          <button
            key={group}
            onClick={() => toggleGroup(group)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              expandedGroups.has(group)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Group {group} {expandedGroups.has(group) ? '▲' : '▼'}
          </button>
        ))}
        <button
          onClick={() => {
            if (expandedGroups.size === availableGroups.length) {
              setExpandedGroups(new Set());
            } else {
              setExpandedGroups(new Set(availableGroups));
            }
          }}
          className="px-4 py-2 bg-gray-800 text-white rounded-md font-medium text-sm hover:bg-gray-700"
        >
          {expandedGroups.size === availableGroups.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Group Display */}
      <div className="space-y-8">
        {availableGroups
          .filter(group => selectedGroup === 'all' || group === selectedGroup)
          .map(group => {
            const groupMatches = matchesByGroup[group] || [];
            const isExpanded = expandedGroups.has(group);

            if (groupMatches.length === 0) return null;

            return (
              <div key={group} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 cursor-pointer"
                  onClick={() => toggleGroup(group)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Group {group}</h3>
                    <span className="text-gray-600">
                      {groupMatches.length} match{groupMatches.length !== 1 ? 'es' : ''}
                      <span className="ml-2">{isExpanded ? '▲' : '▼'}</span>
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupMatches.map((match, index) => (
                        <div
                          key={`${match.homeTeam}-${match.awayTeam}-${index}`}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">
                              {formatDate(match.date)}
                            </span>
                            {getMatchStatus(match)}
                          </div>

                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <Link 
                                  href={`/teams/${createTeamSlug(match.homeTeam)}`}
                                  onClick={() => onTeamClick && onTeamClick(match.homeTeam)}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                >
                                  {match.homeTeam}
                                  <svg 
                                    className="w-4 h-4 ml-1 opacity-70" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                </Link>
                              </div>
                              {match.status === 'completed' && (
                                <span className="font-bold text-lg">
                                  {match.homeScore}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Link 
                                  href={`/teams/${createTeamSlug(match.awayTeam)}`}
                                  onClick={() => onTeamClick && onTeamClick(match.awayTeam)}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                >
                                  {match.awayTeam}
                                  <svg 
                                    className="w-4 h-4 ml-1 opacity-70" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                </Link>
                              </div>
                              {match.status === 'completed' && (
                                <span className="font-bold text-lg">
                                  {match.awayScore}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {match.venue}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {formatTime(match.time)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                {match.stage}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* No matches message */}
      {filteredMatchesList.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700">No matches found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters to find matches.</p>
        </div>
      )}
    </div>
  );
};

export default GroupStageFixtures;

