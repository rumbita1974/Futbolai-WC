/**
 * Simple parser utilities for schedule data
 * Browser-safe version (no fs module)
 */

// Export empty functions since we don't need parsing in browser
export function parseScheduleText(text) {
  console.warn('parseScheduleText called in browser - should use pre-parsed JSON instead');
  return [];
}

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

export function getGroupStageMatches(matches) {
  return matches.filter(match => match.stage === 'group');
}

export function getKnockoutMatches(matches) {
  return matches.filter(match => match.stage !== 'group');
}

export function cleanTeamName(team) {
  // Simple cleaning for display
  return team
    .replace('Cura├ºao', 'Curaçao')
    .replace('C├┤te d\'Ivoire', 'Ivory Coast')
    .replace('Korea Republic', 'South Korea')
    .replace('IR Iran', 'Iran')
    .replace('Congo DR', 'DR Congo');
}