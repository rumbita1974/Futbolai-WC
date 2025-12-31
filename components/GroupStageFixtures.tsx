'use client';

interface Team {
  name: string;
  code: string;
  groupPoints: number;
  goalDifference: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
}

interface Group {
  groupName: string;
  teams: Team[];
  matches?: Match[];
}

interface GroupStageFixturesProps {
  groups: Group[];
}

export default function GroupStageFixtures({ groups }: GroupStageFixturesProps) {
  // Debug log to see what we're receiving
  console.log('[GroupStageFixtures] Received props:', {
    groupsCount: groups?.length || 0,
    groups: groups?.map(g => ({
      name: g.groupName,
      teamsCount: g.teams?.length || 0,
      matchesCount: g.matches?.length || 0
    }))
  });

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
          <span className="text-4xl">🏃‍♂️</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Group Data Available</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Group stage data is still being loaded or processed. Please check back soon.
        </p>
      </div>
    );
  }

  // Sort teams within each group by points, then goal difference
  const sortedGroups = groups.map(group => ({
    ...group,
    teams: [...(group.teams || [])].sort((a, b) => {
      if (b.groupPoints !== a.groupPoints) {
        return b.groupPoints - a.groupPoints;
      }
      return (b.goalDifference || 0) - (a.goalDifference || 0);
    })
  }));

  const handleTeamClick = (team: Team) => {
    console.log('Team clicked:', team);
    // Navigate to team details page
    // router.push(`/team/${team.code.toLowerCase()}`);
    // For now, just show an alert
    alert(`Team details for ${team.name} (${team.code}) would open here.`);
  };

  const handleMatchClick = (match: Match) => {
    console.log('Match clicked:', match);
    alert(`Match details: ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Group Stage</h2>
          <p className="text-gray-400 mt-2">Click on teams for detailed statistics and match history</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-400">Qualified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-400">Playoff</span>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {sortedGroups.map((group, index) => (
          <div 
            key={group.groupName || `group-${index}`}
            className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">{group.groupName?.charAt(group.groupName.length - 1) || String.fromCharCode(65 + index)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{group.groupName || `Group ${String.fromCharCode(65 + index)}`}</h3>
                  <p className="text-sm text-gray-400">{group.teams?.length || 0} teams • {group.matches?.length || 0} matches</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-gray-800/60 text-gray-300 rounded-full text-sm font-medium">
                Position {index + 1}
              </span>
            </div>

            {/* Teams Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-700/50">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/60">
                    <th className="text-left py-4 px-4 font-semibold text-gray-300 w-8">#</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Team</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">P</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">W</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">D</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">L</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">GD</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-300">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams?.map((team, teamIndex) => {
                    const isQualified = teamIndex < 2; // Top 2 qualify
                    const isPlayoff = teamIndex === 2; // 3rd place playoff
                    
                    return (
                      <tr 
                        key={team.code || teamIndex}
                        className={`
                          border-b border-gray-800/30 hover:bg-gray-700/30 cursor-pointer transition-all duration-200
                          ${isQualified ? 'bg-green-500/5 hover:bg-green-500/10' : ''}
                          ${isPlayoff ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : ''}
                        `}
                        onClick={() => handleTeamClick(team)}
                      >
                        <td className="py-4 px-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isQualified ? 'bg-green-500/20 text-green-400' : 
                            isPlayoff ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-gray-700/50 text-gray-400'
                          }`}>
                            <span className="text-sm font-bold">{teamIndex + 1}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 flex items-center justify-center bg-gray-800/60 rounded-lg">
                              <span className="font-bold text-sm tracking-wide">
                                {team.code || team.name.substring(0, 3).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-white">{team.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  isQualified ? 'bg-green-500' : 
                                  isPlayoff ? 'bg-yellow-500' : 
                                  'bg-gray-600'
                                }`} />
                                <span className="text-xs text-gray-400">
                                  {isQualified ? 'Qualified' : isPlayoff ? 'Playoff' : 'Eliminated'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">{(team as any).played || 0}</td>
                        <td className="text-center py-4 px-4 font-medium">{(team as any).won || 0}</td>
                        <td className="text-center py-4 px-4 font-medium">{(team as any).drawn || 0}</td>
                        <td className="text-center py-4 px-4 font-medium">{(team as any).lost || 0}</td>
                        <td className="text-center py-4 px-4">
                          <span className={`
                            font-bold px-3 py-1 rounded-full text-sm
                            ${team.goalDifference > 0 ? 'bg-green-500/20 text-green-400' : 
                              team.goalDifference < 0 ? 'bg-red-500/20 text-red-400' : 
                              'bg-gray-700/50 text-gray-400'}
                          `}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <span className="font-bold text-lg text-white bg-gradient-to-r from-blue-500/20 to-green-500/20 px-3 py-1.5 rounded-lg inline-block min-w-[50px]">
                            {team.groupPoints}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Recent Matches Preview */}
            {group.matches && group.matches.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">⚽</span> Recent Matches
                </h4>
                <div className="space-y-3">
                  {group.matches.slice(0, 3).map((match, matchIndex) => (
                    <div 
                      key={match.id || matchIndex}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/40 cursor-pointer transition-colors"
                      onClick={() => handleMatchClick(match)}
                    >
                      <div className="flex-1 text-right">
                        <span className="font-semibold text-white">{match.homeTeam}</span>
                      </div>
                      <div className="flex items-center justify-center mx-4">
                        <div className="text-center">
                          <div className={`
                            px-4 py-2 rounded-lg font-bold text-lg min-w-[100px]
                            ${match.status === 'live' ? 'bg-red-500/20 text-red-400 animate-pulse' :
                              match.status === 'completed' ? 'bg-gray-800/60' :
                              'bg-blue-500/20 text-blue-400'}
                          `}>
                            <span className="font-mono">
                              {match.homeScore} - {match.awayScore}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {match.status === 'live' ? 'LIVE' : 
                             match.status === 'completed' ? 'FT' : 
                             new Date(match.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-white">{match.awayTeam}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {group.matches.length > 3 && (
                  <div className="text-center mt-4">
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                      View all {group.matches.length} matches →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 mt-8 border border-gray-700">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-300">Top 2: Advance to knockout stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-300">3rd place: Possible playoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-sm text-gray-300">4th place: Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
}