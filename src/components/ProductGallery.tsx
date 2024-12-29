'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';

interface ProductGalleryProps {
  images: Array<{
    node: {
      originalSrc: string;
      altText: string | null;
    };
  }>;
  title: string;
  selectedImageIndex?: number;
}

export function ProductGallery({ images, title, selectedImageIndex }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // Update current image when selectedImageIndex changes
  useEffect(() => {
    if (selectedImageIndex !== undefined) {
      setCurrentImage(selectedImageIndex);
    }
  }, [selectedImageIndex]);

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
      if (diff > 0 && currentImage > 0) {
        setCurrentImage(prev => prev - 1);
      } else if (diff < 0 && currentImage < images.length - 1) {
        setCurrentImage(prev => prev + 1);
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
            transform: `translateX(calc(-${currentImage * 100}% + ${dragOffset}px))`
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative"
            >
              <Image
                src={image.node.originalSrc}
                alt={image.node.altText || title}
                fill
                className="object-cover w-full h-full"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image dots - only on mobile */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentImage === index 
                ? "bg-secondary-peach w-4" 
                : "bg-secondary-peach/50"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Left-aligned, vertically centered thumbnails - only on desktop */}
      <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-16 z-10">
        <div className="flex flex-col gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative w-full aspect-square overflow-hidden transition-all duration-200 rounded-sm",
                currentImage === index 
                  ? "opacity-100 border-2 border-secondary-peach" 
                  : "opacity-50 hover:opacity-80 border border-secondary-peach/30"
              )}
            >
              <Image
                src={image.node.originalSrc}
                alt={image.node.altText || `View ${index + 1}`}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 64px) 100vw"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
