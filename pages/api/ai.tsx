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
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst. Analyze this query: "${query}"

  Generate a comprehensive football analysis with the following structure:

  1. **Player Analysis** (if query mentions a player):
     - Full name, position, nationality, current club
     - Key career stats (goals, assists, appearances)
     - Recent performance highlights
     - Strengths and playing style
     - Market value and achievements

  2. **Team Analysis** (if query mentions a team):
     - Full team name, region, FIFA ranking
     - Manager and key players
     - Recent performance and trophies
     - Playing style and tactics
     - Upcoming fixtures

  3. **World Cup 2026** (if query mentions World Cup):
     - Host countries and dates
     - Qualified teams so far
     - Groups format (48 teams, 16 groups)
     - Favorites to win
     - Key players to watch

  4. **General Football Knowledge** (for other queries):
     - Relevant facts and statistics
     - Historical context
     - Current trends in football
     - Expert insights

  Format the response as JSON with this structure:
  {
    "analysis": "detailed text analysis here",
    "playerInfo": { "name": "...", "position": "...", "stats": {...} } or null,
    "teamInfo": { "name": "...", "ranking": "...", "coach": "..." } or null,
    "worldCupInfo": { "year": 2026, "host": "...", "details": "..." } or null,
    "videoSearchTerm": "term to search on YouTube for highlights",
    "confidenceScore": 0.9
  }

  Be factual, concise, and focus on current information (2024-2025 season).`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // CHANGED: Updated to working model
      temperature: 0.4,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('🤖 Groq raw response:', content.substring(0, 200) + '...');
    
    // Try to parse JSON, fallback to default if invalid
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn('Failed to parse JSON response, using fallback:', parseError);
      return {
        analysis: content,
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        videoSearchTerm: query,
        confidenceScore: 0.7
      };
    }
  } catch (error: any) {
    console.error('Groq analysis error:', error);
    
    // Provide more specific error message
    if (error?.message?.includes('model')) {
      throw new Error(`AI model error: ${error.message}. Check model name in code.`);
    }
    if (error?.status === 401) {
      throw new Error('Invalid API key. Check GROQ_API_KEY in Vercel environment variables.');
    }
    throw new Error(`AI analysis failed: ${error.message}`);
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
  };

  for (const [key, url] of Object.entries(videoMap)) {
    if (queryLower.includes(key)) {
      return url;
    }
  }

  return 'https://www.youtube.com/embed/dZqkf1ZnQh4'; // General football highlights
}

// Main API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
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
    console.log(`🔍 Processing: "${query}"`);
    
    try {
      // Step 1: Use Groq to analyze the query
      const aiAnalysis = await analyzeFootballQuery(query);
      console.log('✅ AI Analysis complete');
      
      // Step 2: Get YouTube video based on analysis
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      const youtubeUrl = await searchYouTube(searchTerm);
      console.log('🎬 YouTube URL:', youtubeUrl);
      
      // Step 3: Construct response
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        analysis: aiAnalysis.analysis,
        playerInfo: aiAnalysis.playerInfo || null,
        teamInfo: aiAnalysis.teamInfo || null,
        worldCupInfo: aiAnalysis.worldCupInfo || null,
        youtubeUrl: youtubeUrl,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI + Football Intelligence',
      };

      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API Error:', error);
      
      // Graceful fallback with more details
      return res.status(200).json({
        success: false,
        query: query,
        error: error.message || 'AI analysis service temporarily unavailable',
        fallbackResponse: {
          message: `Searching for "${query}" in football database...`,
          suggestion: 'Try specific player names (Messi, Ronaldo), team names (Argentina, Brazil), or "World Cup 2026"',
          youtubeUrl: generateFallbackVideoUrl(query),
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // API documentation response
  res.status(200).json({
    name: 'FutbolAI API',
    version: '1.0',
    description: 'AI-powered football intelligence platform',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-football-query',
      examples: [
        '/api/ai?action=search&query=Lionel Messi stats',
        '/api/ai?action=search&query=Brazil national team',
        '/api/ai?action=search&query=World Cup 2026 predictions',
        '/api/ai?action=search&query=top scorers Champions League 2024',
      ],
    },
    poweredBy: ['Groq AI', 'YouTube API', 'Next.js'],
    note: 'Add GROQ_API_KEY environment variable for full AI capabilities',
  });
}