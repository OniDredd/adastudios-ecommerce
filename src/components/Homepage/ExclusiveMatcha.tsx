'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../CurrencyProvider';

// Custom hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

interface Product {
  id: string;
  name: string;
  handle: string;
  price: number;
  imageUrl: string;
  availableForSale: boolean;
}

interface ExclusiveMatchaProps {
  products: Product[];
}

const ProductSlider = ({ products }: ExclusiveMatchaProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { convertPrice } = useCurrency();
  const isMobile = useIsMobile();


  // Video intersection observer - only run on non-mobile
  useEffect(() => {
    if (isMobile) {
      setIsVideoVisible(false);
      return;
    }

    const options = {
      root: null,
      rootMargin: '50px', // Start loading video slightly before it comes into view
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          if (videoRef.current) {
            videoRef.current.play().catch((error) => {
              // Silently handle video play error
            });
          }
        }
      });
    }, options);

    const currentRef = videoContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile]);

  // Handle video load events
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = (error: any) => {
    setIsVideoLoaded(false);
  };

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true);
      const imagePromises = products.map((product) => {
        return new Promise<string>((resolve, reject) => {
          const img = new window.Image();
          img.src = product.imageUrl;
          img.onload = () => {
            setLoadedImages((prev) => [...prev, product.imageUrl]);
            resolve(product.imageUrl);
          };
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (products.length > 0) {
      preloadImages();
    }
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

  const isImageLoaded = (imageUrl: string) => loadedImages.includes(imageUrl);

  return (
    <section className="w-full h-auto md:h-[600px] flex flex-col md:flex-row border-y-[1px] border-main-maroon">
      {/* Left Side - Video (hidden on mobile) */}
      {!isMobile && (
        <div ref={videoContainerRef} className="hidden md:block md:w-1/2 relative overflow-hidden bg-main-maroon aspect-video md:aspect-auto md:h-full">
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
              <Image
                src={products[0]?.imageUrl || "/placeholder.jpg"}
                alt="Matcha Video Fallback"
                fill
                className="object-cover"
                priority={false}
              />
            </video>
          )}
          {(!isVideoVisible || !isVideoLoaded) && (
            <Image
              src={products[0]?.imageUrl || "/placeholder.jpg"}
              alt="Matcha Preview"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      )}

      {/* Product Slider (full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2 bg-main-maroon p-5 md:p-6 flex flex-col">
        <div className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center text-secondary-peach">EXCLUSIVE MATCHA</div>
        <div className="text-xs md:text-sm mb-2 md:mb-4 text-center text-secondary-peach">
          {currentSlide + 1} OF {products.length}
        </div>
        
        <div className="py-4 md:py-6">
          <div className="w-full flex items-center justify-between gap-3">
            {/* Left Navigation Button */}
            <button 
              onClick={prevSlide}
              className="bg-secondary-peach text-secondary-peach p-2.5 md:p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 text-main-maroon" />
            </button>

            {/* Product Display */}
            <div className="flex-1 max-w-[260px] md:max-w-[280px] mx-auto">
              <Link href={`/product/${products[currentSlide].handle}`}>
                <div className="bg-white p-3 rounded-lg relative aspect-[3/4] overflow-hidden group cursor-pointer">
                  {/* Hidden preload container */}
                  <div className="hidden">
                    {products.map((product) => (
                      <Image
                        key={product.id}
                        src={product.imageUrl}
                        alt="preload"
                        width={1}
                        height={1}
                        priority
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
                          className="absolute inset-0"
                        >
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 80vw, 40vw"
                            priority
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
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="w-8 h-8 border-4 border-main-maroon border-t-transparent rounded-full animate-spin"></div>
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
                    <h2 className="text-base md:text-lg font-semibold text-secondary-peach">
                      {products[currentSlide].name}
                    </h2>
                    <p className={`text-sm md:text-base mt-1 text-secondary-peach ${!products[currentSlide].availableForSale ? "line-through opacity-70" : ""}`}>
                      {convertPrice(products[currentSlide].price)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Link>
            </div>

            {/* Right Navigation Button */}
            <button 
              onClick={nextSlide}
              className="bg-secondary-peach text-main-maroon p-2.5 md:p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
              disabled={isLoading}
            >
              <ChevronRight className="w-4 h-4 text-[#800020]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
