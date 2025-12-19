import { getFlagUrl } from '@/utils/countryCodes';

// Cache for matches
let cachedMatches = null;

export async function getWorldCupMatches() {
  console.log('🔍 getWorldCupMatches called');
  
  if (cachedMatches) {
    console.log('📦 Returning cached matches:', cachedMatches.length);
    return cachedMatches;
  }
  
  try {
    console.log('📥 Fetching schedule.json from /data/schedule.json');
    
    // Load from the JSON file that we already created
    const response = await fetch('/data/schedule.json', {
      cache: 'no-store', // Always get fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const matches = await response.json();
    console.log(`✅ Loaded ${matches.length} matches from schedule.json`);
    
    // Add flag URLs to matches
    const enhancedMatches = matches.map(match => addFlagsToMatch(match));
    
    cachedMatches = enhancedMatches;
    return enhancedMatches;
    
  } catch (error) {
    console.error('❌ Error loading World Cup matches:', error);
    
    // Fallback to a few sample matches
    console.log('⚠️ Using fallback sample data');
    return getSampleMatches();
  }
}

function addFlagsToMatch(match) {
  // Check if team names are actual countries (not "Winner match X" or teams with slashes)
  const isRealTeam1 = !match.team1.toLowerCase().includes('winner') && 
                     !match.team1.toLowerCase().includes('runner') &&
                     !match.team1.toLowerCase().includes('third place') &&
                     !match.team1.includes('/');
  
  const isRealTeam2 = !match.team2.toLowerCase().includes('winner') && 
                     !match.team2.toLowerCase().includes('runner') &&
                     !match.team2.toLowerCase().includes('third place') &&
                     !match.team2.includes('/');
  
  return {
    ...match,
    team1Flag: isRealTeam1 ? getFlagUrl(match.team1) : '/team-placeholder.png',
    team2Flag: isRealTeam2 ? getFlagUrl(match.team2) : '/team-placeholder.png',
    hasRealTeams: isRealTeam1 && isRealTeam2
  };
}

// Sample data for fallback (just in case)
function getSampleMatches() {
  const sampleMatches = [
    {
      id: 1,
      date: '2026-06-11',
      displayDate: 'Thursday, June 11, 2026',
      team1: 'Mexico',
      team2: 'South Africa',
      venue: 'Mexico City Stadium',
      time: 'TBD',
      group: 'Group A',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    },
    {
      id: 4,
      date: '2026-06-12',
      displayDate: 'Friday, June 12, 2026',
      team1: 'USA',
      team2: 'Paraguay',
      venue: 'Los Angeles Stadium',
      time: 'TBD',
      group: 'Group D',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    },
    {
      id: 7,
      date: '2026-06-13',
      displayDate: 'Saturday, June 13, 2026',
      team1: 'Brazil',
      team2: 'Morocco',
      venue: 'New York New Jersey Stadium',
      time: 'TBD',
      group: 'Group C',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    }
  ];
  
  return sampleMatches.map(match => addFlagsToMatch(match));
}

// Simple helper functions
export function groupMatchesByDate(matches) {
  const grouped = {};
  matches.forEach(match => {
    if (!grouped[match.date]) grouped[match.date] = [];
    grouped[match.date].push(match);
  });
  return grouped;
}

export function groupMatchesByGroup(matches) {
  const grouped = {};
  matches.forEach(match => {
    if (match.group) {
      if (!grouped[match.group]) grouped[match.group] = [];
      grouped[match.group].push(match);
    }
  });
  return grouped;
}

export function getGroupStage(matches) {
  return matches.filter(match => match.stage === 'group');
}

export function getKnockoutStage(matches) {
  return matches.filter(match => match.stage !== 'group');
}