'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import InstagramErrorBoundary from './InstagramErrorBoundary';
import './InstagramFeed.css';

type InstagramPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: string;
  thumbnail_url?: string;
};

type GridConfig = {
  positions: Record<number, string>;
};

const ImagePlaceholder = () => (
  <div className="instagram-post bg-gray-100">
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="w-full h-64 flex flex-col items-center justify-center text-red-500">
    <p className="mb-2">Error loading Instagram posts</p>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

const InstagramPost = ({ post }: { post: InstagramPost }) => {
  const imageUrl = post.media_type === 'CAROUSEL_ALBUM' && post.thumbnail_url 
    ? post.thumbnail_url 
    : post.media_url;
  const caption = post.caption?.replace(/#[a-zA-Z0-9]+/g, '').trim() || '';

  if (!imageUrl) return <ImagePlaceholder />;

  return (
    <div className="instagram-post">
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={caption || 'Instagram post'}
          className="post-media"
          width={300}
          height={300}
          priority
        />
        {post.media_type === 'CAROUSEL_ALBUM' && (
          <div className="media-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm16-8V6h-2v2h2zm0 5h-2v2h2v-2zm0 5h-2v2h2v-2zM8 6h8v2H8V6zm0 5h8v2H8v-2zm0 5h8v2H8v-2z"/>
            </svg>
          </div>
        )}
      </div>
      {caption && (
        <div className="post-overlay">
          <p className="post-caption">
            {caption.length > 100 ? `${caption.slice(0, 100)}...` : caption}
          </p>
        </div>
      )}
    </div>
  );
};

const InstagramFeedContent = ({ config }: { config: GridConfig }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postIds = Object.values(config.positions)
          .map(url => {
            const match = url.match(/instagram\.com\/p\/([^\/]+)/);
            return match?.[1] || '';
          })
          .filter(Boolean);

        if (!postIds.length) {
          throw new Error('No valid Instagram post IDs found');
        }

        const response = await fetch('/api/instagram-feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }

        const data = await response.json();
        if (!data.posts?.length) {
          throw new Error('No posts available');
        }

        setPosts(data.posts);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [config]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Some posts may be temporarily unavailable" />;
  if (!posts.length) return <ErrorMessage message="Please check back later" />;

  const gridPosts = Array(10).fill(null).map((_, index) => {
    const position = index + 1;
    const postUrl = config.positions[position];
    const postId = postUrl?.match(/instagram\.com\/p\/([^\/]+)/)?.[1];
    return posts.find(post => post.permalink.includes(postId || ''));
  });

  return (
    <div className="w-full py-10 overflow-hidden">
      <div className="w-full px-8 max-w-[2000px] mx-auto">
        <h2 className="text-xl font-medium text-main-maroon">
          FOLLOW US ON INSTAGRAM
        </h2>
      </div>
      
      <div className="instagram-grid-container">
        <div className="instagram-grid">
          {gridPosts.map((post, index) => (
            post ? (
              <a
                key={`${post.id}-${index}`}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-opacity hover:opacity-90"
              >
                <InstagramPost post={post} />
              </a>
            ) : (
              <ImagePlaceholder key={`placeholder-${index}`} />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const InstagramFeed = ({ config }: { config: GridConfig }) => (
  <div className="w-full overflow-hidden">
    <InstagramErrorBoundary>
      <InstagramFeedContent config={config} />
    </InstagramErrorBoundary>
  </div>
);

export default InstagramFeed;
