'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  handle: string;
  price: number;
  imageUrl: string;
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

  // Video intersection observer
  useEffect(() => {
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
              console.error('Error playing video:', error);
            });
          }
        }
      });
    }, options);

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  // Handle video load events
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = (error: any) => {
    console.error('Error loading video:', error);
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
        console.error('Error preloading images:', error);
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
    <section className="w-full h-[600px] flex flex-col md:flex-row border-y-[1px] border-main-maroon">
      {/* Left Side - Video */}
      <div ref={videoContainerRef} className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden bg-main-maroon">
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
        {/* Show poster image while video is not visible or loaded */}
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

      {/* Right Side - Product Slider */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full bg-main-maroon p-3 md:p-6 flex flex-col">
        <div className="text-xl font-bold mb-1 md:mb-2 text-center text-secondary-peach">EXCLUSIVE MATCHA</div>
        <div className="text-sm mb-2 md:mb-4 text-center text-secondary-peach">
          {currentSlide + 1} OF {products.length}
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="w-full flex items-center justify-between gap-3">
            {/* Left Navigation Button */}
            <button 
              onClick={prevSlide}
              className="bg-secondary-peach text-secondary-peach p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 text-main-maroon" />
            </button>

            {/* Product Display */}
            <div className="flex-1 max-w-[280px] mx-auto">
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
                    className="mt-3 text-center group-hover:opacity-80 transition-opacity"
                  >
                    <h2 className="text-base md:text-lg font-semibold text-secondary-peach">
                      {products[currentSlide].name}
                    </h2>
                    <p className="text-sm md:text-base mt-1 text-secondary-peach">
                      ${products[currentSlide].price}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Link>
            </div>

            {/* Right Navigation Button */}
            <button 
              onClick={nextSlide}
              className="bg-secondary-peach text-main-maroon p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
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
