// Enhanced country mappings for FIFA teams
export const countryToISO = {
  // Standard countries
  'Mexico': 'mx',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Korea Republic': 'kr',
  'Czech Republic': 'cz',
  'Czechia': 'cz',
  'Denmark': 'dk',
  'Macedonia': 'mk',
  'North Macedonia': 'mk',
  'Ireland': 'ie',
  'Republic of Ireland': 'ie',
  'Canada': 'ca',
  'Bosnia': 'ba',
  'Bosnia and Herzegovina': 'ba',
  'Italy': 'it',
  'N. Ireland': 'gb-nir',
  'Northern Ireland': 'gb-nir',
  'Wales': 'gb-wls',
  'USA': 'us',
  'United States': 'us',
  'Paraguay': 'py',
  'Haiti': 'ht',
  'Scotland': 'gb-sct',
  'Australia': 'au',
  'Turkey': 'tr',
  'Türkiye': 'tr',
  'Kosovo': 'xk',
  'Romania': 'ro',
  'Slovakia': 'sk',
  'Brazil': 'br',
  'Morocco': 'ma',
  'Qatar': 'qa',
  'Switzerland': 'ch',
  'Ivory Coast': 'ci',
  'Côte d\'Ivoire': 'ci',
  'Ecuador': 'ec',
  'Germany': 'de',
  'Curaçao': 'cw',
  'Netherlands': 'nl',
  'Japan': 'jp',
  'Poland': 'pl',
  'Sweden': 'se',
  'Ukraine': 'ua',
  'Albania': 'al',
  'Tunisia': 'tn',
  'Saudi Arabia': 'sa',
  'Uruguay': 'uy',
  'Spain': 'es',
  'Cape Verde': 'cv',
  'Cabo Verde': 'cv',
  'Iran': 'ir',
  'IR Iran': 'ir',
  'New Zealand': 'nz',
  'Belgium': 'be',
  'Egypt': 'eg',
  'France': 'fr',
  'Senegal': 'sn',
  'Bolivia': 'bo',
  'Iraq': 'iq',
  'Suriname': 'sr',
  'Norway': 'no',
  'Argentina': 'ar',
  'Algeria': 'dz',
  'Austria': 'at',
  'Jordan': 'jo',
  'Ghana': 'gh',
  'Panama': 'pa',
  'England': 'gb-eng',
  'Croatia': 'hr',
  'Portugal': 'pt',
  'DR Congo': 'cd',
  'Congo DR': 'cd',
  'Jamaica': 'jm',
  'New Caledonia': 'nc',
  'Uzbekistan': 'uz',
  'Colombia': 'co',
  
  // Placeholder for knockout stage descriptions
  'Winner': 'un',
  'Runner-up': 'un',
  'Third place': 'un'
};

export function getCountryCode(countryName) {
  // Exact match first
  if (countryToISO[countryName]) {
    return countryToISO[countryName];
  }
  
  // Try to extract country from complex strings
  if (countryName.includes('v')) {
    // This might be "Winner match 74" etc - return placeholder
    return 'un';
  }
  
  // Try partial matches for team combinations
  for (const [key, code] of Object.entries(countryToISO)) {
    if (countryName.includes(key)) {
      return code;
    }
  }
  
  // Default to UN flag
  return 'un';
}

export function getFlagUrl(countryName, size = 'w80') {
  const code = getCountryCode(countryName);
  return `https://flagcdn.com/${size}/${code}.png`;
}

// Check if a team name is a real country (not "Winner match X")
export function isRealCountry(teamName) {
  const lowerTeam = teamName.toLowerCase();
  return !lowerTeam.includes('winner') && 
         !lowerTeam.includes('runner') && 
         !lowerTeam.includes('third place') &&
         !teamName.includes('/') &&
         !lowerTeam.includes('match');
}