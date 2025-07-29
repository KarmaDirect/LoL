'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, BarChart3, Trophy, Clock, Target, Trash2, Download, Upload, Users, Gamepad2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function ProfilePage() {
  const { storedSummoners, playerRanks, playerStats } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings'>('overview');

  const totalPlayers = storedSummoners.length;
  const totalGames = Object.values(playerRanks).reduce((sum, rank) => sum + rank.totalGames, 0);
  const averageWinrate = Object.values(playerRanks).length > 0 
    ? Math.round(Object.values(playerRanks).reduce((sum, rank) => sum + rank.winrate, 0) / Object.values(playerRanks).length)
    : 0;

  const exportData = () => {
    const data = {
      summoners: storedSummoners,
      ranks: playerRanks,
      stats: playerStats,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `league_squad_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-lol-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto mb-4 text-lol-purple" />
            <h1 className="text-3xl font-bold text-gradient mb-2">Profil</h1>
            <p className="text-gray-400">Gérez vos données et paramètres</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-lg p-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-lol-blue to-lol-purple text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-hover p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-lol-blue" />
                  <div className="text-3xl font-bold text-white mb-2">{totalPlayers}</div>
                  <div className="text-gray-400">Joueurs suivis</div>
                </div>
                
                <div className="glass-card-hover p-6 text-center">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-lol-purple" />
                  <div className="text-3xl font-bold text-white mb-2">{totalGames}</div>
                  <div className="text-gray-400">Games totales</div>
                </div>
                
                <div className="glass-card-hover p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-lol-gold" />
                  <div className="text-3xl font-bold text-white mb-2">{averageWinrate}%</div>
                  <div className="text-gray-400">Winrate moyen</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Activité récente</h3>
                <div className="space-y-4">
                  {storedSummoners.slice(0, 5).map((summoner, index) => (
                    <div key={summoner.name} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-lol-blue to-lol-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{summoner.name}</div>
                        <div className="text-sm text-gray-400">
                          {playerRanks[summoner.name] 
                            ? `${playerRanks[summoner.name].tier} ${playerRanks[summoner.name].rank}`
                            : 'Données non chargées'
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {playerStats[summoner.name]?.length || 0} games
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Répartition des rangs</h3>
                  <div className="space-y-3">
                    {Object.entries(playerRanks).map(([name, rank]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-white">{name}</span>
                        <span className="text-lol-gold font-semibold">
                          {rank.tier} {rank.rank}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Performances moyennes</h3>
                  <div className="space-y-4">
                    {Object.entries(playerStats).map(([name, stats]) => {
                      const avgImpact = stats.length > 0 
                        ? Math.round(stats.reduce((sum, stat) => sum + stat.impactScore, 0) / stats.length)
                        : 0;
                      
                      return (
                        <div key={name} className="flex items-center justify-between">
                          <span className="text-white">{name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lol-gold font-semibold">{avgImpact}</span>
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                           <div 
                               className={`h-full ${
                                 avgImpact >= 80 ? 'bg-lol-green' :
                                 avgImpact >= 60 ? 'bg-lol-gold' :
                                 avgImpact >= 40 ? 'bg-yellow-500' : 'bg-lol-red'
                               }`}
                               style={{ width: `${avgImpact}%` }}
                             />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Data Management */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Gestion des données</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">Exporter les données</div>
                      <div className="text-sm text-gray-400">Téléchargez toutes vos données en JSON</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportData}
                      className="lol-button-secondary"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exporter</span>
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">Supprimer toutes les données</div>
                      <div className="text-sm text-gray-400">Attention : cette action est irréversible</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllData}
                      className="bg-lol-red hover:bg-lol-red/80 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* App Info */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Informations</h3>
                <div className="space-y-2 text-gray-400">
                  <div>Version : 2.0.0</div>
                  <div>Développé avec Next.js et TypeScript</div>
                  <div>Design inspiré de l'univers League of Legends</div>
                  <div>Données fournies par l'API Riot Games</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 