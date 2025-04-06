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
  <div className="instagram-post bg-secondary-peach">
    <div className="w-full h-full flex items-center justify-center text-main-maroon">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="w-full h-64 flex items-center justify-center bg-secondary-peach ">
    <div className="w-12 h-12 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="w-full h-64 flex flex-col items-center justify-center text-main-maroon bg-secondary-peach">
    <p className="mb-2">Error loading Instagram posts</p>
    <p className="text-sm text-main-maroon/70">{message}</p>
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
      <div className="relative w-full h-full rounded-xl">
        <Image
          src={imageUrl}
          alt={caption || 'Instagram post'}
          className="post-media"
          width={600}
          height={600}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
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
    <div className="w-full overflow-hidden">
      <div className="instagram-grid-container">
        <h2 className="text-xl font-medium text-main-maroon mb-4">
          FOLLOW US ON INSTAGRAM
        </h2>
        <div className="instagram-grid">
          {gridPosts.map((post, index) => (
            post ? (
              <a
                key={`${post.id}-${index}`}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-opacity hover:opacity-90 rounded-xl"
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
  <section className="w-full py-8 md:py-12">
    <InstagramErrorBoundary>
      <InstagramFeedContent config={config} />
    </InstagramErrorBoundary>
  </section>
);

export default InstagramFeed;
