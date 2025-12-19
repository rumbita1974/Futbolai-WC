// Simple brute-force parser for FIFA schedule
const fs = require('fs');
const path = require('path');

function parseFIFASchedule() {
  const filePath = path.join(__dirname, '..', 'data', 'FIFA-World-Cup-2026-schedule.txt');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // First, fix all encoding issues
  let text = content
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/ÔÇô/g, '-')
    .replace(/â\u0080\u0093/g, '-');
  
  const lines = text.split('\n');
  const matches = [];
  let currentDate = '';
  let matchId = 1;
  
  console.log(`Processing ${lines.length} lines...`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for date line: "Thursday, 11 June 2026"
    if (line.match(/^[A-Za-z]+,\s+\d+\s+[A-Za-z]+\s+\d{4}$/)) {
      const parts = line.split(', ');
      const datePart = parts[1]; // "11 June 2026"
      const [day, month, year] = datePart.split(' ');
      
      const months = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
      };
      
      currentDate = `${year}-${months[month] || '06'}-${day.padStart(2, '0')}`;
      console.log(`Date set to: ${currentDate}`);
      continue;
    }
    
    // Skip headers
    if (line.includes('fixtures') || line.includes('final')) {
      continue;
    }
    
    // Try to parse match lines
    // Look for "v" between teams
    if (line.includes(' v ') && line.includes('Group')) {
      console.log(`Possible match line ${i}: ${line.substring(0, 60)}...`);
      
      // Simple split approach
      const vIndex = line.indexOf(' v ');
      if (vIndex === -1) continue;
      
      const team1 = line.substring(0, vIndex).trim();
      const afterV = line.substring(vIndex + 3);
      
      // Find Group
      const groupMatch = line.match(/Group\s+[A-L]/);
      if (!groupMatch) continue;
      const group = groupMatch[0];
      
      // Find venue (everything after the last dash)
      const lastDashIndex = line.lastIndexOf(' - ');
      if (lastDashIndex === -1) continue;
      
      const venue = line.substring(lastDashIndex + 3).trim();
      
      // Extract team2 (between " v " and " - Group")
      const groupIndex = line.indexOf(' - ' + group);
      if (groupIndex === -1) continue;
      
      const team2 = line.substring(vIndex + 3, groupIndex).trim();
      
      matches.push({
        id: matchId++,
        date: currentDate,
        displayDate: currentDate,
        team1: team1,
        team2: team2,
        venue: venue,
        time: 'TBD',
        group: group,
        round: 'Group Stage',
        status: 'scheduled'
      });
      
      console.log(`  ✓ Added: ${team1} vs ${team2} (${group})`);
    }
  }
  
  console.log(`\nTotal matches found: ${matches.length}`);
  return matches;
}

// Run if called directly
if (require.main === module) {
  const matches = parseFIFASchedule();
  
  // Save results
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'schedule-simple.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(matches, null, 2), 'utf8');
  console.log(`\nSaved ${matches.length} matches to: ${outputPath}`);
  
  // Show first 5 matches
  console.log('\nFirst 5 matches:');
  matches.slice(0, 5).forEach((match, i) => {
    console.log(`${i + 1}. ${match.date} - ${match.team1} vs ${match.team2} (${match.group}) at ${match.venue}`);
  });
}

module.exports = { parseFIFASchedule };