interface FootballAIProps {
  player: any;
  team: any;
  isLoading: boolean;
}

export default function FootballAI({ player, team, isLoading }: FootballAIProps) {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(74, 222, 128, 0.3)',
          borderTopColor: '#4ade80',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
          Analyzing football data...
        </p>
      </div>
    );
  }

  if (player) {
    return (
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
          {player.name}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Position</div>
            <div style={{ color: 'white', fontWeight: 600 }}>{player.position}</div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Nationality</div>
            <div style={{ color: 'white', fontWeight: 600 }}>{player.nationality}</div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Club</div>
            <div style={{ color: 'white', fontWeight: 600 }}>{player.club}</div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Age</div>
            <div style={{ color: 'white', fontWeight: 600 }}>{player.age}</div>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(to right, rgba(74, 222, 128, 0.1), rgba(34, 211, 238, 0.1))',
          padding: '1.5rem',
          borderRadius: '1rem',
          marginTop: '2rem',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>Career Stats</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80' }}>{player.goals}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Goals</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee' }}>{player.assists}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Assists</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24' }}>{player.appearances}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Apps</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1.5rem',
        opacity: 0.7,
      }}>
        ⚽
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: 'white',
      }}>
        FutbolAI Analysis
      </h3>
      <p style={{
        color: '#94a3b8',
        maxWidth: '400px',
        lineHeight: 1.6,
      }}>
        Search for a player or team above to get AI-powered football analysis,
        stats, and insights. Powered by Reyes Alamo expertise.
      </p>
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#4ade80',
        }}>
          World Cup 2026
        </span>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(34, 211, 238, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#22d3ee',
        }}>
          Player Stats
        </span>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#fbbf24',
        }}>
          Team Analysis
        </span>
      </div>
    </div>
  );
}