'use client';

import { motion } from 'framer-motion';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
