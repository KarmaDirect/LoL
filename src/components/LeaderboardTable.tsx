'use client';

import { useState } from 'react';
import { PlayerRank } from '@/types/league';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLiveGames } from '@/hooks/useLiveGames';
import LiveIndicator from './LiveIndicator';

interface LeaderboardTableProps {
  players: PlayerRank[];
  onPlayerClick?: (playerName: string) => void;
  onLiveClick?: (playerName: string) => void;
}

export default function LeaderboardTable({ players, onPlayerClick, onLiveClick }: LeaderboardTableProps) {
  const [sortBy, setSortBy] = useState<'rank' | 'winrate' | 'games'>('rank');
  const { isPlayerLive, getPlayerLiveGame } = useLiveGames();

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

  const getRankBadge = (tier: string, rank: string) => {
    const tierColors: Record<string, string> = {
      'CHALLENGER': 'bg-yellow-400/20 border-yellow-400/30',
      'GRANDMASTER': 'bg-red-500/20 border-red-500/30',
      'MASTER': 'bg-purple-500/20 border-purple-500/30',
      'DIAMOND': 'bg-blue-400/20 border-blue-400/30',
      'PLATINUM': 'bg-green-400/20 border-green-400/30',
      'GOLD': 'bg-yellow-500/20 border-yellow-500/30',
      'SILVER': 'bg-gray-400/20 border-gray-400/30',
      'BRONZE': 'bg-orange-600/20 border-orange-600/30',
      'IRON': 'bg-gray-600/20 border-gray-600/30',
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium border ${tierColors[tier] || 'bg-gray-500/20 border-gray-500/30'}`;
  };

  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        const tierOrder = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
        const aTierIndex = tierOrder.indexOf(a.tier);
        const bTierIndex = tierOrder.indexOf(b.tier);
        if (aTierIndex !== bTierIndex) return aTierIndex - bTierIndex;
        return b.leaguePoints - a.leaguePoints;
      case 'winrate':
        return b.winrate - a.winrate;
      case 'games':
        return b.totalGames - a.totalGames;
      default:
        return 0;
    }
  });

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard Squad
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('rank')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'rank' 
                ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' 
                : 'bg-background-card/50 text-gray-300 hover:bg-background-card'
            }`}
          >
            Rang
          </button>
          <button
            onClick={() => setSortBy('winrate')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'winrate' 
                ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' 
                : 'bg-background-card/50 text-gray-300 hover:bg-background-card'
            }`}
          >
            Winrate
          </button>
          <button
            onClick={() => setSortBy('games')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'games' 
                ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' 
                : 'bg-background-card/50 text-gray-300 hover:bg-background-card'
            }`}
          >
            Games
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">#</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Pseudo</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Rang</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">LP</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Winrate</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Games</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr 
                key={player.summonerName}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-400/5 to-yellow-400/10' : ''
                }`}
                onClick={() => onPlayerClick?.(player.summonerName)}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="w-4 h-4 text-yellow-400" />}
                    {index === 1 && <Trophy className="w-4 h-4 text-gray-400" />}
                    {index === 2 && <Trophy className="w-4 h-4 text-orange-600" />}
                    <span className={`font-bold ${index < 3 ? 'text-white' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{player.summonerName}</span>
                    {isPlayerLive(player.summonerName) && (
                      <LiveIndicator
                        isLive={true}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLiveClick?.(player.summonerName);
                        }}
                        size="sm"
                      />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={getRankBadge(player.tier, player.rank)}>
                    {player.tier} {player.rank}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white font-medium">{player.leaguePoints} LP</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      player.winrate >= 60 ? 'text-green-400' : 
                      player.winrate >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {player.winrate}%
                    </span>
                    {player.winrate > 55 && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {player.winrate < 45 && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {player.winrate >= 45 && player.winrate <= 55 && <Minus className="w-4 h-4 text-gray-400" />}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{player.totalGames}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {players.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun joueur dans le leaderboard</p>
          <p className="text-sm">Ajoutez des pseudos pour commencer</p>
        </div>
      )}
    </div>
  );
} 