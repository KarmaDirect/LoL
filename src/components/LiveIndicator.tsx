'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

interface LiveIndicatorProps {
  isLive: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function LiveIndicator({ isLive, onClick, size = 'md' }: LiveIndicatorProps) {
  if (!isLive) return null;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const pulseClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.9 } : {}}
    >
      {/* Icône principale */}
      <motion.div
        className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Radio className={`${sizeClasses[size]} text-white`} />
      </motion.div>

      {/* Effet de pulsation */}
      <motion.div
        className={`${pulseClasses[size]} bg-green-500 rounded-full absolute top-0 left-0 opacity-30`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Texte "LIVE" */}
      <motion.span
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        LIVE
      </motion.span>
    </motion.div>
  );
} 