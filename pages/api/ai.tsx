import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from 'groq-sdk';

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required. Add it in Vercel environment variables.');
  }
  return new Groq({ apiKey });
}

// Enhanced prompts for comprehensive football data
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst with access to comprehensive football databases. Analyze: "${query}"

DETERMINE if this is about:
1. A PLAYER (individual footballer) - return playerInfo
2. A TEAM (club or national team) - return teamInfo  
3. WORLD CUP - return worldCupInfo
4. GENERAL - return only analysis

IMPORTANT: Return ONLY valid JSON with ONE of these structures:

FOR PLAYER - COMPREHENSIVE DATA:
{
  "playerInfo": {
    "name": "Full name",
    "fullName": "Complete legal name",
    "dateOfBirth": "YYYY-MM-DD",
    "age": "Current age",
    "nationality": "Primary nationality",
    "otherNationalities": ["List if any"],
    "height": "Height in meters/cm",
    "weight": "Weight in kg",
    "preferredFoot": "Left/Right/Both",
    
    // Position and roles
    "position": "Primary position (Forward/Midfielder/Defender/Goalkeeper)",
    "positions": ["Primary", "Secondary positions if any"],
    "playingStyle": "Technical description",
    "playerType": "e.g., Playmaker, Winger, Target Man, etc.",
    
    // Current status
    "currentClub": "Current team",
    "clubNumber": "Current squad number",
    "marketValue": "Current estimated value with currency",
    "contractExpires": "Contract end date if known",
    
    // Career statistics (club)
    "careerStats": {
      "club": {
        "totalGoals": "Number",
        "totalAssists": "Number",
        "totalAppearances": "Number",
        "goalsPerMatch": "Ratio",
        "assistsPerMatch": "Ratio"
      },
      "international": {
        "caps": "Number of appearances",
        "goals": "Number of goals",
        "debut": "Date of international debut",
        "majorTournaments": ["World Cup", "Euro", "Copa America", etc.]
      }
    },
    
    // Club career timeline
    "clubCareer": [
      {
        "club": "Club name",
        "period": "Years",
        "appearances": "Number",
        "goals": "Number",
        "assists": "Number",
        "transferFee": "If notable"
      }
    ],
    
    // International career
    "internationalCareer": {
      "nationalTeam": "Country",
      "debut": "Date",
      "lastMatch": "Most recent appearance",
      "tournamentAppearances": [
        {"tournament": "World Cup 2022", "apps": 7, "goals": 7, "assists": 3},
        {"tournament": "Copa America 2021", "apps": 7, "goals": 4, "assists": 5}
      ]
    },
    
    // Honors and achievements
    "individualAwards": [
      "Ballon d'Or (Years)",
      "Golden Boot (Years)",
      "Player of the Year awards",
      "Other individual honors"
    ],
    
    "teamHonors": [
      {
        "competition": "Champions League",
        "wins": 4,
        "years": [2006, 2009, 2011, 2015]
      },
      {
        "competition": "League Title",
        "wins": 10,
        "years": [2005, 2006, 2009, 2010, 2011, 2013, 2015, 2016, 2018, 2019]
      }
    ],
    
    // Playing characteristics
    "strengths": ["Dribbling", "Vision", "Finishing", "Free kicks"],
    "weaknesses": ["Defensive contribution", "Aerial duels"],
    "notableSkills": ["La Pulga dribbling", "Curling shots", "Precise passing"],
    
    // Records and milestones
    "records": [
      "All-time top scorer for Barcelona",
      "Most Ballon d'Or awards (7)",
      "Most goals in a calendar year (91)"
    ],
    
    // Current season stats (2023-2024)
    "currentSeason": {
      "clubAppearances": 20,
      "clubGoals": 15,
      "clubAssists": 8,
      "intlAppearances": 5,
      "intlGoals": 3,
      "intlAssists": 2
    },
    
    // Transfer history
    "transferHistory": [
      {"from": "Barcelona", "to": "PSG", "year": 2021, "fee": "Free transfer"},
      {"from": "PSG", "to": "Inter Miami", "year": 2023, "fee": "Free transfer"}
    ]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the player...",
  "videoSearchTerm": "Player name highlights 2024",
  "confidenceScore": 0.95
}

FOR CLUB TEAM - COMPREHENSIVE DATA:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Full club name",
    "nicknames": ["Common nicknames"],
    "type": "club",
    "founded": 1902,
    "location": {
      "city": "City",
      "country": "Country",
      "stadiumLocation": "District/Area"
    },
    
    // Stadium information
    "stadium": {
      "name": "Stadium name",
      "nickname": "Stadium nickname",
      "capacity": "Seating capacity",
      "dimensions": "Pitch dimensions",
      "opened": "Year opened",
      "recordAttendance": "Highest attendance",
      "features": ["Retractable roof", "Heated pitch", "Museum"]
    },
    
    // Club identity
    "colors": ["Primary color", "Secondary color"],
    "motto": "Club motto if any",
    "anthem": "Club anthem",
    
    // Management
    "owner": "Owner/ownership group",
    "chairman": "Current chairman",
    "directorFootball": "Sporting director",
    "currentManager": {
      "name": "Manager name",
      "nationality": "Manager nationality",
      "appointed": "Date appointed",
      "contractUntil": "Contract end"
    },
    
    // Squad information
    "currentSquad": {
      "keyPlayers": [
        {"name": "Player 1", "position": "Position", "nationality": "Country", "value": "Market value"},
        {"name": "Player 2", "position": "Position", "nationality": "Country", "value": "Market value"}
      ],
      "captain": "Captain name",
      "viceCaptain": "Vice captain if any",
      "averageAge": "Squad average age",
      "foreignPlayers": "Number of non-domestic players"
    },
    
    // Competitions
    "league": "Primary league",
    "domesticCups": ["Cup competitions participated in"],
    "europeanCompetition": "Current European competition",
    
    // Rivalries
    "mainRivalries": [
      {
        "rival": "Rival club name",
        "derbyName": "Name of derby",
        "firstMeeting": "Year of first match",
        "totalMatches": "Number of meetings",
        "record": "Wins-Draws-Losses record"
      }
    ],
    
    // Honors and achievements
    "trophies": {
      "domestic": [
        {"competition": "League Title", "wins": 35, "lastWin": 2022},
        {"competition": "Domestic Cup", "wins": 20, "lastWin": 2023}
      ],
      "continental": [
        {"competition": "UEFA Champions League", "wins": 14, "lastWin": 2022},
        {"competition": "Europa League", "wins": 2, "lastWin": 2023}
      ],
      "worldwide": [
        {"competition": "FIFA Club World Cup", "wins": 5, "lastWin": 2022}
      ]
    },
    
    // Records
    "records": [
      "Most consecutive league wins",
      "Biggest victory",
      "Highest scorer all-time",
      "Most appearances"
    ],
    
    // Financial information
    "financials": {
      "estimatedValue": "Club valuation",
      "annualRevenue": "Annual revenue",
      "sponsors": ["Main sponsors"],
      "kitManufacturer": "Kit manufacturer"
    },
    
    // Youth development
    "academy": {
      "name": "Youth academy name",
      "notableGraduates": ["List of famous academy products"],
      "facilities": "Training ground facilities"
    },
    
    // Current season (2023-2024)
    "currentSeason": {
      "leaguePosition": "Current league position",
      "matchesPlayed": "Number of matches",
      "wins": "Wins",
      "draws": "Draws",
      "losses": "Losses",
      "goalsFor": "Goals scored",
      "goalsAgainst": "Goals conceded",
      "points": "League points",
      "topScorer": "Current top scorer"
    }
  },
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the club...",
  "videoSearchTerm": "Club name highlights 2024",
  "confidenceScore": 0.95
}

FOR NATIONAL TEAM - COMPREHENSIVE DATA:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Country name",
    "nicknames": ["National team nicknames"],
    "type": "national",
    "fifaCode": "FIFA 3-letter code",
    "confederation": "UEFA/CONMEBOL/CONCACAF/AFC/CAF/OFC",
    
    // Location and demographics
    "country": {
      "capital": "Capital city",
      "population": "Approximate population",
      "language": "Official language(s)",
      "footballAssociation": "Name of FA"
    },
    
    // FIFA rankings
    "fifaRanking": {
      "current": "Current FIFA ranking position",
      "highest": "Highest ever ranking",
      "lowest": "Lowest ever ranking",
      "rankingPoints": "Current FIFA points"
    },
    
    // Stadium
    "homeStadium": {
      "name": "Primary home stadium",
      "city": "Stadium city",
      "capacity": "Stadium capacity",
      "alternativeStadiums": ["Other stadiums used"]
    },
    
    // Management
    "currentCoach": {
      "name": "Coach name",
      "nationality": "Coach nationality",
      "appointed": "Date appointed",
      "previousJob": "Previous role"
    },
    
    // Current squad
    "currentSquad": {
      "captain": "Team captain",
      "viceCaptain": "Vice captain",
      "keyPlayers": [
        {"name": "Player 1", "position": "Position", "club": "Current club"},
        {"name": "Player 2", "position": "Position", "club": "Current club"}
      ],
      "averageAge": "Squad average age",
      "foreignBased": "Number of players based abroad"
    },
    
    // Rivalries
    "mainRivalries": [
      {
        "rival": "Rival country",
        "matchesPlayed": "Total matches",
        "record": "Wins-Draws-Losses",
        "lastMeeting": "Date of last match",
        "notableMatch": "Most famous encounter"
      }
    ],
    
    // World Cup record
    "worldCup": {
      "appearances": "Number of World Cup participations",
      "bestResult": "Best achievement",
      "firstAppearance": "Year of first appearance",
      "lastAppearance": "Most recent appearance",
      "totalMatches": "Total World Cup matches played",
      "wins": "World Cup wins",
      "draws": "Draws",
      "losses": "Losses"
    },
    
    // Continental championships
    "continentalCup": {
      "competition": "Euro/Copa America/AFCON etc.",
      "appearances": "Number of appearances",
      "titles": "Number of titles won",
      "lastTitle": "Year of last title",
      "bestResult": "Best performance"
    },
    
    // Honors
    "majorHonors": [
      {"competition": "FIFA World Cup", "titles": 3, "years": [1958, 1962, 1970, 1994, 2002]},
      {"competition": "Copa America", "titles": 9, "years": [1919, 1922, 1949, 1989, 1997, 1999, 2004, 2007, 2019]}
    ],
    
    // Records
    "records": {
      "mostCaps": {"player": "Player name", "caps": "Number of appearances"},
      "topScorer": {"player": "Player name", "goals": "Number of goals"},
      "biggestWin": {"score": "Result", "opponent": "Opponent", "year": "Year"},
      "biggestDefeat": {"score": "Result", "opponent": "Opponent", "year": "Year"}
    },
    
    // Playing style
    "playingStyle": "Traditional style of play",
    "formation": "Preferred formation",
    
    // Recent performance
    "recentForm": {
      "last5Matches": ["Result1", "Result2", "Result3", "Result4", "Result5"],
      "qualificationStatus": "Qualified/Eliminated/In progress",
      "nextMatches": ["Upcoming fixtures"]
    }
  },
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the national team...",
  "videoSearchTerm": "Country name national team highlights 2024",
  "confidenceScore": 0.95
}

FOR WORLD CUP - COMPREHENSIVE DATA:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "edition": "23rd FIFA World Cup",
    "host": "USA, Canada, Mexico",
    "hostCities": ["List of host cities"],
    
    // Tournament format
    "format": {
      "teams": 48,
      "groups": 12,
      "teamsPerGroup": 4,
      "qualifyingSpots": {
        "UEFA": 16,
        "AFC": 8,
        "CAF": 9,
        "CONCACAF": 6,
        "CONMEBOL": 6,
        "OFC": 1
      }
    },
    
    // Venues
    "venues": [
      {
        "name": "MetLife Stadium",
        "city": "East Rutherford, New Jersey",
        "capacity": "82,500",
        "matches": ["Opening match", "Final"]
      }
    ],
    
    // Qualified teams
    "qualifiedTeams": [
      {"country": "USA", "method": "Host", "appearances": "11th"},
      {"country": "Canada", "method": "Host", "appearances": "3rd"},
      {"country": "Mexico", "method": "Host", "appearances": "18th"}
    ],
    
    // Schedule
    "schedule": {
      "openingMatch": "June 11, 2026",
      "groupStage": "June 11 - June 26, 2026",
      "knockoutStage": "June 27 - July 19, 2026",
      "final": "July 19, 2026"
    },
    
    // Broadcasting
    "broadcasters": ["List of major broadcasters"],
    "prizeMoney": "Total prize fund",
    
    // Historical context
    "previousHosts": ["Last 5 hosts"],
    "defendingChampion": "Argentina",
    "mostTitles": {"country": "Brazil", "titles": 5}
  },
  "analysis": "Comprehensive analysis of the World Cup...",
  "videoSearchTerm": "World Cup 2026",
  "confidenceScore": 0.95
}

FOR GENERAL QUERIES:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the football topic...",
  "videoSearchTerm": "football highlights 2024",
  "confidenceScore": 0.8
}

IMPORTANT GUIDELINES:
1. Fill as many fields as possible with accurate, current information
2. Use real statistics and data from reliable sources
3. For current season stats, use 2023-2024 season data
4. Include both historical and current information
5. Be specific with numbers and dates
6. If certain information is not available, use null or omit the field

Return ONLY the JSON object, no extra text or explanations.`;

  try {
    console.log('🚀 Calling Groq with enhanced comprehensive prompts');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2500,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response length:', content.length);
    
    // Clean the response (remove any markdown formatting)
    const cleanContent = content.replace(/```json\s*|\```/g, '').trim();
    
    // Try to parse
    const parsed = JSON.parse(cleanContent);
    console.log('✅ Enhanced JSON parsed successfully');
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    // If JSON parsing fails, return a structured error
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `Could not retrieve comprehensive data for "${query}". Please try again.`,
      videoSearchTerm: query + " football",
      confidenceScore: 0.1,
      error: error.message
    };
  }
}

// Search YouTube for relevant videos (unchanged)
async function searchYouTube(searchTerm: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('YouTube API key not set, using fallback');
      return generateFallbackVideoUrl(searchTerm);
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${searchTerm} football highlights`,
        type: 'video',
        maxResults: 1,
        key: apiKey,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
      },
    });

    if (response.data.items?.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error('YouTube search error:', error);
  }
  
  return generateFallbackVideoUrl(searchTerm);
}

// Generate fallback video URL (unchanged)
function generateFallbackVideoUrl(query: string) {
  const queryLower = query.toLowerCase();
  
  const videoMap: Record<string, string> = {
    // Players
    'messi': 'https://www.youtube.com/embed/ZO0d8r_2qGI',
    'ronaldo': 'https://www.youtube.com/embed/OUKGsb8CpF8',
    'mbappe': 'https://www.youtube.com/embed/RdGpDPLT5Q4',
    'haaland': 'https://www.youtube.com/embed/4XqQpQ8KZg4',
    'neymar': 'https://www.youtube.com/embed/FIYzK8PSLpA',
    'benzema': 'https://www.youtube.com/embed/6kl7AOKVpCM',
    'carvajal': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    
    // Teams
    'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
    'manchester city': 'https://www.youtube.com/embed/KXwHEvDE2-U',
    'liverpool': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'brazil': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'spain': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    
    // World Cup
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
    'world cup 2026': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
    'fifa world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
  };

  for (const [key, url] of Object.entries(videoMap)) {
    if (queryLower.includes(key)) {
      return url;
    }
  }

  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}

// Main API handler (unchanged)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, query } = req.query;

  if (action === 'search' && query && typeof query === 'string') {
    console.log(`\n=== ENHANCED REQUEST: "${query}" ===`);
    
    try {
      // Try AI analysis with enhanced prompts
      const aiAnalysis = await analyzeFootballQuery(query);
      console.log('✅ Enhanced AI Analysis SUCCESS');
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`📊 Response type: ${responseType}`);
      
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      const youtubeUrl = await searchYouTube(searchTerm);
      
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        type: responseType,
        data: aiAnalysis.playerInfo || aiAnalysis.teamInfo || aiAnalysis.worldCupInfo || null,
        playerInfo: aiAnalysis.playerInfo || null,
        teamInfo: aiAnalysis.teamInfo || null,
        worldCupInfo: aiAnalysis.worldCupInfo || null,
        youtubeUrl: youtubeUrl,
        analysis: aiAnalysis.analysis || `Comprehensive analysis of ${query}`,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI - Enhanced Model',
        debug: 'AI_ENHANCED_SUCCESS',
        dataCompleteness: aiAnalysis.playerInfo || aiAnalysis.teamInfo || aiAnalysis.worldCupInfo ? 'HIGH' : 'LOW'
      };

      console.log('📤 Sending enhanced response:', { 
        type: responseType,
        hasPlayer: !!aiAnalysis.playerInfo,
        hasTeam: !!aiAnalysis.teamInfo,
        hasWorldCup: !!aiAnalysis.worldCupInfo,
        dataCompleteness: response.dataCompleteness
      });
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      // Return fallback response
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process enhanced query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not retrieve comprehensive data for "${query}". Please try a different search.`,
        debug: 'ENHANCED_AI_FAILED'
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI Enhanced API is running! 🏆',
    version: '3.0',
    features: 'Comprehensive football data including detailed player stats, club info, national team data',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=Brazil%20national%20team',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}