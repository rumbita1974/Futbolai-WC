// types/index.ts
export interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
  dateOfBirth: string; // ISO date string
  nationality: string;
  club: string;
  height?: number; // in cm
  weight?: number; // in kg
  imageUrl?: string;
  caps?: number; // international appearances
  goals?: number;
}

export interface WikipediaPlayer {
  name: string;
  imageUrl?: string;
  position: string;
  birthDate: string;
  age: number;
  caps: number;
  club: string;
  nationality?: string;
  height?: number;
  weight?: number;
  goals?: number;
}

export interface Team {
  id: string;
  name: string;
  code: string; // FIFA code (e.g., ARG, BRA)
  group: string;
  flagUrl: string;
  venue: string;
  city?: string; // Host city for this team
  matches: Match[];
  players: Player[];
  wikipediaPlayers?: WikipediaPlayer[]; // For Wikipedia integration
  fifaRanking?: number;
  worldCupAppearances?: number;
  bestResult?: string;
  coach?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string; // ISO date string
  time: string; // "HH:mm" format
  venue: string;
  stage: string; // "Group Stage", "Round of 16", etc.
  group?: string; // Only for group stage matches
  status: 'scheduled' | 'in_progress' | 'completed';
  weather?: string;
  temperature?: number;
  attendance?: number;
  referees?: string[];
  homeTeamId?: string;
  awayTeamId?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  openingYear?: number;
  surface?: string;
  roofType?: string;
  homeTeams?: string[]; // Teams that call this venue home
}

export interface GroupedMatches {
  [date: string]: Match[];
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageid?: number;
  description?: string;
}

export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  yellowCards: number;
  redCards: number;
}

export interface GroupStandings {
  group: string;
  teams: {
    team: Team;
    stats: TeamStats;
    position: number;
  }[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
  description?: string;
  imageUrl?: string;
}

export interface FilterOptions {
  date?: string;
  stage?: string;
  venue?: string;
  group?: string;
  team?: string;
  status?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Context Types
export interface TeamContextType {
  teamsData: Team[];
  selectedTeam: Team | null;
  filteredTeams: Team[];
  filteredMatches: Match[];
  setSelectedTeam: (team: Team | null) => void;
  setFilteredTeams: (teams: Team[]) => void;
  setFilteredMatches: (matches: Match[]) => void;
  updateTeamData: (teamId: string, updates: Partial<Team>) => void;
  isLoading: boolean;
  error: string | null;
}

// Props Types for Components
export interface FootballAIProps {
  initialMessage?: string;
  onClose?: () => void;
  compact?: boolean;
}

export interface FootballSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export interface GroupStageFixturesProps {
  matches?: Match[];
  onTeamClick?: (teamName: string) => void;
  onMatchClick?: (match: Match) => void;
  showFilters?: boolean;
  initialExpandedGroups?: string[];
}

export interface TeamDetailsPanelProps {
  team: Team | null;
  onClose?: () => void;
  showVenueMap?: boolean;
  showPlayerDetails?: boolean;
  fetchWikipediaData?: boolean;
}

export interface VenueMapProps {
  highlightedCity?: string;
  highlightedVenueId?: string;
  onVenueClick?: (venue: Venue) => void;
  onCityClick?: (city: City) => void;
  interactive?: boolean;
  showLegend?: boolean;
  showStats?: boolean;
  venues?: Venue[];
}

export interface VideoPlayerProps {
  videoId?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
}

// Utility Types
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: keyof Match | keyof Team | keyof Venue;
  direction: SortDirection;
}

// Event Types
export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty';
  minute: number;
  player?: string;
  team: string;
  description?: string;
  extraTime?: boolean;
}

// Weather Types
export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface VenueWeather {
  venueId: string;
  forecasts: WeatherForecast[];
  lastUpdated: string;
}