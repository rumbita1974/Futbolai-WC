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

// Use Groq to analyze query and generate football insights
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst. Analyze: "${query}"

DETERMINE if this is about:
1. A PLAYER (individual footballer) - return playerInfo
2. A TEAM (club or national team) - return teamInfo  
3. WORLD CUP - return worldCupInfo
4. GENERAL - return only analysis

IMPORTANT EXAMPLES:
- "Messi" → PLAYER
- "lionel messi" → PLAYER
- "karim benzema" → PLAYER
- "dani carvajal" → PLAYER
- "carvajal" → PLAYER
- "modric" → PLAYER
- "real madrid" → TEAM
- "manchester city" → TEAM
- "argentina" → TEAM
- "brazil national team" → TEAM
- "world cup 2026" → WORLD CUP
- "fifa world cup" → WORLD CUP
- "world cup" → WORLD CUP
- "best football players" → GENERAL
- "top strikers" → GENERAL

Return ONLY valid JSON with ONE of these structures:

FOR PLAYER - WITH ENHANCED INFO:
{
  "playerInfo": {
    "name": "Full name",
    "position": "Position (Forward/Midfielder/Defender/Goalkeeper)",
    "nationality": "Nationality",
    "currentClub": "Current club",
    "previousClubs": ["List notable previous clubs"],
    "dateOfBirth": "Date of birth if known",
    "height": "Height if known",
    
    // Enhanced stats
    "stats": {
      "careerGoals": "Total career goals",
      "careerAssists": "Total career assists",
      "careerAppearances": "Total career appearances",
      "internationalCaps": "International appearances",
      "internationalGoals": "International goals",
      "currentSeasonGoals": "Current season goals if known",
      "currentSeasonAssists": "Current season assists if known"
    },
    
    "marketValue": "Current market value",
    "achievements": ["List major achievements/trophies"],
    "playingStyle": "Brief description of playing style",
    "strongFoot": "Preferred foot (Right/Left/Both)"
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the player...",
  "videoSearchTerm": "[Player Name] highlights 2024 latest goals skills recent matches",
  "confidenceScore": 0.95
}

FOR TEAM - WITH ENHANCED INFO:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Team name",
    "type": "club or national",
    "location": "City/Country",
    "stadium": "Home stadium name",
    "stadiumCapacity": "Stadium capacity if known",
    "founded": "Year founded",
    "managerCoach": "Current manager/coach",
    "league": "Current league",
    
    // Enhanced info
    "trophies": {
      "domestic": ["List domestic trophies"],
      "continental": ["List continental trophies"],
      "worldwide": ["List worldwide trophies"]
    },
    
    "currentRanking": "Current ranking/position",
    "keyPlayers": ["List key current players"],
    "mainRivalries": ["List main rival teams"],
    "notableAchievements": ["List historical achievements"],
    "clubValue": "Estimated club value if known"
  },
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the team...",
  "videoSearchTerm": "[Team Name] highlights 2024 recent matches goals latest",
  "confidenceScore": 0.95
}

FOR NATIONAL TEAM - WITH ENHANCED INFO:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Country name",
    "type": "national",
    "fifaCode": "FIFA code if known",
    "fifaRanking": "Current FIFA ranking",
    "confederation": "UEFA/CONMEBOL/etc",
    
    // Enhanced info
    "homeStadium": "Main home stadium",
    "managerCoach": "Current national team coach",
    "captain": "Current captain",
    
    "achievements": {
      "worldCup": "World Cup achievements",
      "continental": "Continental championship achievements",
      "other": "Other achievements"
    },
    
    "allTimeTopScorer": "All-time top scorer",
    "mostCaps": "Player with most appearances",
    "mainRivalries": ["List rival national teams"],
    "playingStyle": "Traditional playing style"
  },
  "worldCupInfo": null,
  "analysis": "Comprehensive analysis of the national team...",
  "videoSearchTerm": "[Country Name] national team highlights 2024 matches",
  "confidenceScore": 0.95
}

FOR WORLD CUP:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "Host country/countries",
    "hostCities": ["List host cities"],
    "qualifiedTeams": ["List qualified teams"],
    "venues": ["List stadiums"],
    "format": "Tournament format",
    "defendingChampion": "Defending champion",
    "mostTitles": "Country with most titles"
  },
  "analysis": "Comprehensive analysis of the World Cup...",
  "videoSearchTerm": "World Cup 2026 highlights preview latest",
  "confidenceScore": 0.95
}

FOR GENERAL QUERIES:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Your comprehensive analysis of general football topics...",
  "videoSearchTerm": "football highlights 2024 latest amazing goals",
  "confidenceScore": 0.8
}

RULES:
1. Use real, current information
2. If certain info is unknown, use "Unknown" or omit the field
3. Keep analysis comprehensive but concise
4. Always classify player names as PLAYER, even if you're unsure
5. For videoSearchTerm, make it specific and searchable: "[Entity] highlights 2024 latest"

Return ONLY JSON, no extra text.`;

  try {
    console.log('🚀 Calling Groq with model: llama-3.3-70b-versatile');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response:', content.substring(0, 200) + '...');
    
    // Try to parse
    const parsed = JSON.parse(content);
    console.log('✅ JSON parsed successfully');
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    
    // Check for specific errors
    if (error.message.includes('model') && error.message.includes('not exist')) {
      console.error('❌ MODEL ERROR: llama-3.3-70b-versatile might not be available');
      return {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `Model unavailable. Please try a different query.`,
        videoSearchTerm: query,
        confidenceScore: 0,
        error: 'MODEL_UNAVAILABLE'
      };
    }
    
    throw error;
  }
}

// Improved YouTube search with random selection
async function searchYouTube(searchTerm: string) {
  console.log('🎬 Searching YouTube for:', searchTerm);
  
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ YouTube API key not set, using fallback');
      return generateFallbackVideoUrl(searchTerm);
    }

    // Create a better search query
    const query = `${searchTerm} football highlights 2024 latest`;
    
    console.log('🔍 YouTube search query:', query);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 3, // Get 3 results to have options
        key: apiKey,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
        order: 'relevance', // Most relevant first
        videoDuration: 'medium', // Medium length videos (4-20 mins)
        relevanceLanguage: 'en',
      },
    });

    console.log('📊 YouTube API found', response.data.items?.length || 0, 'videos');
    
    if (response.data.items?.length > 0) {
      // Pick a random video from the top 3 results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(3, response.data.items.length));
      const videoId = response.data.items[randomIndex].id.videoId;
      const videoTitle = response.data.items[randomIndex].snippet.title;
      const videoUrl = `https://www.youtube.com/embed/${videoId}`;
      
      console.log('✅ Selected random video:', {
        index: randomIndex,
        title: videoTitle,
        url: videoUrl
      });
      
      return videoUrl;
    } else {
      console.warn('📭 No YouTube videos found, using fallback');
      return generateFallbackVideoUrl(searchTerm);
    }
  } catch (error: any) {
    console.error('❌ YouTube search error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Check for quota errors
    if (error.response?.status === 403) {
      console.error('🚫 YouTube API quota exceeded or disabled');
    }
    
    return generateFallbackVideoUrl(searchTerm);
  }
}

// Generate fallback video URL (minimal fallbacks only)
function generateFallbackVideoUrl(query: string) {
  const queryLower = query.toLowerCase();
  
  // Only essential fallbacks for when YouTube API completely fails
  const essentialFallbacks: Record<string, string> = {
    'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'brazil': 'https://www.youtube.com/embed/eJXWcJeGXlM',
  };

  for (const [key, url] of Object.entries(essentialFallbacks)) {
    if (queryLower.includes(key)) {
      console.log('🔄 Using essential fallback for:', key);
      return url;
    }
  }

  console.log('🔄 Using default football highlights');
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}

// Main API handler
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
    console.log(`\n=== NEW REQUEST: "${query}" ===`);
    
    try {
      // Try AI analysis
      const aiAnalysis = await analyzeFootballQuery(query);
      console.log('✅ AI Analysis SUCCESS');
      
      // Log the video search term from AI
      console.log('🎯 AI provided videoSearchTerm:', aiAnalysis.videoSearchTerm);
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`📊 Response type: ${responseType}`);
      
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      console.log('🔍 YouTube search term:', searchTerm);
      
      const youtubeUrl = await searchYouTube(searchTerm);
      console.log('✅ YouTube URL found:', youtubeUrl);
      
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
        analysis: aiAnalysis.analysis || `Analysis of ${query}`,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI',
        debug: 'AI_SUCCESS'
      };

      console.log('📤 Sending response:', { 
        type: responseType,
        hasPlayer: !!aiAnalysis.playerInfo,
        hasTeam: !!aiAnalysis.teamInfo,
        hasWorldCup: !!aiAnalysis.worldCupInfo
      });
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      // Return fallback response
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not analyze "${query}". Please try a different search.`,
        debug: 'AI_FAILED'
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI Enhanced API is running! 🏆',
    version: '2.4',
    features: 'Enhanced football data with dynamic YouTube video search',
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