import { PlayerStats } from '@/types/league';

export const generateGameDescription = (stats: PlayerStats): string => {
  const kda = stats.deaths > 0 ? (stats.kills + stats.assists) / stats.deaths : stats.kills + stats.assists;
  const damagePerMinute = stats.damageDealt / (stats.gameDuration / 60);
  
  // Descriptions pour performances exceptionnelles
  if (kda > 5 && stats.win && damagePerMinute > 1500) {
    const excellent = [
      "🔥 Performance de légende ! Tu as carrément porté ton équipe sur tes épaules. Tes mates peuvent te remercier pour cette victoire épique !",
      "⚡ Game de malade ! KDA monstrueux, dégâts de fou... T'es sûr que t'es pas un pro qui se cache ?",
      "💎 Pure classe ! Cette performance va dans les annales. Tes ennemis vont encore en parler dans 3 mois.",
      "👑 MVP incontestable ! Tu as dominé cette game de A à Z. Respect total !"
    ];
    return excellent[Math.floor(Math.random() * excellent.length)];
  }
  
  // Descriptions pour bonnes performances
  if (kda > 3 && stats.win) {
    const good = [
      "✅ Excellente game ! Tu as bien contribué à la victoire avec un KDA solide et une bonne vision du jeu.",
      "👍 Très bonne performance ! Tu as fait le taff et tes mates peuvent compter sur toi.",
      "🎯 Game solide ! Bon équilibre entre agressivité et prudence. Continue comme ça !",
      "💪 Bien joué ! Tu as su te positionner correctement et apporter ta pierre à l'édifice."
    ];
    return good[Math.floor(Math.random() * good.length)];
  }
  
  // Descriptions pour performances moyennes
  if (kda > 1.5 && stats.win) {
    const average = [
      "👌 Correct ! Tu as fait ce qu'il fallait pour gagner, même si c'était pas la game de ta vie.",
      "🎮 Game honorable ! Tu as contribué à la victoire sans être exceptionnel.",
      "✅ Pas mal ! Tu as fait le minimum syndical pour la W, c'est déjà ça !",
      "🎯 Acceptable ! Tu n'as pas été un poids pour ton équipe, c'est le principal."
    ];
    return average[Math.floor(Math.random() * average.length)];
  }
  
  // Descriptions pour mauvaises performances
  if (kda < 1 && !stats.win) {
    const bad = [
      "😅 Cette game était compliquée... Tes mates ont dû compenser un peu, mais on va s'améliorer !",
      "🤦‍♂️ Ouch... Cette performance va dans les annales, mais pas dans le bon sens. On reprend !",
      "💀 Tes ennemis vont encore en parler dans 3 mois, mais pas pour les bonnes raisons...",
      "😴 Tu dormais pendant la game ou quoi ? Tes mates méritent mieux que ça !"
    ];
    return bad[Math.floor(Math.random() * bad.length)];
  }
  
  // Descriptions pour performances catastrophiques
  if (kda < 0.5 && stats.deaths > 8) {
    const terrible = [
      "💀 Mon dieu... Cette game va hanter tes cauchemars. Tes mates vont te bloquer après ça.",
      "🤡 Tu as carrément intérêt à te cacher après cette performance. Même un bot aurait fait mieux.",
      "💩 Cette performance va dans les annales... Du pire côté. Tes ennemis vont en parler pendant des années.",
      "😱 Tu as cassé le record du monde de feed. Tes mates vont te demander des comptes !"
    ];
    return terrible[Math.floor(Math.random() * terrible.length)];
  }
  
  // Description par défaut
  return "🎮 Game correcte, rien d'exceptionnel mais rien de grave non plus. On continue !";
};

export const getRankIcon = (tier: string): string => {
  const rankIcons: Record<string, string> = {
    'CHALLENGER': '👑',
    'GRANDMASTER': '💎',
    'MASTER': '🏆',
    'DIAMOND': '💎',
    'EMERALD': '💚',
    'PLATINUM': '🔵',
    'GOLD': '🥇',
    'SILVER': '⚪',
    'BRONZE': '🟠',
    'IRON': '🔴',
  };
  return rankIcons[tier] || '🎮';
};

export const getRankColor = (tier: string): string => {
  const colors: Record<string, string> = {
    'CHALLENGER': 'text-lol-gold',
    'GRANDMASTER': 'text-red-400',
    'MASTER': 'text-purple-400',
    'DIAMOND': 'text-cyan-400',
    'EMERALD': 'text-emerald-400',
    'PLATINUM': 'text-blue-400',
    'GOLD': 'text-yellow-400',
    'SILVER': 'text-gray-400',
    'BRONZE': 'text-orange-600',
    'IRON': 'text-red-600',
  };
  return colors[tier] || 'text-gray-400';
};

// NOUVELLE FONCTION : Calcul du score pondéré avec LP
export const getRankScore = (tier: string, rank: string, lp: number): number => {
  const tierOrder = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
  const rankOrder = ['I', 'II', 'III', 'IV'];
  
  const tierIndex = tierOrder.indexOf(tier);
  const rankIndex = rankOrder.indexOf(rank);
  
  if (tierIndex === -1) return 0;
  
  // Score de base : tier * 1000 + rank * 100
  let baseScore = (tierOrder.length - tierIndex) * 1000;
  
  if (rankIndex !== -1) {
    baseScore += (rankOrder.length - rankIndex) * 100;
  }
  
  // Ajout des LP comme facteur de priorité
  // Les LP sont ajoutés directement au score pour un tri plus précis
  const lpScore = Math.min(lp, 100); // Limiter à 100 pour éviter les abus
  
  return baseScore + lpScore;
};

// ANCIENNE FONCTION (conservée pour compatibilité)
export const getRankOrder = (tier: string, rank: string): number => {
  const tierOrder = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
  const rankOrder = ['I', 'II', 'III', 'IV'];
  
  const tierIndex = tierOrder.indexOf(tier);
  const rankIndex = rankOrder.indexOf(rank);
  
  return tierIndex * 1000 + (4 - rankIndex);
};

// FONCTION DE TRI AVANCÉE
export const sortPlayersByRank = (players: any[]): any[] => {
  return [...players].sort((a, b) => {
    const scoreA = getRankScore(a.rank.tier, a.rank.rank, a.rank.leaguePoints);
    const scoreB = getRankScore(b.rank.tier, b.rank.rank, b.rank.leaguePoints);
    
    // Tri décroissant (meilleur score en premier)
    return scoreB - scoreA;
  });
};

// FONCTION POUR AFFICHER LE RANG FORMATÉ
export const formatRankDisplay = (tier: string, rank: string, lp: number): string => {
  if (tier === 'CHALLENGER' || tier === 'GRANDMASTER' || tier === 'MASTER') {
    return `${tier} ${lp} LP`;
  }
  return `${tier} ${rank} ${lp} LP`;
}; 