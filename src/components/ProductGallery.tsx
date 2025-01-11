'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    const video = videoRef.current;
    if (isActive) {
      video.play();
    } else {
      video.pause();
    }
  }, [isActive, isClient]);

  if (!sources?.length) return null;

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
    <div className="w-full h-full relative bg-secondary-peach">
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

  // Preload images
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

  return (
    <div className="w-full h-[700px] md:h-screen sticky top-0 bg-secondary-peach max-sm:border-b max-sm:border-[0.5px] max-sm:border-main-maroon">
      {/* Loading state */}
      <div 
        className={cn(
          "absolute inset-0 bg-secondary-peach flex items-center justify-center transition-opacity duration-300 z-50",
          preloaded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Image slider container */}
      <div className="absolute inset-0 overflow-hidden bg-secondary-peach">
        <div 
          className={cn(
            "flex h-full",
            "transition-all duration-500 ease-out",
            preloaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}%))`
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
                <div 
                  className="relative w-full h-full bg-secondary-peach"
                >
                  <Image
                    src={item.node.image?.originalSrc || ''}
                    alt={item.node.image?.altText || title}
                    fill
                    quality={85}
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className={cn(
                      "max-sm:object-cover md:object-cover",
                      "transition-transform duration-300"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Left-aligned thumbnails - desktop only */}
      <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-12 z-10">
        <div className="flex flex-col gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                updateMedia(index);
              }}
              className={cn(
                "relative w-full aspect-square overflow-hidden transition-all duration-200 rounded-sm bg-secondary-peach",
                currentIndex === index 
                  ? "opacity-100 border-2 border-secondary-peach" 
                  : "opacity-50 hover:opacity-80 border border-main-maroon/30"
              )}
            >
              {item.node.mediaContentType === 'VIDEO' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4l14 8-14 8V4z"/>
                  </svg>
                </div>
              ) : (
                <Image
                  src={item.node.image?.originalSrc || ''}
                  alt={item.node.image?.altText || `View ${index + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        {/* Navigation Buttons */}
        <button 
          onClick={() => currentIndex > 0 && updateMedia(currentIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 aspect-square bg-secondary-peach text-main-maroon rounded-full hover:bg-[#FFB6A3] transition-colors z-10 flex items-center justify-center shadow-sm"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button 
          onClick={() => currentIndex < media.length - 1 && updateMedia(currentIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 aspect-square bg-secondary-peach text-main-maroon rounded-full hover:bg-[#FFB6A3] transition-colors z-10 flex items-center justify-center shadow-sm"
          disabled={currentIndex === media.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom dots */}
        <div className="absolute bottom-6 left-0 right-0 px-4 z-10">
          <div className="flex items-center justify-center gap-2">
            {media.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "w-6 bg-main-maroon" 
                    : "bg-main-maroon/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Image counter */}
        <div className="absolute top-4 right-4">
          <div className="bg-main-maroon/80 backdrop-blur-sm text-secondary-peach text-xs px-2.5 py-1 rounded-full">
            {currentIndex + 1} / {media.length}
          </div>
        </div>
      </div>
    </div>
  );
}
