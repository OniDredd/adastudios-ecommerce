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

  return (
    <div className="w-full h-screen sticky top-0">
      {/* Main image background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={images[currentImage].node.originalSrc}
          alt={images[currentImage].node.altText || title}
          fill
          className="object-cover w-full h-full"
          priority
          sizes="100vw"
        />
      </div>

      {/* Left-aligned, vertically centered thumbnails */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-16 z-10">
        <div className="flex flex-col gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative w-full aspect-square rounded-md overflow-hidden transition-all duration-200",
                "hover:opacity-100 border border-secondary-peach",
                currentImage === index 
                  ? "ring-1 ring-secondary-peach ring-offset-1 ring-offset-black/20 opacity-100" 
                  : "opacity-70 hover:opacity-90"
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
