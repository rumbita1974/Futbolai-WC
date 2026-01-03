/**
 * Service for fetching current football data from reliable APIs
 * Combines multiple sources for the most accurate, up-to-date information
 */

// Current season year
const CURRENT_SEASON = new Date().getFullYear();

// Football-data.org API (free tier with rate limits)
const FOOTBALL_DATA_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY || '';
const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';

// Alternative: API-Football (rapidapi.com) or Sportmonks API

export interface CurrentTeamData {
  name: string;
  country: string;
  stadium?: string;
  currentCoach: string;
  coachNationality?: string;
  coachSince?: string;
  foundedYear?: number;
  currentCompetitions: string[];
  squadSize?: number;
  marketValue?: string;
  lastUpdated: string;
}

export interface CurrentPlayerData {
  name: string;
  currentTeam: string;
  position: string;
  nationality: string;
  dateOfBirth?: string;
  age?: number;
  height?: string;
  marketValue?: string;
  shirtNumber?: number;
  contractUntil?: string;
  lastUpdated: string;
}

export interface TeamAchievement {
  competition: string;
  seasons: string[];
  count: number;
}

/**
 * Get current team data from football-data.org
 */
export const getCurrentTeamData = async (teamName: string): Promise<CurrentTeamData | null> => {
  if (!FOOTBALL_DATA_API_KEY) {
    console.warn('Football-data.org API key not configured');
    return null;
  }

  try {
    // First, search for the team
    const searchResponse = await fetch(
      `${FOOTBALL_DATA_BASE}/teams?name=${encodeURIComponent(teamName)}`,
      {
        headers: {
          'X-Auth-Token': FOOTBALL_DATA_API_KEY
        }
      }
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();
    
    if (!searchData.teams || searchData.teams.length === 0) {
      // Try alternative search
      const altResponse = await fetch(
        `${FOOTBALL_DATA_BASE}/teams`,
        {
          headers: {
            'X-Auth-Token': FOOTBALL_DATA_API_KEY
          }
        }
      );
      
      if (!altResponse.ok) return null;
      
      const allTeams = await altResponse.json();
      const matchedTeam = allTeams.teams?.find((team: any) => 
        team.name.toLowerCase().includes(teamName.toLowerCase()) ||
        team.shortName.toLowerCase().includes(teamName.toLowerCase())
      );
      
      if (!matchedTeam) return null;
      
      return formatTeamData(matchedTeam);
    }

    const team = searchData.teams[0];
    return formatTeamData(team);

  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
};

/**
 * Format team data from API response
 */
const formatTeamData = (teamData: any): CurrentTeamData => {
  return {
    name: teamData.name,
    country: teamData.area?.name || 'Unknown',
    stadium: teamData.venue,
    currentCoach: teamData.coach?.name || 'Unknown',
    coachNationality: teamData.coach?.nationality,
    coachSince: teamData.coach?.contract?.start,
    foundedYear: teamData.founded,
    currentCompetitions: teamData.runningCompetitions?.map((comp: any) => comp.name) || [],
    squadSize: teamData.squad?.length,
    marketValue: teamData.squad?.reduce((total: number, player: any) => total + (player.marketValue || 0), 0)?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Fallback: Use Wikipedia for current coach information
 */
export const getCoachInfoFromWikipedia = async (teamName: string): Promise<{ coach: string; coachInfo?: string } | null> => {
  try {
    // This is a simplified version - you'd need to parse Wikipedia properly
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName + " (football club)")}`
    );
    
    if (!response.ok) {
      // Try without suffix
      const altResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName)}`
      );
      if (!altResponse.ok) return null;
      
      const data = await altResponse.json();
      const summary = data.extract || '';
      
      // Extract coach info from summary (simplistic approach)
      const coachMatch = summary.match(/manager is (.+?)(\.|,|$)/i) || 
                        summary.match(/coach is (.+?)(\.|,|$)/i) ||
                        summary.match(/head coach is (.+?)(\.|,|$)/i);
      
      if (coachMatch) {
        return {
          coach: coachMatch[1],
          coachInfo: summary.substring(0, 200) + '...'
        };
      }
      
      return null;
    }
    
    const data = await response.json();
    const summary = data.extract || '';
    
    const coachMatch = summary.match(/manager is (.+?)(\.|,|$)/i) || 
                      summary.match(/coach is (.+?)(\.|,|$)/i) ||
                      summary.match(/head coach is (.+?)(\.|,|$)/i);
    
    if (coachMatch) {
      return {
        coach: coachMatch[1],
        coachInfo: summary.substring(0, 200) + '...'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Wikipedia coach info:', error);
    return null;
  }
};

/**
 * Combine GROQ data with current real-time data
 */
export const enhanceGROQDataWithCurrentInfo = async (
  groqData: any,
  query: string
): Promise<any> => {
  const enhancedData = { ...groqData };
  
  try {
    // If we have team data from GROQ, enhance it with current info
    if (enhancedData.teams && enhancedData.teams.length > 0) {
      const team = enhancedData.teams[0];
      
      // Try to get current data from football-data.org
      const currentTeamData = await getCurrentTeamData(team.name);
      
      if (currentTeamData) {
        // Update with current information
        enhancedData.teams[0] = {
          ...team,
          currentCoach: currentTeamData.currentCoach,
          stadium: currentTeamData.stadium || team.stadium,
          // Add current season context
          currentSeason: CURRENT_SEASON,
          lastUpdated: currentTeamData.lastUpdated,
          _source: 'GROQ + Football-data.org API'
        };
      } else {
        // Fallback to Wikipedia for coach info
        const wikiCoachInfo = await getCoachInfoFromWikipedia(team.name);
        if (wikiCoachInfo) {
          enhancedData.teams[0] = {
            ...team,
            currentCoach: wikiCoachInfo.coach,
            _source: 'GROQ + Wikipedia',
            _note: 'Coach information from Wikipedia'
          };
        } else {
          // Add a note that data might be outdated
          enhancedData.teams[0] = {
            ...team,
            _note: 'Coach information may be outdated. Last updated in training data.',
            _dataCurrency: 'Check official sources for current information'
          };
        }
      }
    }
    
    // Add data currency disclaimer
    if (!enhancedData.disclaimer) {
      enhancedData.disclaimer = 'Some information may be outdated. For the most current data, check official team websites.';
    }
    
    return enhancedData;
    
  } catch (error) {
    console.error('Error enhancing GROQ data:', error);
    return groqData; // Return original data if enhancement fails
  }
};

/**
 * Get current season achievements (simplified - would need proper API)
 */
export const getCurrentSeasonStandings = async (teamName: string): Promise<string[]> => {
  // This would need integration with a standings API
  // For now, return empty or placeholder
  return [
    `Current season: ${CURRENT_SEASON}/${CURRENT_SEASON + 1}`,
    'Check official league websites for current standings'
  ];
};

export default {
  getCurrentTeamData,
  getCoachInfoFromWikipedia,
  enhanceGROQDataWithCurrentInfo,
  getCurrentSeasonStandings
};