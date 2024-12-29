'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import InstagramErrorBoundary from './InstagramErrorBoundary';
import './InstagramFeed.css';

interface InstagramProfile {
  id: string;
  username: string;
  profile_picture_url: string;
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

const InstagramFeedContent: React.FC = () => {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/instagram-feed');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setProfile(data.profile);
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderPost = (post: InstagramPost) => {
    const caption = post.caption?.replace(/#[a-zA-Z0-9]+/g, '').trim() || '';
    return (
      <div className="instagram-post">
        {post.media_type === 'VIDEO' ? (
          <video
            src={post.media_url}
            className="post-media"
            muted
            playsInline
            loop
          />
        ) : (
          <Image
            src={post.media_url}
            alt="Instagram post"
            className="post-media"
            width={300}
            height={300}
            priority
          />
        )}
        <div className="post-overlay">
          <p className="post-caption">
            {caption.length > 100 ? `${caption.slice(0, 100)}...` : caption}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        Error loading Instagram posts: {error}
      </div>
    );
  }

  // Create duplicated posts array for seamless scrolling
  const duplicatedPosts = [...posts, ...posts, ...posts];

  return (
    <div className="relative w-full py-10">
      <h2 className="text-2xl font-bold italic text-center tracking-widest mb-6 text-main-maroon">#ADASTUDIOS</h2>
      
      <div id="instagram-container">
        <div className="instagram-scroll">
          {duplicatedPosts.map((post, index) => (
            <a
              key={`${post.id}-${index}`}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              {renderPost(post)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const InstagramFeed: React.FC = () => {
  return (
    <InstagramErrorBoundary>
      <InstagramFeedContent />
    </InstagramErrorBoundary>
  );
};

export default InstagramFeed;
