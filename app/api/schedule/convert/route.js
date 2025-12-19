import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseScheduleText } from '@/utils/parseSchedule';

export async function GET() {
  try {
    console.log('Starting schedule conversion...');
    
    // Path to your TXT file
    const txtPath = path.join(process.cwd(), 'data', 'FIFA-World-Cup-2026-schedule.txt');
    
    console.log('Looking for file at:', txtPath);
    
    if (!fs.existsSync(txtPath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found',
          searchedPath: txtPath,
          tip: 'Make sure your file is at D:\\FutbolAi\\data\\FIFA-World-Cup-2026-schedule.txt'
        },
        { status: 404 }
      );
    }
    
    // Read the file
    const content = fs.readFileSync(txtPath, 'utf8');
    console.log('File size:', content.length, 'characters');
    
    // Parse using our new parser
    const matches = parseScheduleText(content);
    
    console.log('Successfully parsed', matches.length, 'matches');
    
    if (matches.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matches parsed',
        sampleContent: content.substring(0, 200),
        tip: 'Check the parser for your file format'
      });
    }
    
    // Save JSON files
    const dataDir = path.join(process.cwd(), 'data');
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    
    // Ensure directories exist
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
    
    // Save to both locations
    const jsonPath = path.join(dataDir, 'schedule.json');
    const publicJsonPath = path.join(publicDataDir, 'schedule.json');
    
    fs.writeFileSync(jsonPath, JSON.stringify(matches, null, 2), 'utf8');
    fs.writeFileSync(publicJsonPath, JSON.stringify(matches, null, 2), 'utf8');
    
    // Create a summary
    const groupMatches = matches.filter(m => m.stage === 'group');
    const knockoutMatches = matches.filter(m => m.stage !== 'group');
    
    return NextResponse.json({
      success: true,
      summary: {
        totalMatches: matches.length,
        groupStage: groupMatches.length,
        knockoutStage: knockoutMatches.length,
        firstMatch: matches[0],
        lastMatch: matches[matches.length - 1]
      },
      savedTo: [jsonPath, publicJsonPath],
      message: `Successfully converted ${matches.length} matches (${groupMatches.length} group, ${knockoutMatches.length} knockout)`
    });
    
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}