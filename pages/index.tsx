import { useState } from 'react';
import FootballSearch from '../components/FootballSearch';
import FootballAI from '../components/FootballAI';

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [teams, setTeams] = useState<any[]>([]);
  const [worldCupInfo, setWorldCupInfo] = useState<any>(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: `
        /* Football pitch green */
        linear-gradient(135deg, #0a3e1a 0%, #1a6c36 25%, #0a3e1a 50%, #1a6c36 75%, #0a3e1a 100%),
        /* Pitch markings - center line */
        linear-gradient(to right, 
          transparent 49.5%, 
          rgba(255, 255, 255, 0.3) 49.5%, 
          rgba(255, 255, 255, 0.3) 50.5%, 
          transparent 50.5%
        ),
        /* Pitch markings - halfway line */
        linear-gradient(to bottom, 
          transparent 49.5%, 
          rgba(255, 255, 255, 0.3) 49.5%, 
          rgba(255, 255, 255, 0.3) 50.5%, 
          transparent 50.5%
        ),
        /* Center circle */
        radial-gradient(
          circle at 50% 50%,
          transparent 45%,
          rgba(255, 255, 255, 0.2) 45.5%,
          rgba(255, 255, 255, 0.2) 46.5%,
          transparent 47%
        ),
        /* Grass texture */
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 98px,
          rgba(0, 0, 0, 0.05) 98px,
          rgba(0, 0, 0, 0.05) 100px
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 98px,
          rgba(0, 0, 0, 0.05) 98px,
          rgba(0, 0, 0, 0.05) 100px
        )
      `,
      backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100px 100px, 100px 100px',
      color: 'white',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative' as const,
      overflow: 'hidden',
    },
    pitchOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 30%, rgba(74, 222, 128, 0.1) 0%, transparent 50%),
                   radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)`,
      pointerEvents: 'none' as const,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative' as const,
      zIndex: 2,
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: 800,
      marginBottom: '1rem',
      background: 'linear-gradient(to right, #4ade80, #ffffff, #22d3ee)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    },
    subtitle: {
      color: '#e2e8f0',
      fontSize: '1.25rem',
      lineHeight: 1.6,
      opacity: 0.95,
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '1rem',
      borderRadius: '1rem',
      display: 'inline-block',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 2,
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    searchContainer: {
      background: 'rgba(10, 30, 10, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(74, 222, 128, 0.3)',
      border: '2px solid rgba(74, 222, 128, 0.5)',
    },
    aiContainer: {
      background: 'rgba(10, 30, 10, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(34, 211, 238, 0.3)',
      border: '2px solid rgba(34, 211, 238, 0.5)',
      minHeight: '500px',
    },
    videoSection: {
      background: 'rgba(10, 30, 10, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(251, 191, 36, 0.3)',
      border: '2px solid rgba(251, 191, 36, 0.5)',
      marginTop: '2rem',
    },
    videoHeader: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'linear-gradient(to right, #4ade80, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    videoContainer: {
      position: 'relative' as const,
      width: '100%',
      paddingBottom: '56.25%',
      borderRadius: '1rem',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.3)',
      marginBottom: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
    },
    iframe: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none',
    },
    noVideo: {
      padding: '4rem 2rem',
      textAlign: 'center' as const,
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '1rem',
      border: '2px dashed rgba(74, 222, 128, 0.5)',
    },
    placeholderIcon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      opacity: 0.8,
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
    },
    placeholderText: {
      color: '#e2e8f0',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    placeholderSubtext: {
      color: '#cbd5e1',
      fontSize: '1rem',
      marginTop: '0.75rem',
    },
    videoNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: '#e2e8f0',
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(74, 222, 128, 0.3)',
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '1rem',
      zIndex: 10,
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(74, 222, 128, 0.3)',
      borderTopColor: '#4ade80',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    footer: {
      marginTop: '4rem',
      paddingTop: '2rem',
      borderTop: '2px solid rgba(74, 222, 128, 0.3)',
      position: 'relative' as const,
      zIndex: 2,
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1.5rem',
    },
    footerContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
      width: '100%',
    },
    attribution: {
      textAlign: 'center' as const,
      padding: '0 1rem',
    },
    developer: {
      fontSize: '1rem',
      color: '#e2e8f0',
      marginBottom: '0.5rem',
    },
    developerName: {
      fontWeight: 600,
      color: '#ffffff',
      background: 'linear-gradient(to right, #4ade80, #22d3ee)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    copyright: {
      fontSize: '0.875rem',
      color: '#cbd5e1',
    },
    disclaimerContainer: {
      maxWidth: '600px',
      textAlign: 'center' as const,
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(74, 222, 128, 0.3)',
    },
    disclaimerTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#4ade80',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    disclaimerText: {
      fontSize: '0.75rem',
      color: '#cbd5e1',
      lineHeight: 1.5,
    },
    separator: {
      height: '2px',
      width: '80px',
      background: 'linear-gradient(to right, transparent, #4ade80, transparent)',
      margin: '0.5rem 0',
    },
  };

  return (
    <div style={styles.container}>
      {/* Football pitch overlay */}
      <div style={styles.pitchOverlay}></div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        .glow {
          box-shadow: 0 0 30px rgba(74, 222, 128, 0.4);
        }
        
        .glow:hover {
          box-shadow: 0 0 40px rgba(74, 222, 128, 0.6);
          transition: box-shadow 0.3s ease;
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <header style={styles.header}>
          <h1 style={styles.title}>⚽ FutbolAI - Football Intelligence</h1>
          <p style={styles.subtitle}>
            AI-powered football insights with guaranteed correct categorization
            <br />
            <strong style={{ color: '#4ade80' }}>NO MORE MIXED DATA!</strong>
          </p>
        </header>

        <div style={styles.mainGrid}>
          <div style={styles.topSection}>
            <div style={styles.searchContainer} className="glow">
              <FootballSearch
                onPlayerSelect={setSelectedPlayer}
                onTeamSelect={setSelectedTeam}
                onVideoFound={setVideoUrl}
                onLoadingChange={setIsLoading}
                onAnalysisUpdate={setAnalysis}
                onTeamsUpdate={setTeams}
                onWorldCupUpdate={setWorldCupInfo}
              />
            </div>
            
            <div style={styles.aiContainer} className="glow">
              <FootballAI
                player={selectedPlayer}
                team={selectedTeam}
                isLoading={isLoading}
                analysis={analysis}
                teams={teams}
                worldCupInfo={worldCupInfo}
              />
            </div>
          </div>

          <div style={styles.videoSection} className="glow">
            <div style={styles.videoHeader}>
              <span className="float">📺</span>
              <span>Football Highlights</span>
            </div>
            
            {isLoading ? (
              <div style={{ position: 'relative', minHeight: '200px' }}>
                <div style={styles.videoContainer}>
                  <div style={styles.loadingOverlay}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{ marginLeft: '1rem', color: '#4ade80' }}>Loading highlights...</p>
                  </div>
                </div>
              </div>
            ) : videoUrl ? (
              <>
                <div style={styles.videoContainer}>
                  <iframe
                    src={videoUrl}
                    title="Football Highlights"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={styles.iframe}
                  ></iframe>
                </div>
                <div style={styles.videoNote}>
                  <span>🔊</span>
                  <span>Click fullscreen for best viewing experience</span>
                </div>
              </>
            ) : selectedPlayer || selectedTeam ? (
              <div style={styles.noVideo}>
                <div style={styles.placeholderIcon}>📺</div>
                <p style={styles.placeholderText}>
                  No highlights available
                </p>
                <p style={styles.placeholderSubtext}>
                  Try searching for another player or team
                </p>
              </div>
            ) : (
              <div style={styles.noVideo}>
                <div style={styles.placeholderIcon}>⚽</div>
                <p style={styles.placeholderText}>
                  Search for a player or team above to see highlights
                </p>
                <p style={styles.placeholderSubtext}>
                  Video highlights will appear here
                </p>
              </div>
            )}
          </div>
          
          <div style={styles.footer}>
            <div style={styles.footerContainer}>
              <div style={styles.footerContent}>
                <div style={styles.attribution}>
                  <p style={styles.developer}>
                    Developed by <span style={styles.developerName}>A. Guillen</span>
                  </p>
                  <div style={styles.separator}></div>
                  <p style={styles.copyright}>
                    © 2025 FutbolAI.org | Hardcoded country data active
                  </p>
                </div>
                
                <div style={styles.disclaimerContainer}>
                  <div style={styles.disclaimerTitle}>
                    <span>✅</span>
                    <span>Fixed: No More Mixed Data</span>
                  </div>
                  <p style={styles.disclaimerText}>
                    Countries now show team data only. Players show player data only.
                    Using hardcoded responses for countries to guarantee accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}