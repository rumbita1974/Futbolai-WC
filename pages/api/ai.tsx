import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from 'groq-sdk';

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required.');
  }
  return new Groq({ apiKey });
}

// NEW: Smart query analyzer
function analyzeQueryType(query: string): string {
  const q = query.toLowerCase().trim();
  
  // Common country names (expanded list)
  const countries = [
    'afghanistan', 'albania', 'algeria', 'argentina', 'australia', 'austria',
    'belgium', 'bolivia', 'brazil', 'bulgaria', 'cameroon', 'canada',
    'chile', 'china', 'colombia', 'costa rica', 'croatia', 'cuba',
    'czech', 'denmark', 'ecuador', 'egypt', 'england', 'estonia',
    'finland', 'france', 'germany', 'ghana', 'greece', 'honduras',
    'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq',
    'ireland', 'israel', 'italy', 'jamaica', 'japan', 'jordan',
    'kazakhstan', 'kenya', 'kuwait', 'latvia', 'lebanon', 'libya',
    'lithuania', 'luxembourg', 'malaysia', 'mexico', 'morocco',
    'netherlands', 'new zealand', 'nigeria', 'north korea', 'norway',
    'oman', 'pakistan', 'panama', 'paraguay', 'peru', 'philippines',
    'poland', 'portugal', 'qatar', 'romania', 'russia', 'saudi arabia',
    'scotland', 'senegal', 'serbia', 'singapore', 'slovakia', 'slovenia',
    'south africa', 'south korea', 'spain', 'sweden', 'switzerland',
    'syria', 'thailand', 'tunisia', 'turkey', 'ukraine', 'united arab emirates',
    'united kingdom', 'united states', 'uruguay', 'venezuela', 'vietnam',
    'wales', 'zambia', 'zimbabwe'
  ];
  
  // Check if query is EXACTLY a country name
  if (countries.includes(q)) {
    return 'country';
  }
  
  // Check if query contains "team" or "national"
  if (q.includes(' team') || q.includes('national') || q.includes('nt')) {
    return 'team';
  }
  
  // Check for clubs
  const clubs = ['real madrid', 'barcelona', 'manchester', 'bayern', 'chelsea', 
                 'liverpool', 'arsenal', 'juventus', 'milan', 'inter', 'psg'];
  if (clubs.some(club => q.includes(club))) {
    return 'club';
  }
  
  // Check for World Cup
  if (q.includes('world cup') || q.includes('worldcup')) {
    return 'worldcup';
  }
  
  // Default to player/general
  return 'general';
}

// Use Groq to analyze query - FIXED PROMPT
async function analyzeFootballQuery(query: string) {
  console.log('🤖 AI Analysis for:', query);
  const groq = getGroqClient();
  
  const queryType = analyzeQueryType(query);
  console.log('📊 Query type detected:', queryType);
  
  // CRITICAL: Different prompts based on query type
  let prompt = '';
  
  if (queryType === 'country') {
    prompt = `USER QUERY: "${query}"

THIS IS A COUNTRY NAME. The user wants information about the NATIONAL TEAM.

You MUST return ONLY TEAM DATA. Do NOT return player data.
Do NOT mention specific players as the main focus.
Focus on the TEAM: history, achievements, playing style, current status.

Return JSON with this EXACT structure:
{
  "teamInfo": {
    "name": "${query} National Football Team",
    "ranking": "Current FIFA ranking",
    "coach": "Current head coach",
    "stadium": "Main stadium",
    "league": "International",
    "founded": "Year founded",
    "achievements": ["Major achievement 1", "Major achievement 2"],
    "keyPlayers": ["Star player 1", "Star player 2", "Star player 3"]
  },
  "playerInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed analysis of the ${query} national team focusing on team history, achievements, playing style, and current team status. Mention key players briefly but focus on TEAM.",
  "videoSearchTerm": "${query} national football team highlights 2024",
  "confidenceScore": 0.95
}`;
  } else if (queryType === 'club') {
    prompt = `USER QUERY: "${query}"

THIS IS A FOOTBALL CLUB. The user wants information about the CLUB TEAM.

Return JSON with this EXACT structure:
{
  "teamInfo": {
    "name": "Full club name",
    "ranking": "Current league position",
    "coach": "Current manager/coach",
    "stadium": "Home stadium",
    "league": "Current league",
    "founded": "Year founded",
    "achievements": ["Major achievement 1", "Major achievement 2"],
    "keyPlayers": ["Star player 1", "Star player 2", "Star player 3"]
  },
  "playerInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed analysis of the football club focusing on club history, achievements, playing style, and current team status.",
  "videoSearchTerm": "${query} football club highlights 2024",
  "confidenceScore": 0.95
}`;
  } else {
    // For players and general queries
    prompt = `USER QUERY: "${query}"

Analyze this football query. If it's a player name, return PLAYER DATA.
If it's a general question, return GENERAL ANALYSIS.

Return JSON with ONE of these structures:

OPTION A - FOR PLAYERS:
{
  "playerInfo": {
    "name": "Player full name",
    "position": "Playing position",
    "nationality": "Nationality",
    "currentClub": "Current club",
    "stats": {"goals": "Career goals", "assists": "Career assists", "appearances": "Career appearances"},
    "marketValue": "Estimated market value",
    "achievements": ["Major achievement 1", "Major achievement 2"]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed player analysis focusing on career, playing style, achievements.",
  "videoSearchTerm": "player highlights 2024",
  "confidenceScore": 0.95
}

OPTION B - FOR GENERAL QUERIES:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed football analysis...",
  "videoSearchTerm": "football highlights 2024",
  "confidenceScore": 0.8
}

OPTION C - FOR WORLD CUP:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "Host countries",
    "details": "Tournament details",
    "qualifiedTeams": ["Team 1", "Team 2"],
    "venues": ["Venue 1", "Venue 2"]
  },
  "analysis": "World Cup analysis...",
  "videoSearchTerm": "World Cup 2026",
  "confidenceScore": 0.95
}`;
  }

  try {
    console.log('🚀 Calling Groq with specialized prompt');
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are FutbolAI. You return ONLY JSON. No explanations. No markdown. Just valid JSON.' 
        },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Very low for consistency
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response (first 300 chars):', content.substring(0, 300) + '...');
    
    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log('✅ JSON parsed successfully');
    } catch (e) {
      console.error('❌ JSON parse failed, using fallback');
      parsed = {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `Analysis of ${query}.`,
        videoSearchTerm: query,
        confidenceScore: 0.5
      };
    }
    
    // POST-PROCESSING: If query is country but AI returned player, fix it
    if (queryType === 'country' && parsed.playerInfo && !parsed.teamInfo) {
      console.log('⚠️ AI returned player for country. Converting to team...');
      parsed = {
        teamInfo: {
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} National Football Team`,
          ranking: 'N/A',
          coach: 'Current coach',
          stadium: 'Various stadiums',
          league: 'International',
          founded: 'N/A',
          achievements: [`${query} national team achievements`],
          keyPlayers: ['Key players from ' + query]
        },
        playerInfo: null,
        worldCupInfo: null,
        analysis: parsed.analysis || `Analysis of ${query} national football team.`,
        videoSearchTerm: `${query} national team highlights`,
        confidenceScore: 0.9
      };
    }
    
    console.log('🎯 Final data:', {
      type: parsed.playerInfo ? 'PLAYER' : parsed.teamInfo ? 'TEAM' : parsed.worldCupInfo ? 'WORLD_CUP' : 'GENERAL',
      queryType: queryType
    });
    
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `AI analysis for "${query}".`,
      videoSearchTerm: query,
      confidenceScore: 0.5
    };
  }
}

// Rest of your functions (searchYouTube, generateFallbackVideoUrl) remain the same
// ... [Keep your existing searchYouTube and other functions] ...

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
      const aiAnalysis = await analyzeFootballQuery(query);
      
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`🎯 Final response type: ${responseType.toUpperCase()}`);
      
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
        analysis: aiAnalysis.analysis || `Analysis of ${query}`,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI with Smart Query Analysis'
      };

      console.log('📤 Sending response');
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API error:', error.message);
      
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not analyze "${query}". Please try again.`
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API v4.0 is running! 🏆',
    version: '4.0',
    improvements: ['Smart query analysis', 'Specialized prompts', 'Post-processing fixes'],
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Colombia',
        '/api/ai?action=search&query=Luis%20Suarez',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}

// Add missing functions (you should have these from previous versions)
async function searchYouTube(searchTerm: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn('No YouTube API key');
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
      },
    });

    if (response.data.items?.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error('YouTube error:', error);
  }
  
  return generateFallbackVideoUrl(searchTerm);
}

function generateFallbackVideoUrl(query: string) {
  const q = query.toLowerCase();
  const videoMap: Record<string, string> = {
    'colombia': 'https://www.youtube.com/embed/9ILbr0XBp2o',
    'brazil': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'spain': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
  };
  
  for (const [key, url] of Object.entries(videoMap)) {
    if (q.includes(key)) {
      return url;
    }
  }
  
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}