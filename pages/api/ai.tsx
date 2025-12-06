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

FOR PLAYER:
{
  "playerInfo": {
    "name": "Lionel Messi",
    "position": "Forward",
    "nationality": "Argentinian",
    "currentClub": "Inter Miami",
    "stats": {"goals": 821, "assists": 361, "appearances": 1043},
    "marketValue": "€35M",
    "achievements": ["World Cup 2022", "7 Ballon d'Or", "4 Champions League"]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Lionel Messi is considered one of the greatest footballers of all time...",
  "videoSearchTerm": "Lionel Messi highlights 2024",
  "confidenceScore": 0.95
}

FOR TEAM:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Real Madrid",
    "ranking": "1st in La Liga",
    "coach": "Carlo Ancelotti", 
    "stadium": "Santiago Bernabéu",
    "league": "La Liga",
    "founded": 1902,
    "achievements": ["14 Champions League titles", "35 La Liga titles"],
    "keyPlayers": ["Vinicius Junior", "Jude Bellingham", "Thibaut Courtois"]
  },
  "worldCupInfo": null,
  "analysis": "Real Madrid is one of the most successful football clubs in history...",
  "videoSearchTerm": "Real Madrid highlights 2024",
  "confidenceScore": 0.95
}

FOR WORLD CUP:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "USA, Canada, Mexico",
    "details": "2026 FIFA World Cup will be the first to feature 48 teams...",
    "qualifiedTeams": ["USA", "Canada", "Mexico", "Argentina", "France", "Brazil"],
    "venues": ["MetLife Stadium", "SoFi Stadium", "Azteca Stadium"]
  },
  "analysis": "The 2026 FIFA World Cup will be hosted across North America...",
  "videoSearchTerm": "World Cup 2026",
  "confidenceScore": 0.95
}

FOR GENERAL QUERIES:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Your query about general football topics...",
  "videoSearchTerm": "football highlights 2024",
  "confidenceScore": 0.8
}

Return ONLY JSON, no extra text.`;

  try {
    console.log('🚀 Calling Groq with model: llama-3.3-70b-versatile');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response:', content);
    
    // Try to parse
    const parsed = JSON.parse(content);
    console.log('✅ JSON parsed successfully');
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    throw error;
  }
}

// Search YouTube for relevant videos
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

// Generate fallback video URL based on query
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

  return 'https://www.youtube.com/embed/dZqkf1ZnQh4'; // Default football highlights
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
    message: 'FutbolAI API is running! 🏆',
    version: '2.0',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}