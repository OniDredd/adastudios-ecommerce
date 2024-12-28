import { NextResponse } from 'next/server';

interface InstagramProfile {
  id: string;
  username: string;
  profile_picture_url: string;
}

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

export async function GET() {
  try {
    // Fetch user profile information
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      {
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(`Failed to fetch profile from Instagram: ${JSON.stringify(errorData)}`);
    }

    const profile: InstagramProfile = await profileResponse.json();

    // Fetch media posts
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      { 
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      throw new Error(`Failed to fetch from Instagram: ${JSON.stringify(errorData)}`);
    }
    
    const data: InstagramApiResponse = await mediaResponse.json();
    return NextResponse.json({
      profile,
      posts: data.data
    });
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error fetching Instagram posts' },
      { status: 500 }
    );
  }
}
