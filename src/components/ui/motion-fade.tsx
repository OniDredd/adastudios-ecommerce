'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MotionFadeProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionFade({ children, className }: MotionFadeProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.21, 0.47, 0.32, 0.98]
        }}
        className={`w-full ${className || ''}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
