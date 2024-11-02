'use client'

import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const HeroSlider = () => {
  const [isClient, setIsClient] = useState(false);
  const controlsRight = useAnimationControls();

  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      controlsRight.start("animate");
    }
  }, [isClient, controlsRight]);

  const texts = [
    "Free Shipping on Orders Over $100",
    "Afterpay Available",
    "One Stop Shop",
    "Free Shipping on Orders Over $100",
    "Afterpay Available",
    "One Stop Shop",
  ];

  const duration = 100;

  const sliderVariantsRight = {
    initial: { x: 0, opacity: 0 },
    animate: {
      x: [-20, -3000], // Using a fixed large number that covers the content width
      opacity: [0, 1, 1, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        },
        opacity: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          times: [0, 0.01, 0.99, 1],
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="w-screen overflow-hidden py-5 border-y-2 border-main-maroon">
      <motion.div
        className="flex items-center"
        variants={sliderVariantsRight}
        initial="initial"
        animate={controlsRight}
      >
        {isClient && [...texts, ...texts, ...texts].map((text, index) => (
          <div 
            key={index} 
            className="flex items-center"
          >
            <span className="text-xl text-main-maroon uppercase whitespace-nowrap px-10">
              {text}
            </span>
            <div className="h-[1px] w-20 bg-main-maroon" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroSlider;