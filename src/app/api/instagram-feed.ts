// pages/api/instagram-feed.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface InstagramApiResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: string;
  thumbnail_url?: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    if (!mediaResponse.ok) throw new Error('Failed to fetch from Instagram');
    
    const data: InstagramApiResponse = await mediaResponse.json();
    return res.status(200).json(data.data);
  } catch (error) {
    console.error('Instagram API error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error fetching Instagram posts' 
    });
  }
}