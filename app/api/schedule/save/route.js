import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { matches } = await request.json();
    
    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: 'Invalid matches data' },
        { status: 400 }
      );
    }
    
    // Your data folder is at project root: D:\FutbolAi\data\
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create if doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save JSON file
    const jsonPath = path.join(dataDir, 'schedule.json');
    fs.writeFileSync(jsonPath, JSON.stringify(matches, null, 2), 'utf8');
    
    // Also save to public folder for client access
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true });
    }
    const publicJsonPath = path.join(publicDataDir, 'schedule.json');
    fs.writeFileSync(publicJsonPath, JSON.stringify(matches, null, 2), 'utf8');
    
    return NextResponse.json({
      success: true,
      message: `Saved ${matches.length} matches`,
      locations: {
        projectData: jsonPath,
        publicData: publicJsonPath
      }
    });
    
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule', details: error.message },
      { status: 500 }
    );
  }
}