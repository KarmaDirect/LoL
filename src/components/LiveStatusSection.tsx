'use client';

import { motion } from 'framer-motion';
import { Radio, Users, ArrowRight } from 'lucide-react';
import { useLiveGames } from '@/hooks/useLiveGames';
import { useApp } from '@/contexts/AppContext';
import LiveStatusBadge from './LiveStatusBadge';
import Link from 'next/link';

export default function LiveStatusSection() {
  const { storedSummoners } = useApp();
  const { liveGames, isLoading } = useLiveGames();

  // Ne pas afficher si aucun joueur dans le leaderboard ou si aucun en ligne
  if (storedSummoners.length === 0 || (liveGames.length === 0 && !isLoading)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Radio className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Amis en Direct</h2>
          <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
            {liveGames.length} en ligne
          </div>
        </div>
        <Link href="/live">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-lol-purple hover:text-lol-blue transition-colors"
          >
            <span className="text-sm">Voir tout</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lol-purple"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {liveGames.slice(0, 6).map((game) => (
            <motion.div
              key={game.player.summonerName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LiveStatusBadge
                    summonerName={game.player.summonerName}
                    isLive={true}
                    size="sm"
                  />
                  <span className="text-white font-medium text-sm">
                    {game.player.summonerName}
                  </span>
                </div>
                <div className="text-xs text-green-400">
                  {game.game.gameMode}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {liveGames.length > 6 && (
        <div className="mt-4 text-center">
          <Link href="/live">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-lol-purple hover:text-lol-blue text-sm"
            >
              Voir {liveGames.length - 6} autres amis en ligne
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  );
} 