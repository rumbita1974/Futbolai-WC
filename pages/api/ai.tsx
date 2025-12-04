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

Return ONLY valid JSON with this exact structure:
{
  "analysis": "Detailed football analysis...",
  "playerInfo": {
    "name": "Player Name",
    "position": "Position",
    "nationality": "Nationality",
    "currentClub": "Current Club",
    "stats": {
      "goals": 0,
      "assists": 0,
      "appearances": 0
    },
    "marketValue": "Value",
    "achievements": ["Achievement 1", "Achievement 2"]
  } or null,
  "teamInfo": null or {
    "name": "Team Name",
    "ranking": "Rank",
    "coach": "Coach Name"
  },
  "worldCupInfo": null or {
    "year": 2026,
    "host": "USA, Canada, Mexico",
    "details": "Details here"
  },
  "videoSearchTerm": "player highlights 2024",
  "confidenceScore": 0.95
}

IMPORTANT: Return ONLY JSON, no extra text.`;

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
    console.error('Error stack:', error.stack);
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
        q: `${searchTerm} football highlights 2024`,
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
    'messi': 'https://www.youtube.com/embed/ZO0d8r_2qGI',
    'ronaldo': 'https://www.youtube.com/embed/OUKGsb8CpF8',
    'mbappe': 'https://www.youtube.com/embed/RdGpDPLT5Q4',
    'haaland': 'https://www.youtube.com/embed/4XqQpQ8KZg4',
    'neymar': 'https://www.youtube.com/embed/FIYzK8PSLpA',
    'kane': 'https://www.youtube.com/embed/JKZfpoY0Q7c',
    'benzema': 'https://www.youtube.com/embed/6kl7AOKVpCM',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'brazil': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
    'champions league': 'https://www.youtube.com/embed/tKqYfL4hU2c',
    'carvajal': 'https://www.youtube.com/embed/dZqkf1ZnQh4', // General fallback
  };

  for (const [key, url] of Object.entries(videoMap)) {
    if (queryLower.includes(key)) {
      return url;
    }
  }

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
      
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      const youtubeUrl = await searchYouTube(searchTerm);
      
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        players: aiAnalysis.playerInfo ? [aiAnalysis.playerInfo] : [],
        teams: aiAnalysis.teamInfo ? [aiAnalysis.teamInfo] : [],
        worldCupInfo: aiAnalysis.worldCupInfo || null,
        youtubeUrl: youtubeUrl,
        analysis: aiAnalysis.analysis || `Analysis of ${query}`,
        playerInfo: aiAnalysis.playerInfo || null,
        teamInfo: aiAnalysis.teamInfo || null,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI',
        debug: 'AI_SUCCESS'
      };

      console.log('📤 Sending AI response');
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      // For now, return error to debug
      return res.status(200).json({
        success: false,
        query: query,
        error: error.message,
        errorDetails: error.toString(),
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        debug: 'AI_FAILED'
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API is running! 🏆',
    version: '1.0',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Argentina',
        '/api/ai?action=search&query=World Cup 2026'
      ]
    }
  });
}