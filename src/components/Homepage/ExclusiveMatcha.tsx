'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../CurrencyProvider';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useVideoLoader } from '../../hooks/useVideoLoader';
import { ExclusiveMatchaProduct } from '../../types/product';

interface ExclusiveMatchaProps {
  products: ExclusiveMatchaProduct[];
}

export default function ExclusiveMatcha({ products: allProducts }: ExclusiveMatchaProps) {
  // Filter out out-of-stock products using useMemo
  const products = useMemo(() => 
    allProducts.filter(product => product.availableForSale),
    [allProducts]
  );
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { convertPrice } = useCurrency();
  const isMobile = useIsMobile();
  const {
    isVideoVisible,
    isVideoLoaded,
    videoRef,
    videoContainerRef,
    handleVideoLoad,
    handleVideoError
  } = useVideoLoader({ isMobile });

  // Preload images
  useEffect(() => {
    if (products.length === 0) return;
    setIsLoading(true);

    Promise.all(
      products.map(product => 
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = product.imageUrl;
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(product.imageUrl));
            resolve();
          };
          img.onerror = () => resolve();
        })
      )
    ).finally(() => setIsLoading(false));
  }, [products]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!products || products.length === 0) {
    return null;
  }

  const isImageLoaded = (imageUrl: string) => loadedImages.has(imageUrl);

  return (
    <section className="w-full h-auto md:h-[600px] flex flex-col md:flex-row border-y-[1px] border-main-maroon">
      {/* Left Side - Video (hidden on mobile) */}
      {!isMobile && (
        <div ref={videoContainerRef} className="hidden md:block md:w-1/2 relative overflow-hidden bg-secondary-peach aspect-video md:aspect-auto md:h-full">
          {isVideoVisible && (
            <video 
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay 
              loop 
              muted 
              playsInline
              preload="none"
              poster={products[0]?.imageUrl}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
            >
              <source src="/MatchaVideo.webm" type="video/webm" />
              <source src="/MatchaVideo.mp4" type="video/mp4" />
              {/* Fallback for when video fails to load */}
              <div className="absolute inset-0 bg-secondary-peach">
                <Image
                  src={products[0]?.imageUrl || "/placeholder.jpg"}
                  alt="Matcha Video Fallback"
                  fill
                  className="object-cover"
                  priority={false}
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </video>
          )}
          {(!isVideoVisible || !isVideoLoaded) && (
            <div className="absolute inset-0 bg-secondary-peach">
              <Image
                src={products[0]?.imageUrl || "/placeholder.jpg"}
                alt="Matcha Preview"
                fill
                className="object-cover"
                priority
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      )}

      {/* Product Slider (full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2 bg-main-maroon flex items-center justify-center min-h-[400px] md:min-h-full py-6 md:py-12">
        <div className="relative w-full flex items-center">
          {/* Left Navigation Button */}
          <button 
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 md:w-11 aspect-square bg-secondary-peach text-secondary-peach rounded-full hover:bg-[#FFB6A3] transition-colors z-10 flex items-center justify-center shadow-sm"
            disabled={isLoading}
          >
            <ChevronLeft className="w-5 h-5 text-main-maroon" />
          </button>

          <div className="w-full max-w-[480px] px-6 md:px-12 mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-sm md:text-xl font-medium mb-1 md:mb-2 text-center text-secondary-peach tracking-wider">EXCLUSIVE MATCHA</div>
              <div className="mb-6 md:mb-8"></div>

              {/* Product Display */}
              <div className="w-full max-w-[220px] md:max-w-[280px]">
                <Link href={`/product/${products[currentSlide].handle}`}>
                  <div className="bg-secondary-peach p-3 md:p-4 rounded-lg relative aspect-[3/4] overflow-hidden group cursor-pointer border border-transparent hover:border-secondary-peach transition-colors">
                    {/* Hidden preload container - optimized */}
                    <div className="hidden">
                      {products.map((product) => (
                        <Image
                          key={product.id}
                          src={product.imageUrl}
                          alt="preload"
                          width={1}
                          height={1}
                          priority={false}
                          quality={85}
                        />
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {products.map((product, index) => (
                        index === currentSlide && isImageLoaded(product.imageUrl) && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-secondary-peach"
                          >
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 260px, 280px"
                              priority={index === 0}
                              quality={85}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            />
                            {/* Out of Stock Overlay */}
                            {!product.availableForSale && (
                              <div className="absolute inset-0 bg-gradient-to-t from-main-maroon to-transparent z-10 flex items-center justify-center">
                                <span className="text-secondary-peach px-4 py-2 text-lg font-medium">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>

                    {/* Loading state */}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary-peach">
                        <div className="w-8 h-8 border-2 border-main-maroon border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`text-${currentSlide}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 md:mt-3 text-center group-hover:opacity-80 transition-opacity"
                    >
                      <h2 className="text-base md:text-lg font-semibold text-secondary-peach truncate px-2">
                        {products[currentSlide].name}
                      </h2>
                      <p className={`text-sm md:text-base mt-1 text-secondary-peach ${!products[currentSlide].availableForSale ? "line-through opacity-70" : ""}`}>
                        {convertPrice(products[currentSlide].price)}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Navigation Button */}
          <button 
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 md:w-11 aspect-square bg-secondary-peach text-main-maroon rounded-full hover:bg-[#FFB6A3] transition-colors z-10 flex items-center justify-center shadow-sm"
            disabled={isLoading}
          >
            <ChevronRight className="w-5 h-5 text-[#800020]" />
          </button>
        </div>
      </div>
    </section>
  );
};
