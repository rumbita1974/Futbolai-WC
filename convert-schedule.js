// One-time conversion script
const fs = require('fs');
const path = require('path');
const { parseScheduleText } = require('./utils/parseSchedule');

console.log('🔄 Converting FIFA World Cup 2026 schedule...\n');

const inputPath = path.join(__dirname, 'data', 'FIFA-World-Cup-2026-schedule.txt');
const outputPath = path.join(__dirname, 'public', 'data', 'schedule.json');

// Check input file
if (!fs.existsSync(inputPath)) {
  console.error('❌ Input file not found:', inputPath);
  console.log('\nPlease make sure your schedule file is at:');
  console.log('D:\\FutbolAi\\data\\FIFA-World-Cup-2026-schedule.txt');
  process.exit(1);
}

// Read and parse
console.log('📖 Reading schedule file...');
const content = fs.readFileSync(inputPath, 'utf8');
console.log(`   File size: ${content.length} characters`);

console.log('\n⚙️  Parsing matches...');
const matches = parseScheduleText(content);
console.log(`   ✅ Parsed ${matches.length} matches`);

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`   Created directory: ${outputDir}`);
}

// Save to JSON
console.log('\n💾 Saving to JSON...');
fs.writeFileSync(outputPath, JSON.stringify(matches, null, 2), 'utf8');
console.log(`   ✅ Saved to: ${outputPath}`);

// Also save to data folder for backup
const backupPath = path.join(__dirname, 'data', 'schedule.json');
fs.writeFileSync(backupPath, JSON.stringify(matches, null, 2), 'utf8');
console.log(`   ✅ Backup saved to: ${backupPath}`);

// Show summary
const groupMatches = matches.filter(m => m.stage === 'group');
const knockoutMatches = matches.filter(m => m.stage !== 'group');

console.log('\n📊 CONVERSION SUMMARY:');
console.log('='.repeat(40));
console.log(`Total matches: ${matches.length}`);
console.log(`Group stage: ${groupMatches.length} matches`);
console.log(`Knockout stage: ${knockoutMatches.length} matches`);

// List unique groups
const groups = {};
matches.forEach(m => {
  if (m.group) groups[m.group] = (groups[m.group] || 0) + 1;
});

console.log('\nGroups found:');
Object.keys(groups).sort().forEach(group => {
  console.log(`  ${group}: ${groups[group]} matches`);
});

// List venues
const venues = {};
matches.forEach(m => {
  venues[m.venue] = (venues[m.venue] || 0) + 1;
});

console.log('\nVenues:');
Object.keys(venues).sort().forEach(venue => {
  console.log(`  ${venue}: ${venues[venue]} matches`);
});

console.log('\n' + '='.repeat(40));
console.log('✅ CONVERSION COMPLETE!');
console.log('\nYou can now:');
console.log('1. Start your server: npm run dev');
console.log('2. Visit: http://localhost:3000/world-cup');
console.log('3. The schedule will load automatically');