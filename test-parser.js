// Quick test script to verify parsing works
const fs = require('fs');
const path = require('path');

// Import our parser
const { parseScheduleText } = require('./utils/parseSchedule');

console.log('Testing FIFA World Cup 2026 schedule parser...\n');
console.log('='.repeat(60));

// Read the file
const txtPath = path.join(__dirname, 'data', 'FIFA-World-Cup-2026-schedule.txt');

if (!fs.existsSync(txtPath)) {
  console.error('✗ File not found:', txtPath);
  console.log('\nMake sure the file exists at: D:\\FutbolAi\\data\\FIFA-World-Cup-2026-schedule.txt');
  process.exit(1);
}

const content = fs.readFileSync(txtPath, 'utf8');
console.log(`✓ File loaded: ${content.length} characters`);
console.log(`✓ First 200 chars: ${content.substring(0, 200)}...\n`);

// Show first few lines
const lines = content.split('\n');
console.log('First 10 lines of the file:');
console.log('-'.repeat(40));
for (let i = 0; i < Math.min(10, lines.length); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
console.log('-'.repeat(40) + '\n');

// Parse the content
console.log('Parsing matches...');
const matches = parseScheduleText(content);

console.log(`\n✓ Parsed ${matches.length} matches total\n`);

if (matches.length === 0) {
  console.error('✗ No matches parsed! Check the file format.');
  console.log('\nCommon issues:');
  console.log('1. File might be empty');
  console.log('2. Format might be different than expected');
  console.log('3. Check for encoding issues');
  process.exit(1);
}

// Show first 10 matches
console.log('First 10 matches parsed:');
console.log('='.repeat(80));
matches.slice(0, 10).forEach((match, i) => {
  console.log(`Match ${i + 1}:`);
  console.log(`  ID: ${match.id}`);
  console.log(`  Date: ${match.date} (${match.displayDate})`);
  console.log(`  Teams: ${match.team1} vs ${match.team2}`);
  console.log(`  Group/Round: ${match.group || match.round}`);
  console.log(`  Venue: ${match.venue}`);
  console.log(`  Time: ${match.time}`);
  console.log(`  Stage: ${match.stage}`);
  console.log('-'.repeat(40));
});

// Show match breakdown
const groups = {};
const rounds = {};
const stages = {};

matches.forEach(match => {
  if (match.group) {
    groups[match.group] = (groups[match.group] || 0) + 1;
  }
  rounds[match.round] = (rounds[match.round] || 0) + 1;
  stages[match.stage] = (stages[match.stage] || 0) + 1;
});

console.log('\n📊 MATCH BREAKDOWN:');
console.log('='.repeat(40));

console.log('\nBy Stage:');
Object.entries(stages).forEach(([stage, count]) => {
  console.log(`  ${stage}: ${count} matches`);
});

console.log('\nBy Group (Group Stage only):');
const sortedGroups = Object.keys(groups).sort();
sortedGroups.forEach(group => {
  console.log(`  ${group}: ${groups[group]} matches`);
});

console.log('\nBy Round:');
Object.entries(rounds).forEach(([round, count]) => {
  console.log(`  ${round}: ${count} matches`);
});

// Check for parsing issues
const teamsWithSlashes = matches.filter(m => 
  m.team1.includes('/') || m.team2.includes('/')
);

if (teamsWithSlashes.length > 0) {
  console.log('\n⚠️  Teams with slashes (qualifiers not decided yet):');
  teamsWithSlash = [];
  matches.forEach(match => {
    if (match.team1.includes('/')) teamsWithSlash.push(match.team1);
    if (match.team2.includes('/')) teamsWithSlash.push(match.team2);
  });
  const uniqueTeams = [...new Set(teamsWithSlash)];
  uniqueTeams.forEach(team => console.log(`  - ${team}`));
}

// Save a sample JSON
const samplePath = path.join(__dirname, 'data', 'schedule-sample.json');
fs.writeFileSync(samplePath, JSON.stringify(matches.slice(0, 15), null, 2), 'utf8');
console.log(`\n💾 Sample saved to: ${samplePath}`);

// Also save full schedule
const fullPath = path.join(__dirname, 'data', 'schedule-parsed.json');
fs.writeFileSync(fullPath, JSON.stringify(matches, null, 2), 'utf8');
console.log(`💾 Full schedule saved to: ${fullPath}`);

// Create a simple stats file
const stats = {
  totalMatches: matches.length,
  groupStage: stages.group || 0,
  knockoutStage: matches.length - (stages.group || 0),
  groups: groups,
  rounds: rounds,
  parsingDate: new Date().toISOString()
};

const statsPath = path.join(__dirname, 'data', 'parsing-stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
console.log(`📈 Stats saved to: ${statsPath}`);

console.log('\n' + '='.repeat(60));
console.log('✅ PARSER TEST COMPLETE!');
console.log(`✅ Total matches parsed: ${matches.length}`);
console.log('='.repeat(60));

console.log('\nNext steps:');
console.log('1. Start your Next.js server: npm run dev');
console.log('2. Visit: http://localhost:3000/api/schedule/convert');
console.log('3. Visit: http://localhost:3000/world-cup to see the schedule');