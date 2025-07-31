'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { useLiveGames } from '@/hooks/useLiveGames';
import { useApp } from '@/contexts/AppContext';
import LiveIndicator from '@/components/LiveIndicator';
import LiveGameModal from '@/components/LiveGameModal';
import { LiveGameInfo } from '@/types/liveGame';

export default function LivePage() {
  const { storedSummoners } = useApp();
  const {
    liveGames,
    isLoading,
    error,
    lastUpdate,
    checkLiveStatus,
    isPlayerLive,
    getPlayerLiveGame,
  } = useLiveGames();

  const [selectedGame, setSelectedGame] = useState<LiveGameInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLiveClick = (summonerName: string) => {
    const game = getPlayerLiveGame(summonerName);
    if (game) {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

  const handleRefresh = async () => {
    await checkLiveStatus();
  };

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Jamais';
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lol-dark via-lol-darker to-lol-darkest">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Radio className="w-12 h-12 text-lol-purple" />
              <h1 className="text-3xl font-bold text-gradient">Suivi en Direct</h1>
            </div>
            <p className="text-gray-400">Surveillez les parties de vos amis en temps réel</p>
          </div>

          {/* Stats et contrôles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{liveGames.length}</div>
              <div className="text-sm text-gray-400">Parties en cours</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {isLoading ? '...' : liveGames.length}
              </div>
              <div className="text-sm text-gray-400">Joueurs en ligne</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                {formatLastUpdate(lastUpdate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Dernière mise à jour</div>
            </div>
          </div>

          {/* Bouton de rafraîchissement */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isLoading}
              className="lol-button-primary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Vérification...' : 'Actualiser'}</span>
            </motion.button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </motion.div>
          )}

          {/* Liste des amis */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mes Amis
            </h2>

            {/* Amis en ligne */}
            {liveGames.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-400">🟢 En partie</h3>
                {liveGames.map((game) => (
                  <motion.div
                    key={game.player.summonerName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LiveIndicator
                          isLive={true}
                          onClick={() => handleLiveClick(game.player.summonerName)}
                          size="lg"
                        />
                        <div>
                          <div className="text-white font-medium text-lg">
                            {game.player.summonerName}
                          </div>
                          <div className="text-green-400 text-sm">
                            En partie • {game.game.gameMode}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLiveClick(game.player.summonerName)}
                        className="lol-button-secondary text-sm"
                      >
                        Voir la partie
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

                         {/* Amis hors ligne */}
             <div className="space-y-3">
               <h3 className="text-lg font-semibold text-gray-400">🔴 Hors ligne</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                 {storedSummoners.map((summoner) => {
                   const isLive = isPlayerLive(summoner.name);
                   if (isLive) return null; // Déjà affiché dans la section "En partie"

                   return (
                     <motion.div
                       key={summoner.name}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                     >
                       <div className="flex items-center justify-center gap-2 mb-2">
                         <div className="w-3 h-3 bg-gray-500 rounded-full" />
                         <span className="text-white font-medium">{summoner.name}</span>
                       </div>
                       <div className="text-gray-400 text-sm">Hors ligne</div>
                     </motion.div>
                   );
                 })}
               </div>
             </div>

            {/* Message si aucun ami en ligne */}
            {liveGames.length === 0 && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Radio className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">Aucun ami en partie</h3>
                <p className="text-gray-400">
                  Aucun de vos amis n'est actuellement en partie. Les statuts se mettent à jour automatiquement.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Modal pour afficher les détails de la partie */}
        <LiveGameModal
          liveGame={selectedGame}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGame(null);
          }}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
} 