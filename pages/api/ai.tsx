import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from 'groq-sdk';

// Initialize Groq client with better error handling
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('🔑 Checking GROQ_API_KEY:', {
    exists: !!apiKey,
    length: apiKey?.length || 0,
    startsWith: apiKey?.substring(0, 10) || 'none'
  });
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }
  
  if (!apiKey.startsWith('gsk_')) {
    throw new Error('GROQ_API_KEY format invalid. Should start with "gsk_"');
  }
  
  return new Groq({ apiKey });
}

// Simple working prompt
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  
  let groq;
  try {
    groq = getGroqClient();
    console.log('✅ Groq client initialized successfully');
  } catch (error: any) {
    console.error('❌ Failed to initialize Groq:', error.message);
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `Configuration error: ${error.message}`,
      videoSearchTerm: query,
      confidenceScore: 0,
      error: error.message
    };
  }

  // SIMPLE PROMPT THAT WORKS
  const prompt = `You are a football analyst. Analyze: "${query}"

Return JSON in this exact format:
{
  "playerInfo": {
    "name": "Player name if player",
    "position": "Position",
    "nationality": "Nationality",
    "currentClub": "Current club",
    "stats": {"goals": 0, "assists": 0, "appearances": 0},
    "marketValue": "Market value if known",
    "achievements": ["Achievement1", "Achievement2"]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Brief analysis here",
  "videoSearchTerm": "${query} football highlights",
  "confidenceScore": 0.9
}

If "${query}" is a team (club or national), set playerInfo to null and teamInfo to:
{
  "name": "Team name",
  "type": "club or national",
  "location": "Location",
  "stadium": "Stadium name",
  "coach": "Coach name",
  "achievements": ["Trophy1", "Trophy2"],
  "keyPlayers": ["Player1", "Player2"]
}

If "${query}" is about World Cup, set playerInfo and teamInfo to null and worldCupInfo to:
{
  "year": 2026,
  "host": "Host country",
  "details": "Brief details"
}

Return ONLY the JSON object, no other text.`;

  try {
    console.log('🚀 Calling Groq API...');
    
    // Try with different model - lama-3.3-70b-versatile
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // More reliable than llama-3.3
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw response received, length:', content.length);
    
    // Clean the response
    let cleanContent = content;
    if (content.includes('```json')) {
      cleanContent = content.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    } else if (content.includes('```')) {
      cleanContent = content.replace(/```/g, '').trim();
    }
    
    console.log('🧹 Cleaned (first 200 chars):', cleanContent.substring(0, 200));
    
    try {
      const parsed = JSON.parse(cleanContent);
      console.log('✅ JSON parsed successfully');
      
      // Ensure required fields
      if (!parsed.analysis) parsed.analysis = `Analysis of ${query}`;
      if (!parsed.videoSearchTerm) parsed.videoSearchTerm = `${query} football`;
      if (!parsed.confidenceScore) parsed.confidenceScore = 0.8;
      
      return parsed;
    } catch (parseError: any) {
      console.error('❌ JSON parse error:', parseError.message);
      console.log('Problem content:', cleanContent);
      
      // Fallback response
      return {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `Could not parse AI response for "${query}".`,
        videoSearchTerm: `${query} football highlights`,
        confidenceScore: 0.5,
        error: 'JSON_PARSE_ERROR'
      };
    }
    
  } catch (error: any) {
    console.error('❌ Groq API error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // Check specific error types
    if (error.message?.includes('rate') || error.message?.includes('limit') || error.status === 429) {
      console.log('⚠️ Rate limit detected');
      return {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `Rate limit exceeded. Please wait a moment and try again.`,
        videoSearchTerm: query,
        confidenceScore: 0,
        error: 'RATE_LIMIT'
      };
    }
    
    if (error.message?.includes('auth') || error.message?.includes('key') || error.status === 401) {
      return {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `API authentication error. Please check your API key.`,
        videoSearchTerm: query,
        confidenceScore: 0,
        error: 'AUTH_ERROR'
      };
    }
    
    // Generic error
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `Service temporarily unavailable: ${error.message}`,
      videoSearchTerm: query,
      confidenceScore: 0,
      error: error.message
    };
  }
}

// Search YouTube (unchanged)
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
    'williams': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
    
    // Teams
    'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
    'manchester city': 'https://www.youtube.com/embed/KXwHEvDE2-U',
    'liverpool': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'brazil': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'spain': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'colombia': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
    
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

// Main API handler with better error reporting
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
      console.log('📊 AI Analysis result:', {
        hasPlayer: !!aiAnalysis.playerInfo,
        hasTeam: !!aiAnalysis.teamInfo,
        hasWorldCup: !!aiAnalysis.worldCupInfo,
        error: aiAnalysis.error,
        confidence: aiAnalysis.confidenceScore
      });
      
      // If AI returned an error, treat as failure
      if (aiAnalysis.error) {
        console.log('⚠️ AI returned error:', aiAnalysis.error);
        throw new Error(`AI processing failed: ${aiAnalysis.error}`);
      }
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`✅ AI Analysis SUCCESS, type: ${responseType}`);
      
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

      console.log('📤 Sending successful response');
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      // Return detailed error response
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not analyze "${query}". Please try a different search. Error: ${error.message}`,
        debug: {
          error: error.message,
          timestamp: new Date().toISOString(),
          mode: 'API_CATCH'
        }
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API is running! 🏆',
    version: '2.2',
    features: 'Football analysis with AI',
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