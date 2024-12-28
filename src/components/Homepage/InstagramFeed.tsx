'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
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
    const hashtags = post.caption?.match(/#[a-zA-Z0-9]+/g) || [];
    const captionWithoutHashtags = post.caption?.replace(/#[a-zA-Z0-9]+/g, '').trim();

    return (
      <article className="instagram-post">
        <header className="post-header">
          <div className="post-header-avatar">
            <Image
              src={profile?.profile_picture_url || "/adastudioslogo-maroon.svg"}
              alt={profile?.username || "Ada Studios"}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="post-header-info">
            <div className="post-header-username">{profile?.username || "adastudios"}</div>
          </div>
          <button className="post-header-more">
            <MoreHorizontal size={20} />
          </button>
        </header>

        <div className="post-image-container">
          {post.media_type === 'VIDEO' ? (
            <video
              src={post.media_url}
              className="post-image"
              muted
              playsInline
              loop
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={post.media_url}
                alt={captionWithoutHashtags?.slice(0, 100) || 'Instagram post'}
                className="post-image"
                width={400}
                height={400}
                priority
              />
            </div>
          )}
        </div>

        <div className="post-content">
          {(captionWithoutHashtags || hashtags.length > 0) && (
            <div className="post-caption">
              <span className="post-username">{profile?.username || "adastudios"}</span>{' '}
              {captionWithoutHashtags && (
                captionWithoutHashtags.length > 60 
                  ? `${captionWithoutHashtags.slice(0, 60)}...` 
                  : captionWithoutHashtags
              )}
              {hashtags.length > 0 && (
                <div className="post-hashtags">
                  {hashtags.slice(0, 2).join(' ')}
                  {hashtags.length > 2 && ' ...'}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
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
