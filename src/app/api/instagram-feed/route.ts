import { NextResponse } from 'next/server';

type InstagramPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: string;
  thumbnail_url?: string;
};

type InstagramApiResponse = {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
};

async function fetchInstagramPosts(postIds: string[]): Promise<InstagramPost[]> {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is not configured');
  }

  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=100&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Instagram API error: ${JSON.stringify(error)}`);
  }

  const data: InstagramApiResponse = await response.json();
  if (!data.data?.length) {
    throw new Error('No posts returned from Instagram API');
  }

  // Create a Set of requested IDs for faster lookup
  const requestedIds = new Set(postIds);

  // Filter posts to match requested IDs and exclude videos
  return data.data.filter(post => {
    if (post.media_type === 'VIDEO') return false;
    const postId = post.permalink.split('/p/')[1]?.replace(/\//g, '');
    return postId && requestedIds.has(postId);
  });
}

export async function POST(request: Request) {
  try {
    const { postIds } = await request.json();

    if (!Array.isArray(postIds)) {
      return NextResponse.json(
        { message: 'postIds must be an array of strings' },
        { status: 400 }
      );
    }

    const posts = await fetchInstagramPosts(postIds);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error fetching Instagram posts' },
      { status: 500 }
    );
  }
}
