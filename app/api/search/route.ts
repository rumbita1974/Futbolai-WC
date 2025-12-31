import { NextResponse } from 'next/server';

// Hardcoded search results since GROQ is unreliable
const HARDCODED_RESPONSES: Record<string, any> = {
  "lionel messi stats 2024": {
    title: "Lionel Messi - 2024 Statistics",
    summary: "Lionel Andrés Messi (born 24 June 1987) is an Argentine professional footballer.",
    stats: [
      "Total career goals: 821+ (as of 2024)",
      "2023-24 season: 11 goals, 5 assists for Inter Miami",
      "International: 106 goals for Argentina",
      "Ballon d'Or awards: 8 (record)"
    ],
    achievements: [
      "2022 FIFA World Cup Champion",
      "4× UEFA Champions League winner",
      "10× La Liga champion",
      "Ligue 1 champion with PSG"
    ],
    currentStatus: "Playing for Inter Miami CF in MLS, captain of Argentina national team",
    source: "Wikipedia"
  },
  "manchester city trophies": {
    title: "Manchester City - Trophy History",
    summary: "Manchester City Football Club is an English professional football club based in Manchester.",
    stats: [
      "Premier League titles: 9 (most recent: 2023-24)",
      "FA Cups: 7",
      "EFL Cups: 8",
      "UEFA Champions League: 1 (2023)"
    ],
    achievements: [
      "2023 Treble: Premier League, FA Cup, Champions League",
      "4 consecutive Premier League titles (2021-2024)",
      "Record 100 points in 2017-18 season"
    ],
    currentStatus: "Defending Premier League champions, managed by Pep Guardiola",
    source: "Wikipedia"
  },
  "world cup 2026 predictions": {
    title: "2026 FIFA World Cup Predictions",
    summary: "The 2026 FIFA World Cup will be jointly hosted by Canada, Mexico, and the United States.",
    stats: [
      "Hosts: USA, Canada, Mexico (16 cities)",
      "Teams: 48 (expanded from 32)",
      "Format: 12 groups of 4 teams",
      "Matches: 104 (increased from 64)"
    ],
    predictions: [
      "Favorites: Brazil, Argentina, France, England",
      "Dark horses: USA (home advantage), Portugal, Netherlands",
      "Expected breakout stars: Jude Bellingham, Jamal Musiala"
    ],
    currentStatus: "Qualification ongoing, tournament starts June 11, 2026",
    source: "FIFA + Wikipedia"
  },
  "cristiano ronaldo highlights": {
    title: "Cristiano Ronaldo - Career Highlights",
    summary: "Cristiano Ronaldo dos Santos Aveiro (born 5 February 1985) is a Portuguese professional footballer.",
    stats: [
      "Total career goals: 893+ (as of 2024)",
      "International: 128 goals for Portugal (world record)",
      "Club goals: 765+ across Sporting, Manchester United, Real Madrid, Juventus, Al Nassr",
      "UEFA Champions League titles: 5"
    ],
    achievements: [
      "5× Ballon d'Or awards",
      "4× European Golden Shoe",
      "All-time top scorer for Real Madrid (450 goals)",
      "Led Portugal to Euro 2016 victory"
    ],
    currentStatus: "Playing for Al Nassr in Saudi Pro League, captain of Portugal",
    source: "Wikipedia"
  },
  "premier league standings": {
    title: "2023-24 Premier League Final Standings",
    summary: "The 2023-24 Premier League was won by Manchester City.",
    standings: [
      "1. Manchester City - 91 points",
      "2. Arsenal - 89 points",
      "3. Liverpool - 82 points",
      "4. Aston Villa - 68 points",
      "5. Tottenham - 66 points"
    ],
    stats: [
      "Champions: Manchester City (4th consecutive title)",
      "Top scorer: Erling Haaland (27 goals)",
      "Most assists: Ollie Watkins (13 assists)",
      "Relegated: Luton Town, Burnley, Sheffield United"
    ],
    currentStatus: "2024-25 season in progress",
    source: "Premier League + Wikipedia"
  }
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log('[Search API] Processing query:', query);
    
    // Find closest match in hardcoded responses
    const lowerQuery = query.toLowerCase();
    let responseData = null;
    
    for (const [key, data] of Object.entries(HARDCODED_RESPONSES)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        responseData = data;
        break;
      }
    }
    
    // If no match, return generic response
    if (!responseData) {
      responseData = {
        title: `Search: ${query}`,
        summary: "This is a demo response. Try searching for: 'Lionel Messi stats 2024', 'Manchester City trophies', or 'World Cup 2026 predictions'.",
        examples: [
          "Lionel Messi has 821+ career goals",
          "Manchester City won 9 Premier League titles",
          "2026 World Cup has 48 teams across USA, Canada, Mexico"
        ],
        source: "FutbolAI Demo"
      };
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      query: query
    });

  } catch (error) {
    console.error('[Search API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process search query',
      data: {
        title: "Error",
        summary: "Search service temporarily unavailable. Please try again.",
        source: "System"
      }
    }, { status: 500 });
  }
}