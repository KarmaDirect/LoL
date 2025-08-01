'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Target } from 'lucide-react';
import { LiveGameInfo } from '@/types/liveGame';

interface LiveGameModalProps {
  liveGame: LiveGameInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveGameModal({ liveGame, isOpen, onClose }: LiveGameModalProps) {
  if (!liveGame) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Partie en Direct</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Game Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Clock className="w-8 h-8 text-lol-blue mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">--</div>
                    <div className="text-sm text-gray-400">Temps de jeu</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Users className="w-8 h-8 text-lol-purple mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">10</div>
                    <div className="text-sm text-gray-400">Joueurs</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Target className="w-8 h-8 text-lol-green mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">Ranked Solo/Duo</div>
                    <div className="text-sm text-gray-400">Mode de jeu</div>
                  </div>
                </div>

                {/* Player Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Informations du joueur</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Nom:</span>
                      <div className="text-white font-medium">{liveGame.player.summonerName}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Champion:</span>
                      <div className="text-white font-medium">--</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Rôle:</span>
                      <div className="text-white font-medium">--</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">KDA:</span>
                      <div className="text-white font-medium">--</div>
                    </div>
                  </div>
                </div>

                {/* Team Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Équipe</h3>
                  <div className="text-gray-400 text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Informations d'équipe non disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 