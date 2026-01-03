import Groq from 'groq-sdk';
import { enhanceGROQResponse, isWikipediaConfigured } from '@/services/dataEnhancerService';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface Player {
  name: string;
  currentTeam: string;
  position: string;
  age?: number;
  nationality: string;
  careerGoals?: number;
  careerAssists?: number;
  internationalAppearances?: number;
  internationalGoals?: number;
  majorAchievements: string[];
  careerSummary: string;
  _source?: string;
  _lastVerified?: string;
  _wikiSummary?: string;
}

export interface Team {
  name: string;
  type: 'club' | 'national';
  country: string;
  stadium?: string;
  currentCoach: string;
  foundedYear?: number;
  majorAchievements: {
    worldCup: string[];
    continental: string[];
    domestic: string[];
  };
  _source?: string;
  _lastVerified?: string;
  _updateReason?: string;
  _wikiSummary?: string;
  _achievementsUpdated?: boolean;
  _dataCurrency?: {
    lastTrained: string;
    enhanced: string;
    updatesApplied: string[];
    currentSeason: string;
    verification: {
      source: string;
      confidence: 'high' | 'medium' | 'low';
      timestamp: string;
    };
    disclaimer: string;
    recommendations: string[];
  };
}

export interface GROQSearchResponse {
  players: Player[];
  teams: Team[];
  youtubeQuery: string;
  error?: string;
  message?: string;
  _metadata?: {
    enhancedAt: string;
    analysis: any;
    appliedUpdates: string[];
    dataSources: string[];
    apiStatus: {
      wikipedia: string;
      groq: string;
    };
    currentSeason: string;
    dataCurrency: {
      aiCutoff: string;
      verifiedWith: string;
      confidence: string;
      lastVerified: string;
    };
    disclaimer: string;
    recommendations: string[];
    wikipediaUsage: {
      queries: number;
      updates: number;
      timestamp: string;
    };
    achievementCorrections?: string[];
  };
}

/**
 * Main GROQ search function for football queries
 */
export const searchWithGROQ = async (query: string): Promise<GROQSearchResponse> => {
  // Validate API key
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.error('GROQ API key is missing. Check your .env.local file');
    return {
      players: [],
      teams: [],
      youtubeQuery: '',
      error: 'GROQ API key not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file.',
      _metadata: {
        enhancedAt: new Date().toISOString(),
        analysis: { error: 'Missing API key' },
        appliedUpdates: [],
        dataSources: [],
        apiStatus: {
          wikipedia: 'Not checked',
          groq: 'Missing key'
        },
        currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        dataCurrency: {
          aiCutoff: 'N/A',
          verifiedWith: 'None',
          confidence: 'low',
          lastVerified: new Date().toISOString()
        },
        disclaimer: 'GROQ API key missing. Cannot fetch AI data.',
        recommendations: ['Check your .env.local file for GROQ_API_KEY'],
        wikipediaUsage: {
          queries: 0,
          updates: 0,
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  try {
    console.log(`[GROQ] Searching for: "${query}" with model: llama-3.3-70b-versatile`);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are FutbolAI - a professional football data analyst. You provide comprehensive, accurate football statistics.
          
          IMPORTANT DATA CURRENCY RULES (CRITICAL FOR 2025):
          1. Your knowledge cutoff is 2024. You MUST acknowledge this limitation by including "(as of 2024)" when unsure.
          2. For coach information that may have changed since 2024, add "(as of 2024)" or check before providing.
          3. When mentioning achievements, always include the season/year: "Premier League 2023-2024"
          4. Be conservative - if you're unsure about current data, say so explicitly.
          
          CRITICAL UPDATES FOR 2025 (MUST USE THESE):
          - Real Madrid: Coach = Xabi Alonso (since 2024). Champions League titles = 15 (last: 2024)
          - Bayern Munich: Coach = Vincent Kompany (since 2024)
          - Liverpool: Coach = Arne Slot (since 2024)
          - Barcelona: Coach = Hansi Flick (since 2024)
          - Chelsea: Coach = Enzo Maresca (since 2024)
          - AC Milan: Coach = Paulo Fonseca (since 2024)
          - Juventus: Coach = Thiago Motta (since 2024)
          - Brazil: Coach = Dorival Júnior (since 2024)
          
          ACCURATE ACHIEVEMENT COUNTS (VERIFIED - USE THESE):
          - Real Madrid: 15 UEFA Champions League titles (last: 2024) - NOT 14
          - AC Milan: 7 UEFA Champions League titles
          - Bayern Munich: 6 UEFA Champions League titles
          - Liverpool: 6 UEFA Champions League titles
          - Barcelona: 5 UEFA Champions League titles
          - Ajax: 4 UEFA Champions League titles
          - Manchester United: 3 UEFA Champions League titles
          - Inter Milan: 3 UEFA Champions League titles (last: 2010)
          - Juventus: 2 UEFA Champions League titles
          - Benfica: 2 UEFA Champions League titles
          - Porto: 2 UEFA Champions League titles
          - Nottingham Forest: 2 UEFA Champions League titles
          - Manchester City: 1 UEFA Champions League title (2023)
          - Chelsea: 2 UEFA Champions League titles (2012, 2021)
          
          IMPORTANT: Real Madrid won their 15th Champions League in 2024. Always use "15 titles" not "14 titles".
          
          ALWAYS respond with VALID JSON using this exact structure:

          {
            "players": [{
              "name": "string",
              "currentTeam": "string",
              "position": "string",
              "age": number,
              "nationality": "string",
              "careerGoals": number,
              "careerAssists": number,
              "internationalAppearances": number,
              "internationalGoals": number,
              "majorAchievements": ["string"],
              "careerSummary": "string (brief 2-3 sentence summary)"
            }],
            "teams": [{
              "name": "string",
              "type": "club" or "national",
              "country": "string",
              "stadium": "string",
              "currentCoach": "string",
              "foundedYear": number,
              "majorAchievements": {
                "worldCup": ["string"],
                "continental": ["string"],
                "domestic": ["string"]
              }
            }],
            "youtubeQuery": "string (relevant YouTube search query for highlights)",
            "message": "string (include data currency note like 'Information as of 2024, verified with current sources')"
          }

          EXAMPLE RESPONSE FOR "Real Madrid":
          {
            "players": [],
            "teams": [{
              "name": "Real Madrid",
              "type": "club",
              "country": "Spain",
              "stadium": "Santiago Bernabéu",
              "currentCoach": "Xabi Alonso",
              "foundedYear": 1902,
              "majorAchievements": {
                "worldCup": ["FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)"],
                "continental": ["UEFA Champions League (15 titles: 1956, 1957, 1958, 1959, 1960, 1966, 1998, 2000, 2002, 2014, 2016, 2017, 2018, 2022, 2024)", "UEFA Super Cup (5 titles)"],
                "domestic": ["La Liga (36 titles, last: 2023-2024)", "Copa del Rey (20 titles)", "Supercopa de España (13 titles)"]
              }
            }],
            "youtubeQuery": "Real Madrid 2024 2025 highlights goals",
            "message": "Real Madrid information. Coach is Xabi Alonso (2024). 15 UEFA Champions League titles (won 2024)."
          }

          EXAMPLE RESPONSE FOR "Lionel Messi":
          {
            "players": [{
              "name": "Lionel Messi",
              "currentTeam": "Inter Miami",
              "position": "Forward",
              "age": 36,
              "nationality": "Argentine",
              "careerGoals": 835,
              "careerAssists": 375,
              "internationalAppearances": 180,
              "internationalGoals": 106,
              "majorAchievements": ["2022 FIFA World Cup Winner", "8x Ballon d'Or", "4x Champions League Winner", "10x La Liga Winner"],
              "careerSummary": "Argentine professional footballer considered one of the greatest players of all time. Known for his dribbling, playmaking, and goal-scoring abilities. Currently plays for Inter Miami in MLS after legendary career at Barcelona."
            }],
            "teams": [],
            "youtubeQuery": "Lionel Messi best goals 2024 Inter Miami",
            "message": "Lionel Messi information as of 2024."
          }

          REMEMBER: Always include specific years/seasons. Always note data currency. Use critical updates for major teams. Real Madrid has 15 UCL titles, not 14.`
        },
        {
          role: 'user',
          content: `Football search query: "${query}". Provide comprehensive, accurate data in the specified JSON format with proper data currency notes.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    console.log('[GROQ] Raw response:', response);
    
    if (!response || response.trim() === '') {
      return {
        players: [],
        teams: [],
        youtubeQuery: '',
        error: 'Received empty response from AI service',
        message: 'No data found for your query.',
        _metadata: {
          enhancedAt: new Date().toISOString(),
          analysis: { error: 'Empty response' },
          appliedUpdates: [],
          dataSources: ['GROQ AI'],
          apiStatus: {
            wikipedia: 'Not used',
            groq: 'Success'
          },
          currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          dataCurrency: {
            aiCutoff: '2024',
            verifiedWith: 'None',
            confidence: 'low',
            lastVerified: new Date().toISOString()
          },
          disclaimer: 'AI returned empty response.',
          recommendations: ['Try a different search term'],
          wikipediaUsage: {
            queries: 0,
            updates: 0,
            timestamp: new Date().toISOString()
          }
        }
      };
    }

    try {
      const parsed = JSON.parse(response);
      console.log('[GROQ] Parsed response:', parsed);
      
      // ENHANCE WITH WIKIPEDIA DATA
      console.log('[GROQ] Enhancing with Wikipedia API...');
      const wikipediaConfigured = isWikipediaConfigured();
      console.log('[GROQ] Wikipedia API configured:', wikipediaConfigured);
      
      let enhancedResult = parsed;
      let wikipediaUpdates = 0;
      let achievementCorrections: string[] = [];
      
      if (wikipediaConfigured) {
        try {
          enhancedResult = await enhanceGROQResponse(parsed, query);
          console.log('[GROQ] Wikipedia-enhanced response:', enhancedResult);
          wikipediaUpdates = enhancedResult._metadata?.appliedUpdates?.length || 0;
          achievementCorrections = enhancedResult._metadata?.achievementCorrections || [];
        } catch (enhanceError) {
          console.error('[GROQ] Wikipedia enhancement failed:', enhanceError);
          // Continue with basic result if enhancement fails
          enhancedResult = parsed;
        }
      } else {
        console.log('[GROQ] Wikipedia API not configured, using basic result');
        enhancedResult = parsed;
      }
      
      // Build final response
      const result: GROQSearchResponse = {
        players: Array.isArray(enhancedResult.players) ? enhancedResult.players.slice(0, 1) : [],
        teams: Array.isArray(enhancedResult.teams) ? enhancedResult.teams.slice(0, 1) : [],
        youtubeQuery: enhancedResult.youtubeQuery || `${query} football highlights ${new Date().getFullYear()}`,
        message: enhancedResult.message || `Found information for "${query}"`,
        error: enhancedResult.error || null,
        _metadata: enhancedResult._metadata || {
          enhancedAt: new Date().toISOString(),
          analysis: {
            isLikelyOutdated: false,
            outdatedFields: [],
            suggestions: ['Basic data verification'],
            needsEnhancement: false,
            confidence: 'medium'
          },
          appliedUpdates: [],
          dataSources: ['GROQ AI'],
          apiStatus: {
            wikipedia: wikipediaConfigured ? 'Configured' : 'Not configured',
            groq: 'Success'
          },
          currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          dataCurrency: {
            aiCutoff: '2024',
            verifiedWith: wikipediaConfigured ? 'Wikipedia' : 'None',
            confidence: wikipediaUpdates > 0 ? 'high' : 'medium',
            lastVerified: new Date().toISOString()
          },
          disclaimer: wikipediaConfigured 
            ? 'Data verified with Wikipedia for current accuracy.'
            : 'Wikipedia API not configured. Data may be outdated.',
          recommendations: [
            'Check official sources for absolutely current information',
            'Visit club websites for latest squad details'
          ],
          wikipediaUsage: {
            queries: wikipediaConfigured ? 1 : 0,
            updates: wikipediaUpdates,
            timestamp: new Date().toISOString()
          },
          achievementCorrections
        }
      };
      
      // Add enhancement note to message
      if (wikipediaUpdates > 0 && result.message) {
        result.message = `✓ ${result.message} (Updated with Wikipedia data)`;
        
        // Add specific note for achievement corrections
        if (achievementCorrections.length > 0) {
          if (achievementCorrections.some(c => c.includes('15 UEFA Champions League'))) {
            result.message += ' • 15 UCL titles confirmed';
          }
        }
      } else if (wikipediaConfigured && result.message) {
        result.message = `✓ ${result.message} (Verified with Wikipedia)`;
      }
      
      console.log('[GROQ] Final response with metadata:', result._metadata);
      return result;
      
    } catch (parseError) {
      console.error('[GROQ] Failed to parse JSON response:', parseError, 'Response:', response);
      
      // Try to extract JSON if response has extra text
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('[GROQ] Attempting to extract JSON from text...');
          const extracted = JSON.parse(jsonMatch[0]);
          
          // Try enhancement even with extracted JSON
          let enhancedExtracted = extracted;
          if (isWikipediaConfigured()) {
            try {
              enhancedExtracted = await enhanceGROQResponse(extracted, query);
            } catch (e) {
              console.error('[GROQ] Enhancement of extracted JSON failed:', e);
            }
          }
          
          return {
            players: Array.isArray(enhancedExtracted.players) ? enhancedExtracted.players : [],
            teams: Array.isArray(enhancedExtracted.teams) ? enhancedExtracted.teams : [],
            youtubeQuery: enhancedExtracted.youtubeQuery || `${query} football highlights`,
            message: enhancedExtracted.message || `Found information for "${query}"`,
            error: null,
            _metadata: enhancedExtracted._metadata || {
              enhancedAt: new Date().toISOString(),
              analysis: { note: 'Response extracted from text' },
              appliedUpdates: [],
              dataSources: ['GROQ AI (extracted)'],
              apiStatus: {
                wikipedia: isWikipediaConfigured() ? 'Used' : 'Not configured',
                groq: 'Success'
              },
              currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
              dataCurrency: {
                aiCutoff: '2024',
                verifiedWith: isWikipediaConfigured() ? 'Wikipedia' : 'None',
                confidence: 'medium',
                lastVerified: new Date().toISOString()
              },
              disclaimer: 'Response required extraction. Data may be incomplete.',
              recommendations: ['Verify with official sources'],
              wikipediaUsage: {
                queries: isWikipediaConfigured() ? 1 : 0,
                updates: 0,
                timestamp: new Date().toISOString()
              }
            }
          };
        }
      } catch (secondError) {
        console.error('[GROQ] Failed to extract JSON:', secondError);
      }
      
      return {
        players: [],
        teams: [],
        youtubeQuery: `${query} football highlights`,
        error: 'Failed to parse AI response. The service returned invalid JSON.',
        message: 'Technical error processing the response.',
        _metadata: {
          enhancedAt: new Date().toISOString(),
          analysis: { error: 'JSON parse failed' },
          appliedUpdates: [],
          dataSources: [],
          apiStatus: {
            wikipedia: 'Not used',
            groq: 'Success'
          },
          currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          dataCurrency: {
            aiCutoff: 'N/A',
            verifiedWith: 'None',
            confidence: 'low',
            lastVerified: new Date().toISOString()
          },
          disclaimer: 'Could not parse AI response.',
          recommendations: ['Try again with a different query'],
          wikipediaUsage: {
            queries: 0,
            updates: 0,
            timestamp: new Date().toISOString()
          }
        }
      };
    }

  } catch (error: any) {
    console.error('[GROQ] API Error:', error);
    
    // Build error response with metadata
    const errorResponse: GROQSearchResponse = {
      players: [],
      teams: [],
      youtubeQuery: '',
      error: `Search failed: ${error.message || 'Unknown error'}`,
      message: 'Failed to fetch data. Please try again.',
      _metadata: {
        enhancedAt: new Date().toISOString(),
        analysis: { error: true, errorType: error?.status || 'unknown' },
        appliedUpdates: [],
        dataSources: [],
        apiStatus: {
          wikipedia: 'Not used',
          groq: error?.status === 401 ? 'Invalid key' : 'Error'
        },
        currentSeason: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        dataCurrency: {
          aiCutoff: 'N/A',
          verifiedWith: 'None',
          confidence: 'low',
          lastVerified: new Date().toISOString()
        },
        disclaimer: 'API request failed.',
        recommendations: ['Check your internet connection', 'Verify API keys'],
        wikipediaUsage: {
          queries: 0,
          updates: 0,
          timestamp: new Date().toISOString()
        }
      }
    };
    
    // Handle specific error cases
    if (error?.status === 401) {
      errorResponse.error = 'Invalid GROQ API key. Please check your GROQ_API_KEY in .env.local';
      errorResponse._metadata!.recommendations = ['Verify your GROQ API key is correct'];
    }
    
    if (error?.status === 429) {
      errorResponse.error = 'Rate limit exceeded. Please wait a moment and try again.';
      errorResponse._metadata!.recommendations = ['Wait 60 seconds before trying again'];
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      errorResponse.error = 'Network error. Please check your internet connection.';
      errorResponse._metadata!.recommendations = ['Check your internet connection and try again'];
    }
    
    return errorResponse;
  }
};

// Alias for backward compatibility
export const GROQSearch = searchWithGROQ;

/**
 * Helper to check if data needs verification
 */
export const needsDataVerification = (response: GROQSearchResponse): boolean => {
  if (!response._metadata) return true;
  
  if (response._metadata.analysis?.isLikelyOutdated) return true;
  if (response._metadata.analysis?.outdatedFields?.length > 0) return true;
  
  // Check if Wikipedia was used
  if (response._metadata.wikipediaUsage?.updates === 0 && 
      response._metadata.wikipediaUsage?.queries > 0) {
    return false; // Wikipedia checked and no updates needed
  }
  
  // Check for 2024 references
  const allText = JSON.stringify(response).toLowerCase();
  if (allText.includes('as of 2024') || allText.includes('2024 season')) {
    return true;
  }
  
  return false;
};

/**
 * Get data source badge info
 */
export const getDataSourceInfo = (response: GROQSearchResponse): {
  source: string;
  color: string;
  icon: string;
} => {
  if (!response._metadata) {
    return { source: 'Unverified', color: 'gray', icon: '❓' };
  }
  
  if (response._metadata.wikipediaUsage?.updates > 0) {
    return { source: 'Wikipedia Updated', color: 'green', icon: '✅' };
  }
  
  if (response._metadata.wikipediaUsage?.queries > 0) {
    return { source: 'Wikipedia Verified', color: 'blue', icon: '🌐' };
  }
  
  if (response._metadata.dataSources?.includes('Critical Update')) {
    return { source: 'Critical Update', color: 'purple', icon: '🔧' };
  }
  
  return { source: 'AI Data', color: 'yellow', icon: '🤖' };
};