'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const products = [
    {
      name: "MATCHA 1",
      price: 199,
      imageUrl: "/placeholder.jpg"
    },
    {
      name: "MATCHA 2",
      price: 199,
      imageUrl: "/placeholder2.jpg"
    },
    {
      name: "MATCHA 3",
      price: 199,
      imageUrl: "/placeholder.jpg"
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="w-full h-[600px] flex flex-col md:flex-row border-y-[1px] border-main-maroon">
      {/* Left Side - Full Image */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full relative">
        <Image
          src="/placeholder.jpg"
          alt="Ada Studio Matcha"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Right Side - Product Slider */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full bg-main-maroon p-3 md:p-6 flex flex-col">
        <div className="text-xl font-bold mb-1 md:mb-2 text-center text-secondary-peach">EXCLUSIVE MATCHA</div>
        <div className="text-sm mb-2 md:mb-4 text-center text-secondary-peach">4 OF 11</div>
        
        <div className="flex-1 flex items-center">
          <div className="w-full flex items-center justify-between gap-3">
            {/* Left Navigation Button */}
            <button 
              onClick={prevSlide}
              className="bg-secondary-peach text-secondary-peach p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-main-maroon" />
            </button>

            {/* Product Display */}
            <div className="flex-1 max-w-[280px] mx-auto">
              <div className="bg-white p-3 rounded-lg relative aspect-[3/4] overflow-hidden">
                <AnimatePresence initial={false}>
                  {products.map((product, index) => (
                    index === currentSlide && (
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
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 80vw, 40vw"
                        />
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`text-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-center"
                >
                  <h2 className="text-base md:text-lg font-semibold text-secondary-peach">
                    {products[currentSlide].name}
                  </h2>
                  <p className="text-sm md:text-base mt-1 text-secondary-peach">
                    ${products[currentSlide].price}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Navigation Button */}
            <button 
              onClick={nextSlide}
              className="bg-secondary-peach text-main-maroon p-2 rounded-full hover:bg-[#FFB6A3] transition-colors z-10"
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