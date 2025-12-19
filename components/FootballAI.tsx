import { useEffect } from 'react';

interface FootballAIProps {
  player: any;
  team: any;
  isLoading: boolean;
  analysis?: string;
  teams?: any[];
  worldCupInfo?: any;
}

// Helper function to render detailed trophies
function renderDetailedTrophies(entity: any) {
  const isNationalTeam = entity.type === 'national';
  const isClub = entity.type === 'club';
  
  if (!entity.trophies) return null;

  const { trophies } = entity;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>
        🏆 Trophy Breakdown
      </h4>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
      }}>
        {isClub && (
          <>
            {trophies.continental && trophies.continental.length > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#3b82f6', fontSize: '1.25rem' }}>🌍</span>
                  <h5 style={{ color: '#93c5fd', fontSize: '0.9375rem', fontWeight: 600 }}>Continental Titles</h5>
                </div>
                {trophies.continental.map((trophy: any, index: number) => (
                  <div key={index} style={{ 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                  }}>
                    <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                      {trophy.competition}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {trophy.wins} wins • Last: {trophy.lastWin || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {trophies.domestic?.league && trophies.domestic.league.length > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#22c55e', fontSize: '1.25rem' }}>🥇</span>
                  <h5 style={{ color: '#86efac', fontSize: '0.9375rem', fontWeight: 600 }}>Domestic Leagues</h5>
                </div>
                {trophies.domestic.league.map((trophy: any, index: number) => (
                  <div key={index} style={{ 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                  }}>
                    <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                      {trophy.competition}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {trophy.wins} titles • Last: {trophy.lastWin || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {trophies.domestic?.cup && trophies.domestic.cup.length > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#a855f7', fontSize: '1.25rem' }}>🏆</span>
                  <h5 style={{ color: '#d8b4fe', fontSize: '0.9375rem', fontWeight: 600 }}>Domestic Cups</h5>
                </div>
                {trophies.domestic.cup.map((trophy: any, index: number) => (
                  <div key={index} style={{ 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                  }}>
                    <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                      {trophy.competition}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {trophy.wins} wins • Last: {trophy.lastWin || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {isNationalTeam && (
          <>
            {trophies.worldCup && trophies.worldCup.wins > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#ef4444', fontSize: '1.25rem' }}>🌎</span>
                  <h5 style={{ color: '#fca5a5', fontSize: '0.9375rem', fontWeight: 600 }}>World Cup</h5>
                </div>
                <div style={{ 
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                }}>
                  <div style={{ color: 'white', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {trophies.worldCup.wins} World Cup Title{trophies.worldCup.wins !== 1 ? 's' : ''}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Last win: {trophies.worldCup.lastWin || 'N/A'}
                  </div>
                </div>
              </div>
            )}
            
            {trophies.continental && trophies.continental.length > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#3b82f6', fontSize: '1.25rem' }}>🏆</span>
                  <h5 style={{ color: '#93c5fd', fontSize: '0.9375rem', fontWeight: 600 }}>Continental Titles</h5>
                </div>
                {trophies.continental.map((trophy: any, index: number) => (
                  <div key={index} style={{ 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                  }}>
                    <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                      {trophy.competition}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {trophy.wins} title{trophy.wins !== 1 ? 's' : ''} • Last: {trophy.lastWin || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Helper Components
function InfoCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      border: `1px solid ${color}20`,
    }}>
      <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>{value}</div>
    </div>
  );
}

function AchievementCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: '1.25rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      border: `1px solid ${color}30`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ color: color, fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{label}</div>
    </div>
  );
}

function FeatureBadge({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <div style={{
      padding: '0.75rem 1.25rem',
      background: `${color}15`,
      border: `1px solid ${color}30`,
      borderRadius: '999px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9375rem',
      color: `${color}dd`,
      fontWeight: 500,
    }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default function FootballAI({ 
  player, 
  team, 
  isLoading,
  analysis,
  teams,
  worldCupInfo 
}: FootballAIProps) {
  // Add animation styles safely for SSR
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (!document.querySelector('style[data-footballai-animations]')) {
        const styleTag = document.createElement('style');
        styleTag.setAttribute('data-footballai-animations', 'true');
        styleTag.textContent = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        animation: 'fadeIn 0.3s ease-out',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(74, 222, 128, 0.2)',
          borderTopColor: '#4ade80',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '1.125rem' }}>
          ⚽ Analyzing football data with AI...
        </p>
        <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          Gathering comprehensive stats and insights...
        </p>
      </div>
    );
  }

  const entity = player || team;
  const isNationalTeam = team?.type === 'national';
  const isClub = team?.type === 'club';

  if (player || team || worldCupInfo) {
    let title = 'Football Analysis';
    if (player?.name) {
      title = player.name;
    } else if (team?.name) {
      title = team.name;
    } else if (worldCupInfo?.year) {
      title = `World Cup ${worldCupInfo.year}`;
    } else if (worldCupInfo) {
      title = 'World Cup';
    }

    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 800, 
            marginBottom: '0.5rem', 
            color: 'white',
            background: player ? 'linear-gradient(to right, #4ade80, #22d3ee)' : 
                      team ? 'linear-gradient(to right, #fbbf24, #f97316)' :
                      worldCupInfo ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' :
                      'linear-gradient(to right, #4ade80, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {title}
          </h2>
          
          {isNationalTeam && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '999px',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>🌍</span>
              <span style={{ fontSize: '0.875rem', color: '#93c5fd' }}>National Team</span>
            </div>
          )}
          
          {isClub && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 1rem',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '999px',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>🏟️</span>
              <span style={{ fontSize: '0.875rem', color: '#fde68a' }}>Football Club</span>
            </div>
          )}
        </div>
        
        {/* AI Analysis Section */}
        {analysis && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.6s ease-out 0.1s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(74, 222, 128, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}>
                🤖
              </div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>AI Analysis</h3>
            </div>
            <p style={{ 
              color: '#e2e8f0', 
              lineHeight: 1.7,
              fontSize: '1.0625rem',
            }}>
              {analysis}
            </p>
          </div>
        )}
        
        {/* Achievements Section */}
        {entity?.achievementsSummary && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.6s ease-out 0.2s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                🏆
              </div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>Achievements Summary</h3>
            </div>
            
            {renderAchievements(entity)}
          </div>
        )}
        
        {/* Detailed Trophies Section */}
        {entity?.trophies && renderDetailedTrophies(entity)}
        
        {/* Basic Info Grid */}
        {entity && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            animation: 'fadeIn 0.6s ease-out 0.4s both',
          }}>
            {player && (
              <>
                {player.position && (
                  <InfoCard label="Position" value={player.position} color="#4ade80" />
                )}
                {player.nationality && (
                  <InfoCard label="Nationality" value={player.nationality} color="#22d3ee" />
                )}
                {player.currentClub && (
                  <InfoCard label="Current Club" value={player.currentClub} color="#fbbf24" />
                )}
                {player.age && (
                  <InfoCard label="Age" value={player.age} color="#8b5cf6" />
                )}
              </>
            )}
            
            {team && (
              <>
                {team.fifaRanking && (
                  <InfoCard 
                    label={isNationalTeam ? "FIFA Ranking" : "Current Ranking"} 
                    value={team.fifaRanking} 
                    color="#4ade80" 
                  />
                )}
                {team.league && !isNationalTeam && (
                  <InfoCard label="League" value={team.league} color="#22d3ee" />
                )}
                {team.founded && (
                  <InfoCard label="Founded" value={team.founded} color="#fbbf24" />
                )}
                {team.stadium?.name && (
                  <InfoCard label="Stadium" value={`${team.stadium.name}${team.stadium.capacity ? ` (${team.stadium.capacity.toLocaleString()} capacity)` : ''}`} color="#8b5cf6" />
                )}
                {team.currentManager?.name && (
                  <InfoCard label="Current Manager" value={team.currentManager.name} color="#10b981" />
                )}
                {team.currentCoach?.name && (
                  <InfoCard label="Current Coach" value={team.currentCoach.name} color="#f59e0b" />
                )}
                {team.coach && !team.currentManager && !team.currentCoach && (
                  <InfoCard label="Coach/Manager" value={team.coach} color="#10b981" />
                )}
              </>
            )}
          </div>
        )}
        
        {/* Player Specific Details */}
        {player && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.6s ease-out 0.5s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                ℹ️
              </div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>Player Details</h3>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '1rem',
            }}>
              {player.dateOfBirth && (
                <InfoCard label="Date of Birth" value={player.dateOfBirth} color="#10b981" />
              )}
              {player.height && (
                <InfoCard label="Height" value={player.height} color="#3b82f6" />
              )}
              {player.preferredFoot && (
                <InfoCard label="Preferred Foot" value={player.preferredFoot} color="#f59e0b" />
              )}
              {player.careerStats?.club?.totalGoals !== undefined && (
                <InfoCard label="Career Goals" value={player.careerStats.club.totalGoals} color="#ef4444" />
              )}
              {player.careerStats?.club?.totalAssists !== undefined && (
                <InfoCard label="Career Assists" value={player.careerStats.club.totalAssists} color="#8b5cf6" />
              )}
              {player.careerStats?.club?.totalAppearances !== undefined && (
                <InfoCard label="Career Appearances" value={player.careerStats.club.totalAppearances} color="#06b6d4" />
              )}
              {player.playingStyle && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Playing Style</div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '1rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.75rem',
                    borderLeft: '4px solid #fbbf24',
                  }}>
                    {player.playingStyle}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* World Cup Info */}
        {worldCupInfo && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.6s ease-out 0.3s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                🌍
              </div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                {worldCupInfo.year ? `World Cup ${worldCupInfo.year}` : "World Cup"}
              </h3>
            </div>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {worldCupInfo.host && (
                <InfoCard label="Host" value={worldCupInfo.host} color="#4ade80" />
              )}
              {worldCupInfo.defendingChampion && (
                <InfoCard label="Defending Champion" value={worldCupInfo.defendingChampion} color="#22d3ee" />
              )}
              {worldCupInfo.qualifiedTeams && (
                <InfoCard label="Qualified Teams" value={worldCupInfo.qualifiedTeams} color="#fbbf24" />
              )}
              {worldCupInfo.hostCities && worldCupInfo.hostCities.length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Host Cities</div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '1rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.75rem',
                    borderLeft: '4px solid #8b5cf6',
                  }}>
                    {worldCupInfo.hostCities.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default state - no data yet
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out',
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1.5rem',
        opacity: 0.8,
        animation: 'fadeIn 1s ease-out',
      }}>
        ⚽
      </div>
      <h3 style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        marginBottom: '1rem',
        color: 'white',
        background: 'linear-gradient(to right, #4ade80, #22d3ee)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        FootballAI Analysis
      </h3>
      <p style={{
        color: '#94a3b8',
        maxWidth: '500px',
        lineHeight: 1.7,
        fontSize: '1.125rem',
        marginBottom: '2rem',
      }}>
        Search for players, teams, or tournaments to get comprehensive AI-powered football analysis.
      </p>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '600px',
      }}>
        <FeatureBadge icon="🎯" text="Player Stats" color="#4ade80" />
        <FeatureBadge icon="🏆" text="Team Analysis" color="#fbbf24" />
        <FeatureBadge icon="🌍" text="World Cup" color="#3b82f6" />
        <FeatureBadge icon="🤖" text="AI Powered" color="#8b5cf6" />
        <FeatureBadge icon="📺" text="Video Highlights" color="#ef4444" />
        <FeatureBadge icon="🏟️" text="Stadium Info" color="#10b981" />
      </div>
    </div>
  );
}

// Helper function to render achievements summary
function renderAchievements(entity: any) {
  const { achievementsSummary } = entity;
  const isNationalTeam = entity.type === 'national';
  const isClub = entity.type === 'club';

  if (isNationalTeam) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem',
      }}>
        {achievementsSummary.worldCupTitles > 0 && (
          <AchievementCard 
            icon="🌍" 
            label="World Cup Titles" 
            value={achievementsSummary.worldCupTitles}
            color="#3b82f6"
          />
        )}
        {achievementsSummary.continentalTitles > 0 && (
          <AchievementCard 
            icon="🏆" 
            label="Continental Titles" 
            value={achievementsSummary.continentalTitles}
            color="#10b981"
          />
        )}
        {achievementsSummary.olympicTitles > 0 && (
          <AchievementCard 
            icon="🥇" 
            label="Olympic Titles" 
            value={achievementsSummary.olympicTitles}
            color="#f59e0b"
          />
        )}
      </div>
    );
  }

  if (isClub) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem',
      }}>
        {achievementsSummary.continentalTitles > 0 && (
          <AchievementCard 
            icon="⭐" 
            label="Continental Titles" 
            value={achievementsSummary.continentalTitles}
            color="#8b5cf6"
          />
        )}
        {achievementsSummary.internationalTitles > 0 && (
          <AchievementCard 
            icon="🌐" 
            label="International Titles" 
            value={achievementsSummary.internationalTitles}
            color="#3b82f6"
          />
        )}
        {achievementsSummary.domesticTitles?.leagues > 0 && (
          <AchievementCard 
            icon="🥇" 
            label="League Titles" 
            value={achievementsSummary.domesticTitles.leagues}
            color="#4ade80"
          />
        )}
        {achievementsSummary.domesticTitles?.cups > 0 && (
          <AchievementCard 
            icon="🏆" 
            label="Cup Titles" 
            value={achievementsSummary.domesticTitles.cups}
            color="#22d3ee"
          />
        )}
      </div>
    );
  }

  // Player achievements
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '1rem',
    }}>
      {achievementsSummary.worldCupTitles > 0 && (
        <AchievementCard 
          icon="🌍" 
          label="World Cup Titles" 
          value={achievementsSummary.worldCupTitles}
          color="#3b82f6"
        />
      )}
      {achievementsSummary.continentalTitles > 0 && (
        <AchievementCard 
          icon="🏆" 
          label="Continental Titles" 
          value={achievementsSummary.continentalTitles}
          color="#10b981"
        />
      )}
      {achievementsSummary.clubDomesticTitles?.leagues > 0 && (
        <AchievementCard 
          icon="🥇" 
          label="League Titles" 
          value={achievementsSummary.clubDomesticTitles.leagues}
          color="#4ade80"
        />
      )}
      {achievementsSummary.individualAwards && achievementsSummary.individualAwards.length > 0 && (
        <div style={{
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0.75rem',
          border: `1px solid #f59e0b30`,
          textAlign: 'center',
          gridColumn: '1 / -1',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏅</div>
          <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Individual Awards
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {achievementsSummary.individualAwards.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
