'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Trash2, Radio, Clock, Target, Zap, Eye } from 'lucide-react';
import { PlayerRank, PlayerStats } from '@/types/league';

interface PlayerCardProps {
  summonerName: string;
  rank: PlayerRank;
  stats: PlayerStats[];
  onRemove: () => void;
  onLiveClick: () => void;
}

export default function PlayerCard({ summonerName, rank, stats, onRemove, onLiveClick }: PlayerCardProps) {
  const getRankColor = (tier: string) => {
    switch (tier) {
      case 'DIAMOND': return 'text-purple-400';
      case 'PLATINUM': return 'text-blue-400';
      case 'GOLD': return 'text-yellow-400';
      case 'SILVER': return 'text-gray-400';
      case 'BRONZE': return 'text-orange-600';
      case 'IRON': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'TOP': return '🏔️';
      case 'JUNGLE': return '🌲';
      case 'MIDDLE': return '⚔️';
      case 'BOTTOM': return '🏹';
      case 'UTILITY': return '🛡️';
      default: return '🎮';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card overflow-hidden"
    >
      {/* Player Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-lol-blue/20 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-lol-blue" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{summonerName}</h3>
              {rank.tier !== 'UNRANKED' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-semibold ${getRankColor(rank.tier)}`}>
                    {rank.tier} {rank.rank}
                  </span>
                  <span className="text-white">{rank.leaguePoints} LP</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-white">{rank.winrate}% WR</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-white">{rank.totalGames} games</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLiveClick}
              className="p-2 bg-lol-green/20 hover:bg-lol-green/30 text-lol-green rounded-lg transition-colors"
              title="Voir la partie en cours"
            >
              <Radio className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="p-2 bg-lol-red/20 hover:bg-lol-red/30 text-lol-red rounded-lg transition-colors"
              title="Supprimer le joueur"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      {stats.length > 0 ? (
        <div className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">3 dernières games (Solo/Duo)</h4>
          <div className="space-y-3">
            {stats.slice(0, 3).map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 rounded-lg p-4 border ${
                  game.win ? 'border-lol-green/30' : 'border-lol-red/30'
                } hover:bg-white/10 transition-colors`}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRoleIcon(game.role)}</span>
                    <span className="font-semibold text-white">{game.championName}</span>
                  </div>
                  <div className={`rank-badge ${
                    game.win 
                      ? 'bg-lol-green/20 text-lol-green' 
                      : 'bg-lol-red/20 text-lol-red'
                  }`}>
                    {game.win ? 'VICTOIRE' : 'DÉFAITE'}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{game.kills}/{game.deaths}/{game.assists}</div>
                    <div className="text-xs text-gray-400">K/D/A</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{game.csPerMinute}</div>
                    <div className="text-xs text-gray-400">CS/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{Math.round(game.damageDealt / 1000)}k</div>
                    <div className="text-xs text-gray-400">Damage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{game.visionScore}</div>
                    <div className="text-xs text-gray-400">Vision</div>
                  </div>
                </div>

                {/* Impact Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Impact Score</span>
                    <span className="text-sm font-bold text-white">{game.impactScore}/100</span>
                  </div>
                  <div className="impact-score">
                    <div 
                      className={`impact-fill ${
                        game.impactScore >= 70 ? 'bg-lol-green' :
                        game.impactScore >= 50 ? 'bg-lol-gold' :
                        game.impactScore >= 30 ? 'bg-orange-500' : 'bg-lol-red'
                      }`}
                      style={{ width: `${game.impactScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Game Duration */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(game.gameDuration / 60)}min</span>
                </div>

                {/* Dynamic Description */}
                <div className="text-sm text-gray-300 italic leading-relaxed">
                  {game.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-400">
          <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chargement des données...</p>
        </div>
      )}
    </motion.div>
  );
} 