// context/TeamContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Team, Match, TeamContextType } from '../types';

// Parse data function (you'll need to implement this based on your data source)
const parseWorldCupData = (): Team[] => {
  // This is placeholder data - replace with actual data parsing
  return [
    {
      id: 'argentina',
      name: 'Argentina',
      code: 'ARG',
      group: 'A',
      flagUrl: 'https://flagcdn.com/ar.svg',
      venue: 'Buenos Aires',
      city: 'Buenos Aires',
      matches: [],
      players: [],
      fifaRanking: 1,
      worldCupAppearances: 18,
      bestResult: 'Champions (1978, 1986, 2022)',
      coach: 'Lionel Scaloni'
    },
    {
      id: 'brazil',
      name: 'Brazil',
      code: 'BRA',
      group: 'G',
      flagUrl: 'https://flagcdn.com/br.svg',
      venue: 'Rio de Janeiro',
      city: 'Rio de Janeiro',
      matches: [],
      players: [],
      fifaRanking: 3,
      worldCupAppearances: 22,
      bestResult: 'Champions (1958, 1962, 1970, 1994, 2002)',
      coach: 'Dorival Júnior'
    },
    {
      id: 'france',
      name: 'France',
      code: 'FRA',
      group: 'D',
      flagUrl: 'https://flagcdn.com/fr.svg',
      venue: 'Paris',
      city: 'Paris',
      matches: [],
      players: [],
      fifaRanking: 2,
      worldCupAppearances: 16,
      bestResult: 'Champions (1998, 2018)',
      coach: 'Didier Deschamps'
    },
    {
      id: 'germany',
      name: 'Germany',
      code: 'GER',
      group: 'A',
      flagUrl: 'https://flagcdn.com/de.svg',
      venue: 'Berlin',
      city: 'Berlin',
      matches: [],
      players: [],
      fifaRanking: 16,
      worldCupAppearances: 20,
      bestResult: 'Champions (1954, 1974, 1990, 2014)',
      coach: 'Julian Nagelsmann'
    },
    {
      id: 'spain',
      name: 'Spain',
      code: 'ESP',
      group: 'B',
      flagUrl: 'https://flagcdn.com/es.svg',
      venue: 'Madrid',
      city: 'Madrid',
      matches: [],
      players: [],
      fifaRanking: 8,
      worldCupAppearances: 16,
      bestResult: 'Champions (2010)',
      coach: 'Luis de la Fuente'
    },
    {
      id: 'portugal',
      name: 'Portugal',
      code: 'POR',
      group: 'F',
      flagUrl: 'https://flagcdn.com/pt.svg',
      venue: 'Lisbon',
      city: 'Lisbon',
      matches: [],
      players: [],
      fifaRanking: 7,
      worldCupAppearances: 8,
      bestResult: 'Third Place (1966)',
      coach: 'Roberto Martínez'
    },
    {
      id: 'england',
      name: 'England',
      code: 'ENG',
      group: 'C',
      flagUrl: 'https://flagcdn.com/gb-eng.svg',
      venue: 'London',
      city: 'London',
      matches: [],
      players: [],
      fifaRanking: 4,
      worldCupAppearances: 16,
      bestResult: 'Champions (1966)',
      coach: 'Gareth Southgate'
    },
    {
      id: 'italy',
      name: 'Italy',
      code: 'ITA',
      group: 'B',
      flagUrl: 'https://flagcdn.com/it.svg',
      venue: 'Rome',
      city: 'Rome',
      matches: [],
      players: [],
      fifaRanking: 9,
      worldCupAppearances: 18,
      bestResult: 'Champions (1934, 1938, 1982, 2006)',
      coach: 'Luciano Spalletti'
    }
  ];
};

// Sample matches data
const sampleMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Argentina',
    awayTeam: 'Brazil',
    homeScore: 2,
    awayScore: 1,
    date: '2026-06-15',
    time: '20:00',
    venue: 'Estadio Azteca',
    stage: 'Group Stage',
    group: 'A',
    status: 'scheduled'
  },
  {
    id: '2',
    homeTeam: 'France',
    awayTeam: 'Germany',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-16',
    time: '17:00',
    venue: 'SoFi Stadium',
    stage: 'Group Stage',
    group: 'D',
    status: 'scheduled'
  },
  {
    id: '3',
    homeTeam: 'Spain',
    awayTeam: 'Portugal',
    homeScore: 1,
    awayScore: 3,
    date: '2026-06-20',
    time: '14:00',
    venue: 'MetLife Stadium',
    stage: 'Group Stage',
    group: 'B',
    status: 'completed'
  },
  {
    id: '4',
    homeTeam: 'Argentina',
    awayTeam: 'Germany',
    homeScore: 2,
    awayScore: 2,
    date: '2026-06-22',
    time: '19:30',
    venue: 'AT&T Stadium',
    stage: 'Group Stage',
    group: 'A',
    status: 'in_progress'
  },
  {
    id: '5',
    homeTeam: 'England',
    awayTeam: 'Italy',
    homeScore: 1,
    awayScore: 1,
    date: '2026-06-18',
    time: '16:00',
    venue: 'Wembley Stadium',
    stage: 'Group Stage',
    group: 'C',
    status: 'completed'
  },
  {
    id: '6',
    homeTeam: 'Brazil',
    awayTeam: 'Spain',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-25',
    time: '21:00',
    venue: 'Maracanã',
    stage: 'Group Stage',
    group: 'G',
    status: 'scheduled'
  },
  {
    id: '7',
    homeTeam: 'France',
    awayTeam: 'Portugal',
    homeScore: 3,
    awayScore: 2,
    date: '2026-06-28',
    time: '18:30',
    venue: 'Parc des Princes',
    stage: 'Group Stage',
    group: 'F',
    status: 'completed'
  },
  {
    id: '8',
    homeTeam: 'England',
    awayTeam: 'Germany',
    homeScore: 2,
    awayScore: 1,
    date: '2026-07-01',
    time: '20:00',
    venue: 'Allianz Arena',
    stage: 'Group Stage',
    group: 'C',
    status: 'scheduled'
  }
];

// Create the context with proper typing
const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Parse team data
      const teams = parseWorldCupData();
      setTeamsData(teams);
      setFilteredTeams(teams);
      
      // Set matches
      setFilteredMatches(sampleMatches);
      
      // Select first team by default
      if (teams.length > 0 && !selectedTeam) {
        setSelectedTeam(teams[0]);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load team data');
      setIsLoading(false);
      console.error('Error initializing team data:', err);
    }
  }, []);

  // Update team data
  const updateTeamData = (teamId: string, updates: Partial<Team>) => {
    setTeamsData(prevTeams =>
      prevTeams.map(team =>
        team.id === teamId ? { ...team, ...updates } : team
      )
    );
    
    // Update selected team if it's the one being updated
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(prev => prev ? { ...prev, ...updates } : null);
    }
    
    // Update filtered teams if needed
    setFilteredTeams(prevFiltered =>
      prevFiltered.map(team =>
        team.id === teamId ? { ...team, ...updates } : team
      )
    );
  };

  // Filter teams by search query
  const filterTeams = (query: string) => {
    if (!query.trim()) {
      setFilteredTeams(teamsData);
      setFilteredMatches(sampleMatches);
      return;
    }

    const searchLower = query.toLowerCase();
    
    // Filter teams
    const filtered = teamsData.filter(team =>
      team.name.toLowerCase().includes(searchLower) ||
      team.group.toLowerCase().includes(searchLower) ||
      team.venue.toLowerCase().includes(searchLower) ||
      team.code.toLowerCase().includes(searchLower)
    );
    setFilteredTeams(filtered);

    // Filter matches involving filtered teams
    const teamNames = filtered.map(team => team.name);
    const filteredMatchesList = sampleMatches.filter(match =>
      teamNames.includes(match.homeTeam) || teamNames.includes(match.awayTeam)
    );
    setFilteredMatches(filteredMatchesList);
  };

  // Find team by name
  const findTeamByName = (teamName: string): Team | undefined => {
    return teamsData.find(team => 
      team.name.toLowerCase() === teamName.toLowerCase()
    );
  };

  // Set selected team by name
  const selectTeamByName = (teamName: string) => {
    const team = findTeamByName(teamName);
    if (team) {
      setSelectedTeam(team);
    }
  };

  // Get matches for a specific team
  const getTeamMatches = (teamName: string): Match[] => {
    return sampleMatches.filter(match =>
      match.homeTeam === teamName || match.awayTeam === teamName
    );
  };

  // Context value
  const contextValue: TeamContextType = {
    teamsData,
    selectedTeam,
    filteredTeams,
    filteredMatches,
    setSelectedTeam,
    setFilteredTeams,
    setFilteredMatches,
    updateTeamData,
    isLoading,
    error
  };

  // Additional helper functions (not part of the interface, but useful)
  const helpers = {
    filterTeams,
    findTeamByName,
    selectTeamByName,
    getTeamMatches
  };

  return (
    <TeamContext.Provider value={contextValue}>
      {children}
    </TeamContext.Provider>
  );
}

// Custom hook for using the team context
export function useTeam() {
  const context = useContext(TeamContext);
  
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  
  return context;
}

// Export the context itself for direct consumption if needed
export { TeamContext };
