import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqService {
  async queryWikipedia(topic: string, specificQuery?: string): Promise<any> {
    try {
      const prompt = this.buildWikipediaPrompt(topic, specificQuery);
      
      const response = await axios.post<GroqResponse>(
        GROQ_API_ENDPOINT,
        {
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a football expert that provides accurate, current information from Wikipedia. Return structured JSON data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 4000,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error: any) {
      console.error('GROQ API Error:', error);
      throw new Error(`Failed to query Wikipedia via GROQ: ${error.message}`);
    }
  }

  private buildWikipediaPrompt(topic: string, specificQuery?: string): string {
    const currentYear = new Date().getFullYear();
    
    let prompt = `Provide current, verified information about "${topic}" from Wikipedia as of ${currentYear}. `;
    
    if (specificQuery) {
      prompt += `Focus on: ${specificQuery}. `;
    }
    
    prompt += `Return as JSON. For World Cup groups: { "groups": [ { "name": "Group A", "teams": [ { "name": "...", "fifaCode": "..." } ] } ] }`;
    
    return prompt;
  }

  async getWorldCupGroups(): Promise<any> {
    return this.queryWikipedia(
      '2026 FIFA World Cup',
      'current group stage information with all groups (A through H) and qualified teams with FIFA codes'
    );
  }

  async getTeamInfo(teamName: string): Promise<any> {
    return this.queryWikipedia(
      `${teamName} national football team`,
      `World Cup 2026 qualification status, group assignment, and current squad`
    );
  }

  async getMatchSchedule(): Promise<any> {
    return this.queryWikipedia(
      '2026 FIFA World Cup match schedule',
      'match dates, venues, cities, teams, and status'
    );
  }
}

export const groqService = new GroqService();