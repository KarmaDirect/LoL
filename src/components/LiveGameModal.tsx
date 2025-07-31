'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, MapPin, RefreshCw } from 'lucide-react';
import { LiveGameInfo, LiveGamePlayer } from '@/types/liveGame';
import { getSummonerSpellName, getTeamName, getRoleFromLane } from '@/services/liveGameService';

interface LiveGameModalProps {
  liveGame: LiveGameInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function LiveGameModal({ liveGame, isOpen, onClose, onRefresh }: LiveGameModalProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isOpen || !liveGame) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - liveGame.game.gameStartTime) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, liveGame]);

  useEffect(() => {
    if (isOpen && onRefresh) {
      const interval = setInterval(onRefresh, 30000); // Rafraîchir toutes les 30 secondes
      return () => clearInterval(interval);
    }
  }, [isOpen, onRefresh]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTeamPlayers = (teamId: number): LiveGamePlayer[] => {
    return liveGame?.game.participants.filter(p => p.teamId === teamId) || [];
  };

  const getChampionImageUrl = (championId: number) => {
    return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${liveGame?.game.participants.find(p => p.championId === championId)?.championName || 'Unknown'}.png`;
  };

  const getSpellImageUrl = (spellId: number) => {
    const spellName = getSummonerSpellName(spellId);
    return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/spell/${spellName}.png`;
  };

  if (!liveGame) return null;

  const blueTeam = getTeamPlayers(100);
  const redTeam = getTeamPlayers(200);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-lol-dark border border-lol-purple/30 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-lol-purple/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold">PARTIE EN DIRECT</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{liveGame.game.gameMode}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-lol-purple/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Équipe Bleue */}
                <div className="space-y-4">
                  <h3 className="text-blue-400 font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {getTeamName(100)} ({blueTeam.length} joueurs)
                  </h3>
                  <div className="space-y-2">
                    {blueTeam.map((player) => (
                      <div
                        key={player.summonerId}
                        className={`p-3 rounded-lg border ${
                          player.isTrackedPlayer
                            ? 'bg-lol-purple/20 border-lol-purple'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={getChampionImageUrl(player.championId)}
                              alt={player.championName}
                              className="w-12 h-12 rounded-lg"
                            />
                            {player.isTrackedPlayer && (
                              <div className="absolute -top-1 -right-1 bg-lol-gold text-lol-dark text-xs px-1 rounded">
                                VOUS
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{player.summonerName}</span>
                              {player.isTrackedPlayer && (
                                <span className="text-lol-gold text-xs">⭐</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-300">
                              {player.championName} • {getRoleFromLane(player.lane || '', player.role || '')}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <img
                              src={getSpellImageUrl(player.spell1Id)}
                              alt="Spell 1"
                              className="w-6 h-6 rounded"
                            />
                            <img
                              src={getSpellImageUrl(player.spell2Id)}
                              alt="Spell 2"
                              className="w-6 h-6 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Équipe Rouge */}
                <div className="space-y-4">
                  <h3 className="text-red-400 font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {getTeamName(200)} ({redTeam.length} joueurs)
                  </h3>
                  <div className="space-y-2">
                    {redTeam.map((player) => (
                      <div
                        key={player.summonerId}
                        className={`p-3 rounded-lg border ${
                          player.isTrackedPlayer
                            ? 'bg-lol-purple/20 border-lol-purple'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={getChampionImageUrl(player.championId)}
                              alt={player.championName}
                              className="w-12 h-12 rounded-lg"
                            />
                            {player.isTrackedPlayer && (
                              <div className="absolute -top-1 -right-1 bg-lol-gold text-lol-dark text-xs px-1 rounded">
                                VOUS
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{player.summonerName}</span>
                              {player.isTrackedPlayer && (
                                <span className="text-lol-gold text-xs">⭐</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-300">
                              {player.championName} • {getRoleFromLane(player.lane || '', player.role || '')}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <img
                              src={getSpellImageUrl(player.spell1Id)}
                              alt="Spell 1"
                              className="w-6 h-6 rounded"
                            />
                            <img
                              src={getSpellImageUrl(player.spell2Id)}
                              alt="Spell 2"
                              className="w-6 h-6 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-lol-purple/30 text-center text-gray-400 text-sm">
                <p>Dernière mise à jour : {new Date(liveGame.lastUpdated).toLocaleTimeString()}</p>
                <p className="text-xs mt-1">Mise à jour automatique toutes les 30 secondes</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 