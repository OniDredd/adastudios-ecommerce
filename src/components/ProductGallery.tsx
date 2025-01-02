'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';
import { ShopifyMediaEdge } from '../lib/shopify';

interface VideoSource {
  url: string;
  mimeType: string;
}

interface VideoPlayerProps {
  sources?: VideoSource[];
  isActive: boolean;
  index: number;
}

function VideoPlayer({ sources, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle video playback
  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    const video = videoRef.current;
    if (isActive) {
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently handle autoplay error
          });
        }
      } else {
        video.pause();
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isClient, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!sources?.length) return null;

  // Server-side or initial render
  if (!isClient) {
    return (
      <div className="w-full h-full relative bg-secondary-peach/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary-peach/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        playsInline
        loop
        muted
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
      >
        {sources.map((source, sourceIndex) => (
          <source
            key={sourceIndex}
            src={source.url}
            type={source.mimeType}
          />
        ))}
      </video>
      
      {/* Custom play/pause button */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-secondary-peach/10 transition-all duration-300",
          (showControls || !isPlaying) ? "opacity-100" : "opacity-0",
          isPlaying && !showControls ? "pointer-events-none" : "",
          "hover:bg-secondary-peach/20"
        )}
      >
        <button
          onClick={togglePlayPause}
          className="w-14 h-14 rounded-full bg-main-maroon/70 hover:bg-main-maroon/90 transition-all duration-200 flex items-center justify-center text-secondary-peach backdrop-blur-sm"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="5" width="3" height="14"/>
              <rect x="14" y="5" width="3" height="14"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function VideoThumbnail({ sources }: { sources?: VideoSource[] }) {
  if (!sources?.length) return null;

  return (
    <div className="w-full h-full relative bg-secondary-peach/20 flex items-center justify-center">
      <div className="text-secondary-peach">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </div>
    </div>
  );
}

interface ProductGalleryProps {
  media: ShopifyMediaEdge[];
  title: string;
  selectedMediaIndex?: number;
}

export function ProductGallery({ media, title, selectedMediaIndex }: ProductGalleryProps) {
  const [currentMedia, setCurrentMedia] = useState(0);

  // Update current media when selectedMediaIndex changes
  useEffect(() => {
    if (selectedMediaIndex !== undefined) {
      setCurrentMedia(selectedMediaIndex);
    }
  }, [selectedMediaIndex]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [showDragHint, setShowDragHint] = useState(true);

  // Hide drag hint after 3 seconds
  useEffect(() => {
    if (showDragHint) {
      const timer = setTimeout(() => setShowDragHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDragHint]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    const threshold = window.innerWidth * 0.2;

      if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentMedia > 0) {
        setCurrentMedia(prev => prev - 1);
      } else if (diff < 0 && currentMedia < media.length - 1) {
        setCurrentMedia(prev => prev + 1);
      }
    }

    setIsDragging(false);
  };

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Calculate drag offset
  const dragOffset = isDragging ? currentX - startX : 0;

  return (
    <div className="w-full h-[100dvh] md:h-screen sticky top-0 relative bg-secondary-peach max-sm:border-b max-sm:border-[0.5px] max-sm:border-main-maroon">
      {/* Drag hint - only on mobile */}
      {showDragHint && (
        <div className="md:hidden absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-maroon text-secondary-peach px-4 py-2 rounded-full text-sm animate-pulse">
            Swipe to view more
          </div>
        </div>
      )}
      {/* Image slider container */}
      <div 
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={cn(
            "flex transition-transform duration-300 ease-out h-full",
            isDragging && "transition-none"
          )}
          style={{
            transform: `translateX(calc(-${currentMedia * 100}% + ${dragOffset}px))`
          }}
        >
          {media.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative"
            >
              {item.node.mediaContentType === 'VIDEO' ? (
                <VideoPlayer
                  sources={item.node.sources}
                  isActive={index === currentMedia}
                  index={index}
                />
              ) : (
                <Image
                  src={item.node.image?.originalSrc || ''}
                  alt={item.node.image?.altText || title}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image dots - only on mobile */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {media.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMedia(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentMedia === index 
                ? "bg-secondary-peach w-4" 
                : "bg-secondary-peach/50"
            )}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>

      {/* Left-aligned, vertically centered thumbnails - only on desktop */}
      <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-12 z-10">
        <div className="flex flex-col gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentMedia(index)}
              className={cn(
                "relative w-full aspect-square overflow-hidden transition-all duration-200 rounded-sm",
                currentMedia === index 
                  ? "opacity-100 border-2 border-secondary-peach" 
                  : "opacity-50 hover:opacity-80 border border-main-maroon/30"
              )}
            >
              {item.node.mediaContentType === 'VIDEO' ? (
                <VideoThumbnail sources={item.node.sources} />
              ) : (
                <Image
                  src={item.node.image?.originalSrc || ''}
                  alt={item.node.image?.altText || `View ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 64px) 100vw"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
