// pages/teams/[teamId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchWikipediaSummary } from '../../utils/wikipedia';
import VenueMap from '../../components/VenueMap';
import { Team } from '../../types';

// Mock data - you'll replace this with your actual team data
const mockTeams: Record<string, Team> = {
  'argentina': {
    id: 'argentina',
    name: 'Argentina',
    group: 'A',
    flagUrl: 'https://flagcdn.com/ar.svg',
    venue: 'Buenos Aires',
    matches: [],
    players: []
  },
  'brazil': {
    id: 'brazil',
    name: 'Brazil',
    group: 'G',
    flagUrl: 'https://flagcdn.com/br.svg',
    venue: 'Rio de Janeiro',
    matches: [],
    players: []
  }
};

interface WikipediaPlayer {
  name: string;
  imageUrl?: string;
  position: string;
  birthDate: string;
  age: number;
  caps: number;
  club: string;
}

export default function TeamDetailPage() {
  const router = useRouter();
  const { teamId } = router.query;
  const [team, setTeam] = useState<Team | null>(null);
  const [wikipediaSummary, setWikipediaSummary] = useState<string>('');
  const [players, setPlayers] = useState<WikipediaPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    // Get team from mock data (replace with your data source)
    const foundTeam = mockTeams[teamId as string];
    setTeam(foundTeam);

    // Fetch Wikipedia summary
    const fetchData = async () => {
      try {
        // Fetch team summary
        const summary = await fetchWikipediaSummary(foundTeam?.name || '');
        setWikipediaSummary(summary);

        // TODO: Fetch player data from Wikipedia/another API
        // For now, using mock player data
        setPlayers([
          {
            name: 'Lionel Messi',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
            position: 'Forward',
            birthDate: '1987-06-24',
            age: 36,
            caps: 178,
            club: 'Inter Miami'
          },
          // Add more players...
        ]);
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (loading) return <div className="p-8">Loading team data...</div>;
  if (!team) return <div className="p-8">Team not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Team Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={team.flagUrl} 
            alt={`${team.name} flag`}
            className="w-16 h-12 border border-gray-300"
          />
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Group {team.group}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Wikipedia Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">About {team.name}</h2>
            <p className="text-gray-700">{wikipediaSummary}</p>
          </div>

          {/* Team Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Team Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">FIFA Ranking:</span>
                <span className="font-medium">#1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">World Cup Appearances:</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Result:</span>
                <span className="font-medium">Champions (1978, 1986, 2022)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Home Venue:</span>
                <span className="font-medium">{team.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Roster */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Player Roster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              {player.imageUrl && (
                <img 
                  src={player.imageUrl} 
                  alt={player.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{player.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{player.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{player.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caps:</span>
                    <span className="font-medium">{player.caps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Club:</span>
                    <span className="font-medium">{player.club}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venue Map with Highlight */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Venue Location</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-4">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Highlighted in green: {team.venue} - Home venue for {team.name}
          </p>
          <div className="h-96">
            {/* We'll modify VenueMap to accept a highlight prop */}
            <VenueMap highlightedCity={team.venue} />
          </div>
        </div>
      </div>
    </div>
  );
}