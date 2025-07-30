'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, RefreshCw, Info, Gamepad2, BarChart3, Crown, Target, Zap, Eye, Clock, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getStoredSummoners } from '@/services/storageService';
import AddSummonerForm from '@/components/AddSummonerForm';

import PlayerCard from '@/components/PlayerCard';
import DailyQuizPreview from '@/components/DailyQuizPreview';
import Link from 'next/link';

export default function HomePage() {
  const {
    storedSummoners,
    playerRanks,
    playerStats,
    isLoading,
    error,
    loadPlayerData,
    refreshData,
    lastUpdate,
    setStoredSummoners
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSummoner = async (summonerName: string) => {
    try {
      const newSummoner = { name: summonerName };
      const currentSummoners = getStoredSummoners();
      const updatedSummoners = [...currentSummoners, newSummoner];
      
      localStorage.setItem('storedSummoners', JSON.stringify(updatedSummoners));
      setStoredSummoners(updatedSummoners);
      
      await loadPlayerData(summonerName);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du summoner:', error);
    }
  };

  const handleRemoveSummoner = (summonerName: string) => {
    const updatedSummoners = storedSummoners.filter(s => s.name !== summonerName);
    localStorage.setItem('storedSummoners', JSON.stringify(updatedSummoners));
    setStoredSummoners(updatedSummoners);
  };

  const totalPlayers = storedSummoners.length;
  const playersWithData = Object.keys(playerRanks).length;
  const averageWinrate = playersWithData > 0 
    ? Math.round(Object.values(playerRanks).reduce((sum, rank) => sum + rank.winrate, 0) / playersWithData)
    : 0;
  const totalGames = Object.values(playerRanks).reduce((sum, rank) => sum + rank.totalGames, 0);

  return (
    <div className="min-h-screen bg-lol-dark">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">
            La Team
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Suivez les performances de votre équipe LoL avec des analyses détaillées et des descriptions dynamiques
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-lol-red/20 border border-lol-red/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-lol-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-lol-red font-medium">{error}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-card-hover p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-lol-blue" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalPlayers}</div>
            <div className="text-gray-400 text-sm">Joueurs ajoutés</div>
          </div>
          
          <div className="glass-card-hover p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-lol-green" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{playersWithData}</div>
            <div className="text-gray-400 text-sm">Données chargées</div>
          </div>
          
          <div className="glass-card-hover p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-8 h-8 text-lol-gold" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{averageWinrate}%</div>
            <div className="text-gray-400 text-sm">Winrate moyen</div>
          </div>
          
          <div className="glass-card-hover p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Gamepad2 className="w-8 h-8 text-lol-purple" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalGames}</div>
            <div className="text-gray-400 text-sm">Games totales</div>
          </div>
        </motion.div>

        {/* Add Player Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Ajouter un joueur</h2>
              <div className="flex items-center gap-3">
                {lastUpdate && (
                  <div className="text-sm text-gray-400">
                    MAJ: {lastUpdate}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshData}
                  disabled={isLoading}
                  className="lol-button-secondary disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Actualiser</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="lol-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showAddForm ? 'Annuler' : 'Ajouter'}
                  </span>
                </motion.button>
              </div>
            </div>
            
            {showAddForm && (
              <AddSummonerForm onAddSummoner={handleAddSummoner} />
            )}
          </div>
        </motion.div>

        {/* Players Grid */}
        {totalPlayers > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {storedSummoners.map((summoner, index) => {
              const rank = playerRanks[summoner.name];
              const stats = playerStats[summoner.name] || [];
              
              return (
                <motion.div
                  key={summoner.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <PlayerCard
                    summonerName={summoner.name}
                    rank={rank || { summonerName: summoner.name, tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0, winrate: 0, totalGames: 0 }}
                    stats={stats}
                    onRemove={() => handleRemoveSummoner(summoner.name)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="glass-card p-12 max-w-md mx-auto">
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-4">Aucun joueur ajouté</h3>
              <p className="text-gray-400 mb-6">
                Commencez par ajouter des joueurs de votre équipe pour suivre leurs performances et voir le classement.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="lol-button mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Ajouter votre premier joueur</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Daily Quiz Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <DailyQuizPreview />
        </motion.div>

        {/* Quick Actions */}
        {totalPlayers > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/leaderboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="lol-button-secondary"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Voir le classement</span>
                  </motion.button>
                </Link>
                <Link href="/daily-quiz">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="lol-button-secondary"
                  >
                    <Target className="w-4 h-4" />
                    <span>Quiz Quotidien</span>
                  </motion.button>
                </Link>
                <Link href="/tierlist">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="lol-button-secondary"
                  >
                    <Users className="w-4 h-4" />
                    <span>Tier List</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
