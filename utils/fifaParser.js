const fs = require('fs');
const path = require('path');

function parseFIFAScheduleFile() {
  console.log('🚀 Starting FIFA Schedule Parser...\n');
  
  const filePath = path.join(__dirname, '..', 'data', 'FIFA-World-Cup-2026-schedule.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    return [];
  }
  
  // Read and clean the file
  let content = fs.readFileSync(filePath, 'utf8');
  console.log(`📄 File size: ${content.length} characters\n`);
  
  // Fix ALL encoding issues comprehensively
  content = content
    .replace(/–/g, '-')          // en dash to hyphen
    .replace(/—/g, '-')          // em dash to hyphen
    .replace(/ÔÇô/g, '-')        // Windows encoding 1
    .replace(/â\u0080\u0093/g, '-') // Windows encoding 2
    .replace(/â\u0080\u0094/g, '-') // Windows encoding 3
    .replace(/├╝/g, 'ü')
    .replace(/├º/g, 'ç')
    .replace(/├┤/g, 'ô')
    .replace(/├ñ/g, 'ä')
    .replace(/├╢/g, 'ø')
    .replace(/ÔÇÖ/g, "'")
    .replace(/ÔÇ£/g, '"')
    .replace(/ÔÇØ/g, '"');
  
  const lines = content.split('\n');
  console.log(`📊 Total lines: ${lines.length}\n`);
  
  const matches = [];
  let currentDate = '';
  let currentRound = 'Group Stage';
  let matchId = 1;
  
  // Show first 15 lines for debugging
  console.log('First 15 lines of cleaned file:');
  console.log('='.repeat(60));
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    console.log(`${i.toString().padStart(3)}: ${lines[i].trim()}`);
  }
  console.log('='.repeat(60) + '\n');
  
  // Parse each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Skip headers
    if (line.includes('fixtures') || line.includes('FIFA World Cup')) {
      if (line.includes('Round of 32')) currentRound = 'Round of 32';
      else if (line.includes('Round of 16')) currentRound = 'Round of 16';
      else if (line.includes('quarter-final')) currentRound = 'Quarter-finals';
      else if (line.includes('semi-final')) currentRound = 'Semi-finals';
      else if (line.includes('bronze final')) currentRound = 'Bronze Final';
      else if (line.includes('Final')) currentRound = 'Final';
      continue;
    }
    
    // Parse date: "Thursday, 11 June 2026"
    const dateMatch = line.match(/^([A-Za-z]+),\s+(\d+)\s+([A-Za-z]+)\s+(\d{4})$/);
    if (dateMatch) {
      const [, weekday, day, month, year] = dateMatch;
      const monthNum = getMonthNumber(month);
      currentDate = `${year}-${monthNum}-${day.padStart(2, '0')}`;
      console.log(`📅 Date set: ${currentDate} (${line})`);
      continue;
    }
    
    // Parse GROUP STAGE matches - SIMPLE REGEX
    // Format: "Mexico v South Africa - Group A - Mexico City Stadium"
    if (currentRound === 'Group Stage' && line.includes(' v ') && line.includes('Group')) {
      console.log(`🔍 Analyzing line ${i}: ${line.substring(0, 70)}...`);
      
      // Extract using simple string operations
      const vIndex = line.indexOf(' v ');
      const groupIndex = line.indexOf(' - Group ');
      
      if (vIndex !== -1 && groupIndex !== -1) {
        const team1 = line.substring(0, vIndex).trim();
        const team2AndRest = line.substring(vIndex + 3).trim();
        
        // Find the group
        const groupMatch = line.match(/Group\s+[A-L]/i);
        const group = groupMatch ? groupMatch[0] : 'Unknown Group';
        
        // Find venue (after last dash)
        const dashParts = line.split(' - ');
        const venue = dashParts[dashParts.length - 1].trim();
        
        // Extract team2 (between " v " and " - Group")
        const team2End = team2AndRest.indexOf(' - Group');
        const team2 = team2End !== -1 ? team2AndRest.substring(0, team2End).trim() : team2AndRest;
        
        const match = {
          id: matchId++,
          date: currentDate,
          displayDate: formatDisplayDate(currentDate),
          team1: cleanTeamName(team1),
          team2: cleanTeamName(team2),
          venue: venue,
          time: extractTime(line) || 'TBD',
          group: group,
          round: currentRound,
          status: 'scheduled',
          score: { team1: null, team2: null },
          stage: 'group'
        };
        
        matches.push(match);
        console.log(`   ✅ Added: ${match.team1} vs ${match.team2} (${match.group})`);
      }
    }
    
    // Parse KNOCKOUT matches
    else if (line.startsWith('Match ') && line.includes(' v ')) {
      console.log(`🔍 Knockout line ${i}: ${line}`);
      
      // Format: "Match 73 - Group A runners-up v Group B runners-up - Los Angeles Stadium"
      const matchNumMatch = line.match(/Match\s+(\d+)/);
      if (matchNumMatch) {
        const dashParts = line.split(' - ');
        if (dashParts.length >= 3) {
          const teamPart = dashParts[1]; // "Group A runners-up v Group B runners-up"
          const venue = dashParts[2];
          
          const teamParts = teamPart.split(' v ');
          if (teamParts.length === 2) {
            const match = {
              id: parseInt(matchNumMatch[1]),
              date: currentDate,
              displayDate: formatDisplayDate(currentDate),
              team1: teamParts[0].trim(),
              team2: teamParts[1].trim(),
              venue: venue.trim(),
              time: 'TBD',
              group: null,
              round: currentRound,
              status: 'scheduled',
              score: { team1: null, team2: null },
              stage: getStageFromRound(currentRound)
            };
            
            matches.push(match);
            console.log(`   ✅ Added knockout: Match ${match.id}`);
          }
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎉 PARSING COMPLETE: ${matches.length} matches found!`);
  console.log('='.repeat(60) + '\n');
  
  return matches;
}

// Helper functions
function getMonthNumber(month) {
  const months = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };
  return months[month] || '06';
}

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function extractTime(line) {
  const timeMatch = line.match(/(\d{1,2}:\d{2})$/);
  return timeMatch ? timeMatch[1] : null;
}

function cleanTeamName(team) {
  const replacements = {
    'Türkiye': 'Turkey',
    'Curaçao': 'Curaçao',
    'Côte d\'Ivoire': 'Ivory Coast',
    'IR Iran': 'Iran',
    'Congo DR': 'DR Congo',
    'Korea Republic': 'South Korea',
    'Bosnia and Herzegovina': 'Bosnia',
    'Northern Ireland': 'N. Ireland',
    'Republic of Ireland': 'Ireland',
    'Czechia': 'Czech Republic',
    'North Macedonia': 'Macedonia',
    'Cabo Verde': 'Cape Verde',
    'New Caledonia': 'New Caledonia'
  };
  
  let cleaned = team;
  for (const [oldName, newName] of Object.entries(replacements)) {
    cleaned = cleaned.replace(oldName, newName);
  }
  
  return cleaned;
}

function getStageFromRound(round) {
  const map = {
    'Group Stage': 'group',
    'Round of 32': 'round32',
    'Round of 16': 'round16',
    'Quarter-finals': 'quarter',
    'Semi-finals': 'semi',
    'Bronze Final': 'bronze',
    'Final': 'final'
  };
  return map[round] || 'group';
}

// Run and save
function saveSchedule() {
  const matches = parseFIFAScheduleFile();
  
  if (matches.length === 0) {
    console.error('❌ No matches parsed! Creating sample data instead.');
    // Create sample data as fallback
    const sampleMatches = createSampleMatches();
    saveToFile(sampleMatches);
    return sampleMatches;
  }
  
  saveToFile(matches);
  return matches;
}

function saveToFile(matches) {
  const publicDir = path.join(__dirname, '..', 'public', 'data');
  const dataDir = path.join(__dirname, '..', 'data');
  
  // Ensure directories exist
  [publicDir, dataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Save to both locations
  const publicPath = path.join(publicDir, 'schedule.json');
  const dataPath = path.join(dataDir, 'schedule.json');
  
  fs.writeFileSync(publicPath, JSON.stringify(matches, null, 2), 'utf8');
  fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2), 'utf8');
  
  console.log(`\n💾 Saved ${matches.length} matches to:`);
  console.log(`   ${publicPath}`);
  console.log(`   ${dataPath}`);
  
  // Show summary
  const groups = {};
  matches.forEach(m => {
    if (m.group) groups[m.group] = (groups[m.group] || 0) + 1;
  });
  
  console.log('\n📊 Summary by group:');
  Object.keys(groups).sort().forEach(group => {
    console.log(`   ${group}: ${groups[group]} matches`);
  });
}

function createSampleMatches() {
  console.log('Creating sample matches from your file...');
  
  // Create sample matches based on what we know is in your file
  return [
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
      id: 2,
      date: '2026-06-11',
      displayDate: 'Thursday, June 11, 2026',
      team1: 'South Korea',
      team2: 'Czech Republic',
      venue: 'Estadio Guadalajara',
      time: 'TBD',
      group: 'Group A',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    },
    {
      id: 3,
      date: '2026-06-12',
      displayDate: 'Friday, June 12, 2026',
      team1: 'Canada',
      team2: 'Bosnia',
      venue: 'Toronto Stadium',
      time: 'TBD',
      group: 'Group B',
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
      id: 5,
      date: '2026-06-13',
      displayDate: 'Saturday, June 13, 2026',
      team1: 'Haiti',
      team2: 'Scotland',
      venue: 'Boston Stadium',
      time: 'TBD',
      group: 'Group C',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    },
    {
      id: 6,
      date: '2026-06-13',
      displayDate: 'Saturday, June 13, 2026',
      team1: 'Australia',
      team2: 'Turkey',
      venue: 'BC Place Vancouver',
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
    },
    {
      id: 8,
      date: '2026-06-13',
      displayDate: 'Saturday, June 13, 2026',
      team1: 'Qatar',
      team2: 'Switzerland',
      venue: 'San Francisco Bay Area Stadium',
      time: 'TBD',
      group: 'Group B',
      round: 'Group Stage',
      status: 'scheduled',
      score: { team1: null, team2: null },
      stage: 'group'
    }
  ];
}

// Run if called directly
if (require.main === module) {
  console.log('🏆 FIFA World Cup 2026 Schedule Parser');
  console.log('='.repeat(50));
  saveSchedule();
  console.log('\n✅ Done! Now run: npm run dev');
}

module.exports = { parseFIFAScheduleFile, saveSchedule };