'use client';

import { SquadStats as SquadStatsType, PlayerRank } from '@/types/league';
import { Users, Trophy, Target, TrendingUp } from 'lucide-react';

interface SquadStatsProps {
  players: PlayerRank[];
  totalGames: number;
}

export default function SquadStats({ players, totalGames }: SquadStatsProps) {
  const calculateSquadStats = (): SquadStatsType => {
    if (players.length === 0) {
      return {
        totalPlayers: 0,
        averageWinrate: 0,
        totalGames: 0,
        topPerformer: '',
        mostPlayedChampion: 'N/A',
        averageRank: 'N/A',
      };
    }

    const averageWinrate = players.reduce((sum, player) => sum + player.winrate, 0) / players.length;
    const topPerformer = players.reduce((top, player) => player.winrate > top.winrate ? player : top, players[0]);
    
    // Calcul du rang moyen
    const tierOrder = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
    const averageTierIndex = Math.round(
      players.reduce((sum, player) => sum + tierOrder.indexOf(player.tier), 0) / players.length
    );
    const averageRank = tierOrder[averageTierIndex] || 'N/A';

    return {
      totalPlayers: players.length,
      averageWinrate: Math.round(averageWinrate),
      totalGames,
      topPerformer: topPerformer.summonerName,
      mostPlayedChampion: 'N/A', // À implémenter avec les stats de match
      averageRank,
    };
  };

  const stats = calculateSquadStats();

  const getRankColor = (tier: string) => {
    const colors: Record<string, string> = {
      'CHALLENGER': 'text-yellow-400',
      'GRANDMASTER': 'text-red-500',
      'MASTER': 'text-purple-500',
      'DIAMOND': 'text-blue-400',
      'PLATINUM': 'text-green-400',
      'GOLD': 'text-yellow-500',
      'SILVER': 'text-gray-400',
      'BRONZE': 'text-orange-600',
      'IRON': 'text-gray-600',
    };
    return colors[tier] || 'text-gray-300';
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-accent-cyan" />
        Stats du Squad
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Nombre de joueurs */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Joueurs</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalPlayers}</div>
        </div>

        {/* Winrate moyen */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Winrate</span>
          </div>
          <div className={`text-2xl font-bold ${
            stats.averageWinrate >= 60 ? 'text-green-400' : 
            stats.averageWinrate >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {stats.averageWinrate}%
          </div>
        </div>

        {/* Total games */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Games</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
        </div>

        {/* Rang moyen */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Rang moyen</span>
          </div>
          <div className={`text-lg font-bold ${getRankColor(stats.averageRank)}`}>
            {stats.averageRank}
          </div>
        </div>
      </div>

      {/* Top performer */}
      {stats.topPerformer && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 rounded-lg border border-yellow-400/20">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="text-sm text-gray-400">Top performer : </span>
              <span className="text-white font-medium">{stats.topPerformer}</span>
            </div>
          </div>
        </div>
      )}

      {players.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune statistique disponible</p>
          <p className="text-sm">Ajoutez des joueurs pour voir les stats du squad</p>
        </div>
      )}
    </div>
  );
} 