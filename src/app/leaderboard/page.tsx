'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, TrendingUp, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getRankIcon, getRankColor, getRankScore, sortPlayersByRank, formatRankDisplay } from '@/services/descriptionService';
import { useLiveGames } from '@/hooks/useLiveGames';
import LiveGameModal from '@/components/LiveGameModal';
import { LiveGameInfo } from '@/types/liveGame';

export default function LeaderboardPage() {
  const { storedSummoners, playerRanks, playerStats } = useApp();
  const { getPlayerLiveGame } = useLiveGames();
  const [sortedPlayers, setSortedPlayers] = useState<any[]>([]);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rank' | 'winrate' | 'games' | 'impact'>('rank');
  const [selectedGame, setSelectedGame] = useState<LiveGameInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const playersWithData = storedSummoners
      .map(summoner => {
        const rank = playerRanks[summoner.name];
        const stats = playerStats[summoner.name] || [];
        
        if (!rank) return null;

        const averageImpactScore = stats.length > 0 
          ? Math.round(stats.reduce((sum, stat) => sum + stat.impactScore, 0) / stats.length)
          : 0;

        return {
          name: summoner.name,
          rank,
          stats,
          averageImpactScore,
          rankScore: getRankScore(rank.tier, rank.rank, rank.leaguePoints)
        };
      })
      .filter(Boolean);

    // Tri automatique avec le nouveau système
    let sorted = [...playersWithData];
    
    switch (sortBy) {
      case 'rank':
        sorted = sortPlayersByRank(playersWithData);
        break;
      case 'winrate':
        sorted = sorted.sort((a, b) => b.rank.winrate - a.rank.winrate);
        break;
      case 'games':
        sorted = sorted.sort((a, b) => b.rank.totalGames - a.rank.totalGames);
        break;
      case 'impact':
        sorted = sorted.sort((a, b) => b.averageImpactScore - a.averageImpactScore);
        break;
      default:
        sorted = sortPlayersByRank(playersWithData);
    }

    setSortedPlayers(sorted);
  }, [storedSummoners, playerRanks, playerStats, sortBy]);

  const togglePlayerExpansion = (playerName: string) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return <ChevronUp className="w-4 h-4" />;
  };

  const getRankDisplay = (player: any) => {
    return formatRankDisplay(player.rank.tier, player.rank.rank, player.rank.leaguePoints);
  };

  const handleLiveClick = (summonerName: string) => {
    const game = getPlayerLiveGame(summonerName);
    if (game) {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

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
            <Trophy className="w-16 h-16 mx-auto mb-4 text-lol-gold" />
            <h1 className="text-3xl font-bold text-gradient mb-2">Leaderboard</h1>
            <p className="text-gray-400">Classement automatique par rang et LP</p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card-hover p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-lol-blue" />
              <div className="text-2xl font-bold text-white">{sortedPlayers.length}</div>
              <div className="text-sm text-gray-400">Joueurs classés</div>
            </div>
            
            <div className="glass-card-hover p-4 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-lol-gold" />
              <div className="text-2xl font-bold text-white">
                {sortedPlayers[0]?.rank.tier || 'N/A'}
              </div>
              <div className="text-sm text-gray-400">Meilleur rang</div>
            </div>
            
            <div className="glass-card-hover p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-lol-green" />
              <div className="text-2xl font-bold text-white">
                {sortedPlayers.length > 0 
                  ? Math.round(sortedPlayers.reduce((sum, p) => sum + p.rank.winrate, 0) / sortedPlayers.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-400">Winrate moyen</div>
            </div>
            
            <div className="glass-card-hover p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-lol-purple" />
              <div className="text-2xl font-bold text-white">
                {sortedPlayers.reduce((sum, p) => sum + p.rank.totalGames, 0)}
              </div>
              <div className="text-sm text-gray-400">Games totales</div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/30">
                  <th className="text-left p-4 font-semibold text-gray-400">#</th>
                  <th className="text-left p-4 font-semibold text-gray-400">Joueur</th>
                  <th className="text-left p-4 font-semibold text-gray-400">
                    <button 
                      onClick={() => setSortBy('rank')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Rang {getSortIcon('rank')}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-400">
                    <button 
                      onClick={() => setSortBy('winrate')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Winrate {getSortIcon('winrate')}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-400">
                    <button 
                      onClick={() => setSortBy('games')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Games {getSortIcon('games')}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-400">
                    <button 
                      onClick={() => setSortBy('impact')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Impact {getSortIcon('impact')}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <motion.tr
                    key={player.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Crown className="w-5 h-5 text-lol-gold" />}
                        <span className={`font-bold ${
                          index === 0 ? 'text-lol-gold' : 
                          index === 1 ? 'text-gray-300' : 
                          index === 2 ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${player.rank.profileIconId || 1}.png`}
                          alt={player.name}
                          className="w-10 h-10 rounded-full border-2 border-lol-purple/50"
                        />
                        <span className="font-semibold text-white">{player.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getRankIcon(player.rank.tier)}</span>
                        <span className={`font-semibold ${getRankColor(player.rank.tier)}`}>
                          {getRankDisplay(player)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          player.rank.winrate >= 60 ? 'text-lol-green' :
                          player.rank.winrate >= 50 ? 'text-lol-gold' : 'text-lol-red'
                        }`}>
                          {player.rank.winrate}%
                        </span>
                        <span className="text-gray-400">
                          ({player.rank.wins}W/{player.rank.losses}L)
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{player.rank.totalGames}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{player.averageImpactScore}</span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              player.averageImpactScore >= 80 ? 'bg-lol-green' :
                              player.averageImpactScore >= 60 ? 'bg-lol-gold' :
                              player.averageImpactScore >= 40 ? 'bg-yellow-500' : 'bg-lol-red'
                            }`}
                            style={{ width: `${player.averageImpactScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePlayerExpansion(player.name)}
                        className="lol-button-secondary"
                      >
                        {expandedPlayer === player.name ? 'Masquer' : 'Détails'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Player Details */}
          {expandedPlayer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Détails de {expandedPlayer}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedPlayers.find(p => p.name === expandedPlayer)?.stats.slice(0, 3).map((game: any, index: number) => (
                  <div
                    key={game.matchId}
                    className={`p-4 rounded-lg border ${
                      game.win ? 'border-lol-green/30 bg-lol-green/5' : 'border-lol-red/30 bg-lol-red/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{game.championName}</span>
                      <span className={`rank-badge ${
                        game.win ? 'bg-lol-green/20 text-lol-green' : 'bg-lol-red/20 text-lol-red'
                      }`}>
                        {game.win ? 'VICTOIRE' : 'DÉFAITE'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>K/D/A: <span className="font-bold">{game.kills}/{game.deaths}/{game.assists}</span></div>
                      <div>CS/min: <span className="font-bold">{game.csPerMinute}</span></div>
                      <div>Damage: <span className="font-bold">{Math.round(game.damageDealt / 1000)}k</span></div>
                      <div>Impact: <span className="font-bold">{game.impactScore}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {sortedPlayers.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-gray-400 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-4">Aucun joueur classé</h3>
              <p className="text-gray-400">
                Ajoutez des joueurs depuis la page d'accueil pour voir le classement.
              </p>
            </div>
          )}
        </motion.div>

        {/* Modal pour afficher les détails de la partie */}
        <LiveGameModal
          liveGame={selectedGame}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGame(null);
          }}
        />
      </div>
    </div>
  );
} 