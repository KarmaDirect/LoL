'use client';

import React, { useState } from 'react';
import { Users, Trophy, ChevronDown, ChevronUp, Crown, Medal, Award, Info, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { sortByRankAndDivision } from '@/services/impactScoreService';

export default function LeaderboardPage() {
  const {
    storedSummoners,
    playerRanks,
    playerStats,
    isLoading,
    error,
    refreshData,
    lastUpdate
  } = useApp();

  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  // Trier les joueurs par rang réel
  const sortedPlayers = storedSummoners
    .filter(summoner => playerRanks[summoner.name])
    .map(summoner => ({
      name: summoner.name,
      rank: playerRanks[summoner.name],
      stats: playerStats[summoner.name] || []
    }))
    .sort((a, b) => sortByRankAndDivision(a.rank, b.rank));

  const totalPlayers = sortedPlayers.length;
  const bestRank = sortedPlayers[0]?.rank.tier || 'N/A';
  const averageWinrate = totalPlayers > 0 
    ? Math.round(sortedPlayers.reduce((sum, player) => sum + player.rank.winrate, 0) / totalPlayers)
    : 0;
  const totalGames = sortedPlayers.reduce((sum, player) => sum + player.rank.totalGames, 0);

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <Trophy className="w-5 h-5 text-gray-500" />;
  };

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

        {/* Last Update Info */}
        {lastUpdate && (
          <div className="mb-8 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">
              Dernière mise à jour : {lastUpdate}
            </span>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl font-bold text-white mb-1">{totalPlayers}</div>
            <div className="text-gray-400 text-sm">Joueurs</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl font-bold text-white mb-1">{bestRank}</div>
            <div className="text-gray-400 text-sm">Meilleur rang</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl font-bold text-white mb-1">{averageWinrate}%</div>
            <div className="text-gray-400 text-sm">Winrate moyen</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl font-bold text-white mb-1">{totalGames}</div>
            <div className="text-gray-400 text-sm">Games totales</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">🏆 Classement des joueurs</h2>
            
            {totalPlayers === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">Aucun joueur ajouté</p>
                <p className="text-sm">Ajoutez des joueurs sur la page principale pour voir le classement</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left p-4 text-gray-400 font-medium">#</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Joueur</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Rang</th>
                      <th className="text-left p-4 text-gray-400 font-medium">LP</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Winrate</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Games</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => (
                      <React.Fragment key={player.name}>
                        <tr className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {getRankIcon(index + 1)}
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-semibold text-lg">{player.name}</span>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold text-lg ${getRankColor(player.rank.tier)}`}>
                              {player.rank.tier} {player.rank.rank}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium">{player.rank.leaguePoints} LP</span>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold ${player.rank.winrate >= 60 ? 'text-green-400' : player.rank.winrate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {player.rank.winrate}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-white">{player.rank.totalGames}</span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => setExpandedPlayer(expandedPlayer === player.name ? null : player.name)}
                              className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                            >
                              <TrendingUp className="w-4 h-4" />
                              {expandedPlayer === player.name ? 'Masquer' : 'Historique'}
                            </button>
                          </td>
                        </tr>
                        {expandedPlayer === player.name && player.stats.length > 0 && (
                          <tr>
                            <td colSpan={7} className="p-6 bg-gray-700/20">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-white text-lg mb-4">Dernières games (Solo/Duo)</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                  {player.stats.slice(0, 3).map((game, gameIndex) => (
                                    <div key={gameIndex} className={`bg-gray-600/30 rounded-lg p-4 border ${
                                      game.win ? 'border-green-500/30' : 'border-red-500/30'
                                    }`}>
                                      {/* Game Header */}
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{getRoleIcon(game.role)}</span>
                                          <span className="font-semibold text-white">{game.championName}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          game.win ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                          {game.win ? 'VICTOIRE' : 'DÉFAITE'}
                                        </div>
                                      </div>

                                      {/* Stats */}
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
                                          <div className="text-lg font-bold text-white">{game.impactScore}/100</div>
                                          <div className="text-xs text-gray-400">Impact</div>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <div className="text-sm text-gray-300 italic leading-relaxed">
                                        {game.description}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 