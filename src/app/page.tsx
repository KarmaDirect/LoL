'use client';

import { useState } from 'react';
import { Users, Plus, RefreshCw, Info, Gamepad2, BarChart3, Crown, Target, Zap, Eye, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getStoredSummoners } from '@/services/storageService';
import AddSummonerForm from '@/components/AddSummonerForm';
import Header from '@/components/Header';
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
      // Ajouter le summoner au localStorage
      const newSummoner = { name: summonerName };
      const currentSummoners = getStoredSummoners();
      const updatedSummoners = [...currentSummoners, newSummoner];
      
      localStorage.setItem('storedSummoners', JSON.stringify(updatedSummoners));
      setStoredSummoners(updatedSummoners);
      
      // Charger les données du nouveau joueur
      await loadPlayerData(summonerName);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du summoner:', error);
    }
  };

  const totalPlayers = storedSummoners.length;
  const playersWithData = Object.keys(playerRanks).length;
  const averageWinrate = playersWithData > 0 
    ? Math.round(Object.values(playerRanks).reduce((sum, rank) => sum + rank.winrate, 0) / playersWithData)
    : 0;
  const totalGames = Object.values(playerRanks).reduce((sum, rank) => sum + rank.totalGames, 0);

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
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="w-full px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-red-400 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalPlayers}</div>
            <div className="text-gray-400 text-sm">Joueurs ajoutés</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{playersWithData}</div>
            <div className="text-gray-400 text-sm">Données chargées</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{averageWinrate}%</div>
            <div className="text-gray-400 text-sm">Winrate moyen</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalGames}</div>
            <div className="text-gray-400 text-sm">Games totales</div>
          </div>
        </div>

        {/* Add Player Section */}
        <div className="mb-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Ajouter un joueur</h2>
              <div className="flex items-center gap-3">
                {lastUpdate && (
                  <div className="text-sm text-gray-400">
                    MAJ: {lastUpdate}
                  </div>
                )}
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Actualiser</span>
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showAddForm ? 'Annuler' : 'Ajouter'}
                  </span>
                </button>
              </div>
            </div>
            
            {showAddForm && (
              <AddSummonerForm onAddSummoner={handleAddSummoner} />
            )}
          </div>
        </div>

        {/* Players Section */}
        {totalPlayers > 0 ? (
          <div className="space-y-8">
            {storedSummoners.map((summoner) => {
              const rank = playerRanks[summoner.name];
              const stats = playerStats[summoner.name] || [];
              
              return (
                <div key={summoner.name} className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
                  {/* Player Header */}
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          <Gamepad2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{summoner.name}</h3>
                          {rank && (
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
                      
                      <button
                        onClick={() => {
                          const updatedSummoners = storedSummoners.filter(s => s.name !== summoner.name);
                          localStorage.setItem('storedSummoners', JSON.stringify(updatedSummoners));
                          setStoredSummoners(updatedSummoners);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        <span className="text-sm">Supprimer</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Games */}
                  {stats.length > 0 ? (
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">3 dernières games (Solo/Duo)</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {stats.map((game, index) => (
                          <div key={index} className={`bg-gray-700/30 rounded-lg p-4 border ${
                            game.win ? 'border-green-500/30' : 'border-red-500/30'
                          } hover:bg-gray-600/30 transition-colors`}>
                            {/* Game Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getRoleIcon(game.role)}</span>
                                <span className="font-semibold text-white">{game.championName}</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                game.win 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
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
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    game.impactScore >= 70 ? 'bg-green-500' :
                                    game.impactScore >= 50 ? 'bg-yellow-500' :
                                    game.impactScore >= 30 ? 'bg-orange-500' : 'bg-red-500'
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
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Chargement des données...</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-12 max-w-md mx-auto">
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-4">Aucun joueur ajouté</h3>
              <p className="text-gray-400 mb-6">
                Commencez par ajouter des joueurs de votre équipe pour suivre leurs performances et voir le classement.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Ajouter votre premier joueur</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
