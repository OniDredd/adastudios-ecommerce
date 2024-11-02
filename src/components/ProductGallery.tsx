'use client';

import { useState } from 'react';
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
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="w-1/2 h-screen sticky top-0">
      <div className="relative h-full">
        <Image
          src={images[selectedImage].node.originalSrc}
          alt={images[selectedImage].node.altText || title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="grid grid-cols-6 gap-2 bg-white/80 p-2 rounded-lg backdrop-blur-sm">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden",
                selectedImage === index && "ring-2 ring-black"
              )}
            >
              <Image
                src={image.node.originalSrc}
                alt={image.node.altText || `View ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
