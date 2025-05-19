'use client';

import React from 'react';
import Image from 'next/image';
import './InstagramFeed.css';

type GridConfig = {
  positions: {
    [key: number]: string;
  };
};

type LocalInstagramPost = {
  id: string;
  imageUrl: string;
  permalink: string;
  caption?: string;
  isCarousel?: boolean;
};

// Helper component for posts that fail to load
const ImagePlaceholder = () => (
  <div className="instagram-post bg-secondary-peach flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="w-full py-8 flex justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-maroon"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="w-full py-8 text-center">
    <p className="text-gray-500 mb-2">Unable to load Instagram feed</p>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

const InstagramPost = ({ post }: { post: LocalInstagramPost }) => {
  const caption = post.caption?.replace(/#[a-zA-Z0-9]+/g, '').trim() || '';

  return (
    <div className="instagram-post">
      <div className="relative w-full h-full rounded-xl">
        <Image
          src={post.imageUrl}
          alt={caption || 'Instagram post'}
          className="post-media"
          width={600}
          height={600}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
        />
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

const InstagramFeed = ({ config }: { config: GridConfig }) => {
  // Main Instagram profile URL
  const instagramProfileUrl = "https://www.instagram.com/adastudionz/";
  
  // Map position numbers directly to local images
  const localPosts: LocalInstagramPost[] = Object.entries(config.positions).map(([position, url]) => {
    // Extract Instagram post ID from URL for debugging/reference purposes only
    const postId = url.match(/instagram\.com\/p\/([^\/]+)/)?.[1] || '';
    
    // Map each position to the corresponding numbered image file
    const imageIndex = parseInt(position);
    
    // Use deterministic values instead of Math.random() to avoid hydration mismatch
    const isCarousel = imageIndex % 3 === 0; // Every 3rd post will be a carousel
    
    return {
      id: postId,
      imageUrl: `/instagram/instagramphoto${imageIndex}.jpeg`,
      permalink: instagramProfileUrl, // Use main profile URL instead of individual post URLs
      caption: `Follow us on Instagram @adastudionz`,
      isCarousel
    };
  });

  return (
    <section className="w-full py-8 md:py-12">
      <div className="w-full overflow-hidden">
        <div className="instagram-grid-container">
          <h2 className="text-xl font-medium text-main-maroon mb-4">
            FOLLOW US ON INSTAGRAM
          </h2>
          <div className="instagram-grid">
            {localPosts.map((post, index) => (
              <a
                key={`${post.id}-${index}`}
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-opacity hover:opacity-90 rounded-xl"
              >
                <InstagramPost post={post} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
