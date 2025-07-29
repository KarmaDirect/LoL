'use client';

import { motion } from 'framer-motion';
import { Crown, Target, TrendingUp, Clock, Trash2 } from 'lucide-react';
import { PlayerRank, PlayerStats } from '@/types/league';
import { generateGameDescription, getRankIcon, getRankColor } from '@/services/descriptionService';

interface PlayerCardProps {
  summonerName: string;
  rank: PlayerRank;
  stats: PlayerStats[];
  photoUrl?: string;
  onRemove?: () => void;
}

export default function PlayerCard({ summonerName, rank, stats, photoUrl, onRemove }: PlayerCardProps) {
  const averageImpactScore = stats.length > 0 
    ? Math.round(stats.reduce((sum, stat) => sum + stat.impactScore, 0) / stats.length)
    : 0;

  const getImpactColor = (score: number) => {
    if (score >= 80) return 'bg-lol-green';
    if (score >= 60) return 'bg-lol-gold';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-lol-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card-hover p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img 
            src={photoUrl || `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${rank.profileIconId || 1}.png`}
            alt={summonerName}
            className="w-16 h-16 rounded-full border-2 border-lol-purple/50"
          />
          <div className="absolute -bottom-1 -right-1 bg-lol-dark rounded-full p-1">
            <span className="text-lg">{getRankIcon(rank.tier)}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{summonerName}</h3>
          <div className="flex items-center gap-3">
            <span className={`font-semibold ${getRankColor(rank.tier)}`}>
              {rank.tier} {rank.rank}
            </span>
            <span className="text-white">{rank.leaguePoints} LP</span>
            <span className="text-gray-400">•</span>
            <span className="text-white">{rank.winrate}% WR</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-lol-gold">{averageImpactScore}</div>
          <div className="text-sm text-gray-400">Impact Score</div>
        </div>

        {onRemove && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="text-lol-red hover:text-lol-red/80 transition-colors p-2"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Impact Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Score d'impact moyen</span>
          <span className="text-sm font-bold text-white">{averageImpactScore}/100</span>
        </div>
        <div className="impact-score">
          <div 
            className={`impact-fill ${getImpactColor(averageImpactScore)}`}
            style={{ width: `${averageImpactScore}%` }}
          />
        </div>
      </div>

      {/* Recent Games */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-lol-purple" />
          3 dernières parties
        </h4>
        {stats.slice(0, 3).map((game, index) => (
          <motion.div
            key={game.matchId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              game.win ? 'border-lol-green/30 bg-lol-green/5' : 'border-lol-red/30 bg-lol-red/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">{game.role === 'MIDDLE' ? '⚔️' : '🎮'}</span>
                <span className="font-semibold text-white">{game.championName}</span>
              </div>
              <div className={`rank-badge ${
                game.win ? 'bg-lol-green/20 text-lol-green' : 'bg-lol-red/20 text-lol-red'
              }`}>
                {game.win ? 'VICTOIRE' : 'DÉFAITE'}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-white">{game.kills}/{game.deaths}/{game.assists}</div>
                <div className="text-gray-400">K/D/A</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{game.csPerMinute}</div>
                <div className="text-gray-400">CS/min</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{Math.round(game.damageDealt / 1000)}k</div>
                <div className="text-gray-400">Damage</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{game.impactScore}</div>
                <div className="text-gray-400">Impact</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-300 italic leading-relaxed">
              {generateGameDescription(game)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 