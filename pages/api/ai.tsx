import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from '@groq/sdk';

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }
  return new Groq({ apiKey });
}

// Mock football data
const mockPlayers = [
  {
    id: 1,
    name: 'Lionel Messi',
    position: 'Forward',
    nationality: 'Argentina',
    club: 'Inter Miami',
    age: 36,
    goals: 821,
    assists: 357,
    appearances: 1034,
    rating: 9.3,
  },
  {
    id: 2,
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    nationality: 'Portugal',
    club: 'Al Nassr',
    age: 39,
    goals: 893,
    assists: 268,
    appearances: 1217,
    rating: 9.1,
  },
  {
    id: 3,
    name: 'Kylian Mbappé',
    position: 'Forward',
    nationality: 'France',
    club: 'Paris Saint-Germain',
    age: 25,
    goals: 289,
    assists: 142,
    appearances: 436,
    rating: 8.9,
  },
];

const mockTeams = [
  {
    id: 1,
    name: 'Argentina',
    region: 'South America',
    worldCupWins: 3,
    fifaRanking: 1,
    coach: 'Lionel Scaloni',
  },
  {
    id: 2,
    name: 'Brazil',
    region: 'South America',
    worldCupWins: 5,
    fifaRanking: 5,
    coach: 'Dorival Júnior',
  },
  {
    id: 3,
    name: 'France',
    region: 'Europe',
    worldCupWins: 2,
    fifaRanking: 2,
    coach: 'Didier Deschamps',
  },
];

// Process query with AI
async function processQueryWithAI(query: string) {
  try {
    const groq = getGroqClient();
    
    const prompt = `Analyze this football query and determine the intent. Query: "${query}"
    
    Respond with JSON only in this exact format:
    {
      "intent": "player_search" | "team_search" | "world_cup" | "general",
      "playerName": "string or null",
      "teamName": "string or null",
      "keywords": ["array", "of", "keywords"],
      "originalQuery": "original query"
    }
    
    Examples:
    Query: "Messi stats" → {"intent": "player_search", "playerName": "Lionel Messi", "teamName": null, "keywords": ["stats", "messi"], "originalQuery": "Messi stats"}
    Query: "Argentina team" → {"intent": "team_search", "playerName": null, "teamName": "Argentina", "keywords": ["argentina", "team"], "originalQuery": "Argentina team"}
    Query: "World Cup 2026" → {"intent": "world_cup", "playerName": null, "teamName": null, "keywords": ["world", "cup", "2026"], "originalQuery": "World Cup 2026"}
    Query: "best forwards" → {"intent": "general", "playerName": null, "teamName": null, "keywords": ["best", "forwards"], "originalQuery": "best forwards"}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('AI processing error:', error);
    // Fallback to simple keyword matching
    const queryLower = query.toLowerCase();
    if (queryLower.includes('messi')) {
      return {
        intent: 'player_search',
        playerName: 'Lionel Messi',
        teamName: null,
        keywords: ['messi'],
        originalQuery: query,
      };
    } else if (queryLower.includes('ronaldo')) {
      return {
        intent: 'player_search',
        playerName: 'Cristiano Ronaldo',
        teamName: null,
        keywords: ['ronaldo'],
        originalQuery: query,
      };
    } else if (queryLower.includes('argentina')) {
      return {
        intent: 'team_search',
        playerName: null,
        teamName: 'Argentina',
        keywords: ['argentina'],
        originalQuery: query,
      };
    } else if (queryLower.includes('world cup')) {
      return {
        intent: 'world_cup',
        playerName: null,
        teamName: null,
        keywords: ['world', 'cup'],
        originalQuery: query,
      };
    } else {
      return {
        intent: 'general',
        playerName: null,
        teamName: null,
        keywords: query.toLowerCase().split(' '),
        originalQuery: query,
      };
    }
  }
}

// Search YouTube for football videos
async function searchYouTube(query: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn('YouTube API key not set, using fallback');
      return 'https://www.youtube.com/embed/ZO0d8r_2qGI'; // Default football highlights
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${query} football highlights`,
        type: 'video',
        maxResults: 1,
        key: apiKey,
      },
    });

    if (response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error('YouTube search error:', error);
  }
  
  // Fallback videos based on query
  const queryLower = query.toLowerCase();
  if (queryLower.includes('messi')) return 'https://www.youtube.com/embed/ZO0d8r_2qGI';
  if (queryLower.includes('ronaldo')) return 'https://www.youtube.com/embed/OUKGsb8CpF8';
  if (queryLower.includes('argentina')) return 'https://www.youtube.com/embed/eJXWcJeGXlM';
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4'; // General football highlights
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, query } = req.query;

  console.log(`🔍 Processing football query: ${query}`);

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    if (action === 'search') {
      // Process query with AI
      const queryUnderstanding = await processQueryWithAI(query);
      console.log('🎯 Query intent:', queryUnderstanding);

      // Search players
      const playerResults = mockPlayers.filter(player => {
        const searchStr = `${player.name} ${player.position} ${player.nationality} ${player.club}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Search teams
      const teamResults = mockTeams.filter(team => {
        const searchStr = `${team.name} ${team.region}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Get YouTube video
      const youtubeUrl = await searchYouTube(query);

      // World Cup info if relevant
      const worldCupInfo = queryUnderstanding.intent === 'world_cup' ? {
        year: 2026,
        host: 'USA, Canada, Mexico',
        teams: 48,
        groups: 16,
        startDate: 'June 2026',
        currentQualifiers: 0,
      } : null;

      const response = {
        queryUnderstanding,
        players: playerResults,
        teams: teamResults,
        youtubeUrl,
        worldCupInfo,
        timestamp: new Date().toISOString(),
      };

      console.log(`✅ Found ${playerResults.length} players, ${teamResults.length} teams`);
      return res.status(200).json(response);
    }

    // Default response
    res.status(200).json({
      message: 'FutbolAI API is running!',
      endpoints: ['GET /api/ai?action=search&query=your-query'],
      example: 'Try: /api/ai?action=search&query=Messi',
    });
  } catch (error) {
    console.error('❌ API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}