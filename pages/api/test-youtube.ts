import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      error: 'YOUTUBE_API_KEY not set in environment variables',
      suggestion: 'Add it in Vercel dashboard → Settings → Environment Variables'
    });
  }

  try {
    const searchTerm = query ? `${query} football highlights 2024 latest` : 'football highlights 2024 latest';
    
    console.log('🎬 Testing YouTube API with:', searchTerm);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: searchTerm,
        type: 'video',
        maxResults: 3,
        key: apiKey,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
        order: 'relevance',
        videoDuration: 'medium',
        relevanceLanguage: 'en',
      },
    });

    const videos = response.data.items?.map((item: any, index: number) => ({
      index,
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description?.substring(0, 100) + '...',
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      channel: item.snippet.channelTitle
    })) || [];

    res.status(200).json({
      success: true,
      query: searchTerm,
      hasKey: true,
      quotaAvailable: true,
      videosFound: response.data.items?.length || 0,
      videos: videos,
      selectedRandom: videos.length > 0 
        ? videos[Math.floor(Math.random() * Math.min(3, videos.length))]
        : null
    });
    
  } catch (error: any) {
    console.error('YouTube API test error:', error.message);
    
    res.status(200).json({
      success: false,
      error: error.message,
      status: error.response?.status,
      hasKey: true,
      quotaAvailable: error.response?.status !== 403,
      details: error.response?.data || 'No additional details'
    });
  }
}