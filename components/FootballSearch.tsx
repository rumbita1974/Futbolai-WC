'use client'

import { useState } from 'react';
import { Search } from 'lucide-react';

interface FootballSearchProps {
  onPlayerSelect: (player: any) => void;
  onTeamSelect: (team: any) => void;
  onVideoFound: (url: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function FootballSearch({
  onPlayerSelect,
  onTeamSelect,
  onVideoFound,
  onLoadingChange,
}: FootballSearchProps) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onLoadingChange(true);
    
    // Mock search - will connect to your API
    setTimeout(() => {
      const mockPlayer = {
        id: 1,
        name: 'Lionel Messi',
        position: 'Forward',
        nationality: 'Argentina',
        club: 'Inter Miami',
        age: 36,
        goals: 821,
        assists: 357,
        appearances: 1034,
        rating: 9.3,
      };
      
      onPlayerSelect(mockPlayer);
      onVideoFound('https://www.youtube.com/embed/ZO0d8r_2qGI');
      onLoadingChange(false);
    }, 1000);
  };

  const quickSearches = ['Messi', 'World Cup 2026', 'Argentina', 'Reyes Alamo', 'Brazil', 'Mbappé'];

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
        ⚽ Football AI Search
      </h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
          }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, teams, World Cup 2026..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem',
              color: 'white',
              fontSize: '1rem',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(to right, #4ade80, #22d3ee)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {quickSearches.map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}