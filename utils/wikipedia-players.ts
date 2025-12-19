// utils/wikipedia-players.ts
interface WikipediaPlayerInfo {
  name: string;
  position: string;
  birthDate: string;
  club: string;
  imageUrl?: string;
  caps?: number;
}

export async function fetchTeamPlayers(teamName: string): Promise<WikipediaPlayerInfo[]> {
  // This is a placeholder - you'll need to implement actual Wikipedia API calls
  // or use GROQ to fetch player data
  
  // For now, return mock data based on team
  const mockPlayers: Record<string, WikipediaPlayerInfo[]> = {
    'Argentina': [
      {
        name: 'Lionel Messi',
        position: 'Forward',
        birthDate: '1987-06-24',
        age: 36,
        caps: 178,
        club: 'Inter Miami',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg'
      },
      {
        name: 'Emiliano Martínez',
        position: 'Goalkeeper',
        birthDate: '1992-09-02',
        age: 31,
        caps: 38,
        club: 'Aston Villa',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Emiliano_Mart%C3%ADnez_2021.jpg/320px-Emiliano_Mart%C3%ADnez_2021.jpg'
      }
    ],
    'Brazil': [
      {
        name: 'Neymar',
        position: 'Forward',
        birthDate: '1992-02-05',
        age: 32,
        caps: 128,
        club: 'Al Hilal',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg/320px-Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg'
      }
    ]
  };

  return mockPlayers[teamName] || [];
}

// Helper function to calculate age from birth date
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}