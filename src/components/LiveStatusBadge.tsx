'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import LiveIndicator from './LiveIndicator';

interface LiveStatusBadgeProps {
  summonerName: string;
  isLive: boolean;
  onLiveClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function LiveStatusBadge({ 
  summonerName, 
  isLive, 
  onLiveClick, 
  size = 'sm',
  showText = false 
}: LiveStatusBadgeProps) {
  if (!isLive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1"
    >
      <LiveIndicator
        isLive={isLive}
        onClick={onLiveClick}
        size={size}
      />
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-green-400 font-medium"
        >
          LIVE
        </motion.span>
      )}
    </motion.div>
  );
} 