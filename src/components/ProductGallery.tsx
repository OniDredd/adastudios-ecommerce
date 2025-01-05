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
      <div className="w-full h-full relative bg-secondary-peach">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative group bg-secondary-peach"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary-peach flex items-center justify-center">
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
    <div className="w-full h-full relative bg-secondary-peach flex items-center justify-center">
      <div className="text-main-maroon">
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
  onMediaChange?: (index: number) => void;
}

export function ProductGallery({ media, title, selectedMediaIndex, onMediaChange }: ProductGalleryProps) {
  // Use selectedMediaIndex as the source of truth if provided, otherwise use internal state
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = selectedMediaIndex ?? internalIndex;
  const [preloaded, setPreloaded] = useState(false);

  const updateMedia = (index: number) => {
    if (onMediaChange) {
      onMediaChange(index);
    } else {
      setInternalIndex(index);
    }
    console.log('Gallery updating to index:', index);
  };

  // Preload all images on mount
  useEffect(() => {
    const imageUrls = media
      .filter(item => item.node.mediaContentType === 'IMAGE' && item.node.image?.originalSrc)
      .map(item => item.node.image!.originalSrc);

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach(url => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setPreloaded(true);
        }
      };
      img.src = url;
    });
  }, [media]);

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
      const newIndex = diff > 0 
        ? currentIndex > 0 ? currentIndex - 1 : 0
        : currentIndex < media.length - 1 ? currentIndex + 1 : media.length - 1;
      
      updateMedia(newIndex);
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
    <div className="w-full h-[100dvh] md:h-screen sticky top-0 bg-secondary-peach max-sm:border-b max-sm:border-[0.5px] max-sm:border-main-maroon">
      {/* Loading state */}
      <div 
        className={cn(
          "absolute inset-0 bg-secondary-peach flex items-center justify-center transition-opacity duration-300",
          preloaded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
      </div>
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
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing bg-secondary-peach"
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
            "flex h-full",
            isDragging ? "transition-none" : "transition-all duration-500 ease-out",
            preloaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
          }}
        >
          {media.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative bg-secondary-peach"
            >
              {item.node.mediaContentType === 'VIDEO' ? (
                <VideoPlayer
                  sources={item.node.sources}
                  isActive={index === currentIndex}
                  index={index}
                />
              ) : (
                <div className="relative w-full h-full bg-secondary-peach">
                  <Image
                    src={item.node.image?.originalSrc || ''}
                    alt={item.node.image?.altText || title}
                    fill
                    quality={85}
                    priority={index === 0}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    className="object-cover w-full h-full"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </div>
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
            onClick={() => updateMedia(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index 
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
              onClick={() => updateMedia(index)}
              className={cn(
                "relative w-full aspect-square overflow-hidden transition-all duration-200 rounded-sm bg-secondary-peach",
                currentIndex === index 
                  ? "opacity-100 border-2 border-secondary-peach" 
                  : "opacity-50 hover:opacity-80 border border-main-maroon/30"
              )}
            >
              {item.node.mediaContentType === 'VIDEO' ? (
                <VideoThumbnail sources={item.node.sources} />
              ) : (
                <div className="relative w-full h-full bg-secondary-peach">
                  <Image
                    src={item.node.image?.originalSrc || ''}
                    alt={item.node.image?.altText || `View ${index + 1}`}
                    fill
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    sizes="48px"
                    className="object-cover w-full h-full"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
