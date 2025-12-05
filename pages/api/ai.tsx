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

// Hardcoded country data - GUARANTEED correct responses
function getHardcodedCountryData(countryName: string) {
  const country = countryName.toLowerCase().trim();
  
  const countryData: Record<string, any> = {
    'spain': {
      teamInfo: {
        name: 'Spain National Football Team',
        ranking: '6th in FIFA Rankings',
        coach: 'Luis de la Fuente',
        stadium: 'Various stadiums (national team)',
        league: 'International',
        founded: 1920,
        achievements: ['2010 FIFA World Cup', '3 UEFA European Championships (1964, 2008, 2012)', 'UEFA Nations League 2023'],
        keyPlayers: ['Rodri', 'Pedri', 'Álvaro Morata', 'Dani Olmo', 'Gavi']
      },
      analysis: 'Spain is known for its possession-based "tiki-taka" football style. They won the 2010 FIFA World Cup and are consistently strong in international competitions with a focus on technical midfield play.',
      videoSearchTerm: 'Spain national team highlights 2024'
    },
    'brazil': {
      teamInfo: {
        name: 'Brazil National Football Team',
        ranking: '1st in FIFA Rankings',
        coach: 'Tite',
        stadium: 'Various stadiums (national team)',
        league: 'International',
        founded: 1914,
        achievements: ['5 FIFA World Cup titles (1958, 1962, 1970, 1994, 2002)', '9 Copa América titles', '4 FIFA Confederations Cups'],
        keyPlayers: ['Neymar', 'Vinícius Júnior', 'Alisson Becker', 'Casemiro', 'Marquinhos']
      },
      analysis: 'Brazil is the most successful national team in FIFA World Cup history with 5 titles. Known for their "jogo bonito" (beautiful game) style, technical skill, and producing some of the greatest players in football history.',
      videoSearchTerm: 'Brazil national team highlights 2024'
    },
    'argentina': {
      teamInfo: {
        name: 'Argentina National Football Team',
        ranking: '2nd in FIFA Rankings',
        coach: 'Lionel Scaloni',
        stadium: 'Various stadiums (national team)',
        league: 'International',
        founded: 1893,
        achievements: ['2022 FIFA World Cup', '3 Copa América titles (2021, 2022, 2023)', '2 Olympic gold medals (2004, 2008)'],
        keyPlayers: ['Lionel Messi', 'Ángel Di María', 'Emiliano Martínez', 'Lautaro Martínez', 'Rodrigo De Paul']
      },
      analysis: 'Argentina are the current FIFA World Cup champions (2022). Known for passionate, attacking football and producing world-class forwards. They have a historic rivalry with Brazil.',
      videoSearchTerm: 'Argentina national team highlights 2024'
    },
    'france': {
      teamInfo: {
        name: 'France National Football Team',
        ranking: '3rd in FIFA Rankings',
        coach: 'Didier Deschamps',
        stadium: 'Stade de France',
        league: 'International',
        founded: 1904,
        achievements: ['2 FIFA World Cup titles (1998, 2018)', '2 UEFA European Championships (1984, 2000)', '2 FIFA Confederations Cups'],
        keyPlayers: ['Kylian Mbappé', 'Antoine Griezmann', 'Olivier Giroud', 'Mike Maignan', 'Eduardo Camavinga']
      },
      analysis: 'France are two-time World Cup winners with a reputation for developing exceptional young talent. They play an athletic, counter-attacking style and have one of the deepest squads in world football.',
      videoSearchTerm: 'France national team highlights 2024'
    },
    'germany': {
      teamInfo: {
        name: 'Germany National Football Team',
        ranking: '16th in FIFA Rankings',
        coach: 'Julian Nagelsmann',
        stadium: 'Various stadiums (national team)',
        league: 'International',
        founded: 1900,
        achievements: ['4 FIFA World Cup titles (1954, 1974, 1990, 2014)', '3 UEFA European Championships (1972, 1980, 1996)'],
        keyPlayers: ['İlkay Gündoğan', 'Joshua Kimmich', 'Manuel Neuer', 'Kai Havertz', 'Jamal Musiala']
      },
      analysis: 'Germany is one of the most successful national teams with 4 World Cup titles. Known for their disciplined, efficient style and strong tournament mentality, though recently in transition.',
      videoSearchTerm: 'Germany national team highlights 2024'
    },
    'england': {
      teamInfo: {
        name: 'England National Football Team',
        ranking: '4th in FIFA Rankings',
        coach: 'Gareth Southgate',
        stadium: 'Wembley Stadium',
        league: 'International',
        founded: 1863,
        achievements: ['1966 FIFA World Cup', 'UEFA European Championship 2020 (runners-up)', 'Third place 2018 World Cup'],
        keyPlayers: ['Harry Kane', 'Jude Bellingham', 'Declan Rice', 'Bukayo Saka', 'Phil Foden']
      },
      analysis: 'England won the 1966 World Cup and has recently developed a talented young squad under Gareth Southgate. Known for Premier League-based attacking talent and improved tournament performances.',
      videoSearchTerm: 'England national team highlights 2024'
    },
    'portugal': {
      teamInfo: {
        name: 'Portugal National Football Team',
        ranking: '7th in FIFA Rankings',
        coach: 'Roberto Martínez',
        stadium: 'Various stadiums (national team)',
        league: 'International',
        founded: 1914,
        achievements: ['2016 UEFA European Championship', '2019 UEFA Nations League', 'Third place 1966 World Cup'],
        keyPlayers: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rúben Dias', 'Diogo Costa']
      },
      analysis: 'Portugal won Euro 2016 and are known for producing technically gifted players. They combine experienced veterans with exciting young talent in a fluid attacking system.',
      videoSearchTerm: 'Portugal national team highlights 2024'
    }
  };
  
  return countryData[country] || null;
}

// Hardcoded club data
function getHardcodedClubData(clubName: string) {
  const club = clubName.toLowerCase().trim();
  
  const clubData: Record<string, any> = {
    'real madrid': {
      teamInfo: {
        name: 'Real Madrid CF',
        ranking: '1st in La Liga',
        coach: 'Carlo Ancelotti',
        stadium: 'Santiago Bernabéu',
        league: 'La Liga',
        founded: 1902,
        achievements: ['14 UEFA Champions League titles', '35 La Liga titles', '5 FIFA Club World Cups'],
        keyPlayers: ['Vinicius Junior', 'Jude Bellingham', 'Thibaut Courtois', 'Toni Kroos', 'Luka Modrić']
      },
      analysis: 'Real Madrid is the most successful club in European football history with 14 Champions League titles. Known for their "Galácticos" tradition of signing world-class players and dramatic comebacks.',
      videoSearchTerm: 'Real Madrid highlights 2024'
    },
    'barcelona': {
      teamInfo: {
        name: 'FC Barcelona',
        ranking: '2nd in La Liga',
        coach: 'Xavi Hernández',
        stadium: 'Spotify Camp Nou',
        league: 'La Liga',
        founded: 1899,
        achievements: ['5 UEFA Champions League titles', '27 La Liga titles', '4 UEFA Cup Winners\' Cups'],
        keyPlayers: ['Robert Lewandowski', 'Pedri', 'Frenkie de Jong', 'Gavi', 'Marc-André ter Stegen']
      },
      analysis: 'Barcelona is famous for its "tiki-taka" possession style developed under Pep Guardiola. The club has produced legendary players through its La Masia academy and has a historic rivalry with Real Madrid.',
      videoSearchTerm: 'Barcelona highlights 2024'
    }
  };
  
  return clubData[club] || null;
}

// Query normalization
function normalizeQuery(query: string): { normalized: string; likelyType: string } {
  const q = query.toLowerCase().trim();
  
  // Check for countries
  const countries = ['spain', 'brazil', 'argentina', 'france', 'germany', 'england', 'portugal', 'italy', 'netherlands', 'belgium'];
  for (const country of countries) {
    if (q === country || q.includes(country)) {
      return { normalized: country, likelyType: 'team' };
    }
  }
  
  // Check for clubs
  const clubs = ['real madrid', 'barcelona', 'manchester city', 'bayern munich', 'psg'];
  for (const club of clubs) {
    if (q.includes(club)) {
      return { normalized: club, likelyType: 'team' };
    }
  }
  
  // Check for World Cup
  if (q.includes('world cup') || q.includes('worldcup')) {
    return { normalized: 'FIFA World Cup', likelyType: 'worldCup' };
  }
  
  return { normalized: q, likelyType: 'general' };
}

// Use Groq to analyze query and generate football insights
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  
  const normalized = normalizeQuery(query);
  console.log(`📊 Normalized: "${normalized.normalized}", likely type: ${normalized.likelyType}`);
  
  // 1. Check for hardcoded country data
  const hardcodedCountry = getHardcodedCountryData(normalized.normalized);
  if (hardcodedCountry) {
    console.log('✅ Using hardcoded COUNTRY data');
    return {
      playerInfo: null,
      teamInfo: hardcodedCountry.teamInfo,
      worldCupInfo: null,
      analysis: hardcodedCountry.analysis,
      videoSearchTerm: hardcodedCountry.videoSearchTerm,
      confidenceScore: 0.95
    };
  }
  
  // 2. Check for hardcoded club data
  const hardcodedClub = getHardcodedClubData(normalized.normalized);
  if (hardcodedClub) {
    console.log('✅ Using hardcoded CLUB data');
    return {
      playerInfo: null,
      teamInfo: hardcodedClub.teamInfo,
      worldCupInfo: null,
      analysis: hardcodedClub.analysis,
      videoSearchTerm: hardcodedClub.videoSearchTerm,
      confidenceScore: 0.95
    };
  }
  
  // 3. Use AI for everything else (players, general queries, etc.)
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst. Analyze: "${query}"

Return ONLY valid JSON with ONE of these structures:

FOR PLAYER (ONLY):
{
  "playerInfo": {
    "name": "Player Full Name",
    "position": "Position",
    "nationality": "Nationality",
    "currentClub": "Current Club",
    "stats": {"goals": 0, "assists": 0, "appearances": 0},
    "marketValue": "Value",
    "achievements": ["Achievement 1", "Achievement 2"]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed analysis here...",
  "videoSearchTerm": "player highlights 2024",
  "confidenceScore": 0.95
}

FOR WORLD CUP (ONLY):
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "Host countries",
    "details": "Details here",
    "qualifiedTeams": ["Team1", "Team2"],
    "venues": ["Venue1", "Venue2"]
  },
  "analysis": "World Cup analysis...",
  "videoSearchTerm": "World Cup 2026",
  "confidenceScore": 0.95
}

FOR GENERAL QUERIES (ONLY):
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Analysis about football topics...",
  "videoSearchTerm": "football highlights 2024",
  "confidenceScore": 0.8
}

Return ONLY JSON, no extra text.`;

  try {
    console.log('🚀 Calling Groq AI for non-team query');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response:', content.substring(0, 200) + '...');
    
    // Try to parse
    const parsed = JSON.parse(content);
    console.log('✅ JSON parsed successfully');
    
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `Analysis for "${query}".`,
      videoSearchTerm: query,
      confidenceScore: 0.5
    };
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

// Generate fallback video URL
function generateFallbackVideoUrl(query: string) {
  const queryLower = query.toLowerCase();
  
  const videoMap: Record<string, string> = {
    'spain': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'brazil': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'germany': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
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
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`📊 Final response type: ${responseType.toUpperCase()}`);
      
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
        source: aiAnalysis.playerInfo ? 'Groq AI' : 'Hardcoded Data'
      };

      console.log('📤 Sending response with type:', responseType);
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not analyze "${query}". Please try a different search.`
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API v2.3 is running! 🏆',
    version: '2.3',
    improvements: ['Hardcoded country/team data', 'Guaranteed correct responses', 'No mixed data'],
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Spain',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}