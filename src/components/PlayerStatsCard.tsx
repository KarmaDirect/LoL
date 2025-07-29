'use client';

import { useState } from 'react';
import { Trash2, ExternalLink, ChevronDown, ChevronUp, Gamepad2, Trophy, TrendingUp } from 'lucide-react';
import { PlayerRank, PlayerStats } from '@/types/league';
import { removeStoredSummoner } from '@/services/storageService';
import { useApp } from '@/contexts/AppContext';

// Génération de descriptions dynamiques basées sur les performances
const generateDynamicBrief = (stats: PlayerStats) => {
  const kda = stats.deaths > 0 ? (stats.kills + stats.assists) / stats.deaths : stats.kills + stats.assists;
  const damagePerMinute = stats.damageDealt / (stats.gameDuration / 60);
  
  // Messages pour les bonnes performances
  const goodMessages = [
    "🔥 Top 1 damage, vision de fou… t'étais en mission aujourd'hui.",
    "⚡ KDA de malade ! Tu as porté ton équipe à la victoire !",
    "💪 Performance monstrueuse ! Tes mates peuvent te remercier.",
    "🎯 Tir de sniper ! Chaque skill shot était parfait.",
    "🚀 Tu as carrément volé le spotlight ! MVP du match !"
  ];
  
  // Messages pour les performances moyennes
  const averageMessages = [
    "👌 Correct ! Tu as fait le taff sans plus.",
    "✅ Bonne game, tu as bien contribué.",
    "👍 Pas mal du tout, continue comme ça !",
    "🎮 Game solide, rien à redire.",
    "💯 Tu as fait ce qu'il fallait pour gagner."
  ];
  
  // Messages pour les mauvaises performances
  const badMessages = [
    "💩 Un 0/8/2 ? Mon frère t'étais là pour donner du bleu ou quoi ?",
    "😅 Cette game était compliquée... Mais on va s'améliorer !",
    "🤦‍♂️ Tu as fait de ton mieux... Enfin j'espère.",
    "😴 Tu dormais pendant la game ou quoi ?",
    "💀 Cette performance va dans les annales... Pas dans le bon sens."
  ];
  
  // Messages pour les performances catastrophiques
  const terribleMessages = [
    "💀 Mon dieu... Cette game va hanter tes cauchemars.",
    "🤡 Tu as carrément intérêt à te cacher après ça.",
    "💩 Même un bot aurait fait mieux.",
    "😱 Tes mates vont te bloquer après cette performance.",
    "💀 Tu as cassé le record du monde de feed."
  ];
  
  if (kda > 4 && stats.win && damagePerMinute > 1000) {
    return goodMessages[Math.floor(Math.random() * goodMessages.length)];
  } else if (kda > 2 && stats.win) {
    return averageMessages[Math.floor(Math.random() * averageMessages.length)];
  } else if (kda < 1 && !stats.win) {
    return badMessages[Math.floor(Math.random() * badMessages.length)];
  } else if (kda < 0.5 && stats.deaths > 8) {
    return terribleMessages[Math.floor(Math.random() * terribleMessages.length)];
  } else {
    return averageMessages[Math.floor(Math.random() * averageMessages.length)];
  }
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

interface PlayerStatsCardProps {
  summonerName: string;
  rank: PlayerRank | undefined;
  stats: PlayerStats[];
  isLoading: boolean;
}

export function PlayerStatsCard({ summonerName, rank, stats, isLoading }: PlayerStatsCardProps) {
  const { setStoredSummoners } = useApp();
  const [expandedGames, setExpandedGames] = useState(false);
  const [selectedGame, setSelectedGame] = useState<PlayerStats | null>(null);

  const handleRemovePlayer = () => {
    removeStoredSummoner(summonerName);
    const updatedSummoners = JSON.parse(localStorage.getItem('storedSummoners') || '[]');
    setStoredSummoners(updatedSummoners);
  };

  const handleGameClick = (game: PlayerStats) => {
    setSelectedGame(selectedGame?.matchId === game.matchId ? null : game);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!rank) {
    return (
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{summonerName}</h3>
          <button
            onClick={handleRemovePlayer}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-gray-400 text-sm">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Gamepad2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{summonerName}</h3>
            <p className="text-sm text-gray-400">Niveau {rank.summonerLevel || 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={handleRemovePlayer}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Rank Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className={`font-bold text-lg ${getRankColor(rank.tier)}`}>
            {rank.tier} {rank.rank}
          </span>
          <span className="text-white font-medium">{rank.leaguePoints} LP</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{rank.winrate}%</div>
            <div className="text-xs text-gray-400">Winrate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{rank.wins}</div>
            <div className="text-xs text-gray-400">Victoires</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{rank.losses}</div>
            <div className="text-xs text-gray-400">Défaites</div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      {stats.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Dernières games</h4>
            <button
              onClick={() => setExpandedGames(!expandedGames)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {expandedGames ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expandedGames ? 'Masquer' : 'Voir'}
            </button>
          </div>
          
          {expandedGames && (
            <div className="space-y-3">
              {stats.slice(0, 5).map((game, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleGameClick(game)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">{game.championName}</span>
                      <span className="text-sm text-gray-400">
                        {game.kills}/{game.deaths}/{game.assists}
                      </span>
                      <span className="text-sm text-gray-400">
                        {game.csPerMinute} CS/min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        game.win ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {game.win ? 'VICTOIRE' : 'DÉFAITE'}
                      </div>
                      {selectedGame?.matchId === game.matchId ? 
                        <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </div>
                  
                  {selectedGame?.matchId === game.matchId && (
                    <div className="mt-3 pt-3 border-t border-gray-600/30">
                      <div className="text-sm text-gray-300 italic">
                        {generateDynamicBrief(game)}
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Durée: {Math.round(game.gameDuration / 60)}min | 
                        Damage: {Math.round(game.damageDealt / 1000)}k | 
                        Vision: {game.visionScore}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Games Message */}
      {stats.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune game récente</p>
        </div>
      )}
    </div>
  );
} 