'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const firstChild = containerRef.current.children[0] as HTMLElement;
        if (firstChild) {
          setContentWidth(firstChild.offsetWidth);
        }
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Only show on homepage
  if (pathname !== '/') return null;

  return (
    <div
      data-announcement-bar
      data-scrolled="false"
      className={`
        fixed top-0 w-full z-[51] bg-main-maroon text-secondary-peach h-8 overflow-hidden
        transition-all duration-300 ease-in-out
        data-[scrolled=true]:-translate-y-full 
        data-[scrolled=false]:translate-y-0
        data-[menu-open=true]:-translate-y-full
      `}
    >
      <div className="relative flex items-center h-full overflow-hidden">
        <motion.div
          ref={containerRef}
          className="flex absolute whitespace-nowrap items-center h-full"
          animate={{
            x: contentWidth > 0 ? [-contentWidth, 0] : 0,
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          <div className="flex items-center text-xs tracking-wide">
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping to Australia on orders over $150</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping for New Zealand on orders over $100</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping to Australia on orders over $150</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping for New Zealand on orders over $100</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center text-xs tracking-wide">
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping to Australia on orders over $150</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping for New Zealand on orders over $100</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping to Australia on orders over $150</span>
            <span className="text-secondary-peach/70">-</span>
            <span className="px-8 font-light">Free shipping for New Zealand on orders over $100</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
