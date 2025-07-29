// Calcul de l'Impact Score sur 100 avec algorithme sophistiqué
export function computeImpactScore(participant: any) {
  // Sécurisation de la durée de la partie
  let gameDuration = participant.gameDuration;
  if (!gameDuration || isNaN(gameDuration) || gameDuration < 60) {
    if (participant.timePlayed && !isNaN(participant.timePlayed)) {
      gameDuration = participant.timePlayed;
    } else {
      gameDuration = 20 * 60; // 20 minutes par défaut
    }
  }
  const durationMinutes = gameDuration / 60;
  if (!durationMinutes || isNaN(durationMinutes) || durationMinutes <= 0) return 0;

  // Récupération des stats sécurisées
  const kills = Number(participant.kills) || 0;
  const deaths = Number(participant.deaths) || 0;
  const assists = Number(participant.assists) || 0;
  const totalDamageDealtToChampions = Number(participant.totalDamageDealtToChampions) || 0;
  const totalMinionsKilled = Number(participant.totalMinionsKilled) || 0;
  const visionScore = Number(participant.visionScore) || 0;
  const goldEarned = Number(participant.goldEarned) || 0;
  const win = Boolean(participant.win);

  // === ALGORITHME SOPHISTIQUÉ ===

  // 1. SCORE KDA (0-25 points)
  let kdaScore = 0;
  if (deaths === 0) {
    // Perfect KDA (pas de mort)
    kdaScore = Math.min(25, (kills + assists) * 2);
  } else {
    const kda = (kills + assists) / deaths;
    if (kda >= 5) kdaScore = 25; // KDA exceptionnel
    else if (kda >= 3) kdaScore = 20; // Très bon KDA
    else if (kda >= 2) kdaScore = 15; // Bon KDA
    else if (kda >= 1) kdaScore = 10; // KDA correct
    else if (kda >= 0.5) kdaScore = 5; // KDA faible
    else kdaScore = 0; // KDA très faible
  }

  // 2. SCORE DAMAGE (0-25 points)
  const damagePerMinute = totalDamageDealtToChampions / durationMinutes;
  let damageScore = 0;
  if (damagePerMinute >= 2000) damageScore = 25; // Damage exceptionnel
  else if (damagePerMinute >= 1500) damageScore = 20; // Très bon damage
  else if (damagePerMinute >= 1000) damageScore = 15; // Bon damage
  else if (damagePerMinute >= 700) damageScore = 10; // Damage correct
  else if (damagePerMinute >= 500) damageScore = 5; // Damage faible
  else damageScore = 0; // Damage très faible

  // 3. SCORE FARMING (0-20 points)
  const csPerMinute = totalMinionsKilled / durationMinutes;
  let farmingScore = 0;
  if (csPerMinute >= 10) farmingScore = 20; // Farming exceptionnel
  else if (csPerMinute >= 8) farmingScore = 16; // Très bon farming
  else if (csPerMinute >= 6) farmingScore = 12; // Bon farming
  else if (csPerMinute >= 4) farmingScore = 8; // Farming correct
  else if (csPerMinute >= 2) farmingScore = 4; // Farming faible
  else farmingScore = 0; // Farming très faible

  // 4. SCORE VISION (0-15 points)
  const visionPerMinute = visionScore / durationMinutes;
  let visionScorePoints = 0;
  if (visionPerMinute >= 2) visionScorePoints = 15; // Vision exceptionnelle
  else if (visionPerMinute >= 1.5) visionScorePoints = 12; // Très bonne vision
  else if (visionPerMinute >= 1) visionScorePoints = 9; // Bonne vision
  else if (visionPerMinute >= 0.5) visionScorePoints = 6; // Vision correcte
  else if (visionPerMinute >= 0.2) visionScorePoints = 3; // Vision faible
  else visionScorePoints = 0; // Vision très faible

  // 5. SCORE GOLD (0-10 points)
  const goldPerMinute = goldEarned / durationMinutes;
  let goldScore = 0;
  if (goldPerMinute >= 500) goldScore = 10; // Gold exceptionnel
  else if (goldPerMinute >= 400) goldScore = 8; // Très bon gold
  else if (goldPerMinute >= 300) goldScore = 6; // Bon gold
  else if (goldPerMinute >= 200) goldScore = 4; // Gold correct
  else if (goldPerMinute >= 100) goldScore = 2; // Gold faible
  else goldScore = 0; // Gold très faible

  // 6. BONUS VICTOIRE (0-5 points)
  const victoryBonus = win ? 5 : 0;

  // === CALCUL FINAL ===
  const totalScore = kdaScore + damageScore + farmingScore + visionScorePoints + goldScore + victoryBonus;

  // Sécurisation finale
  if (isNaN(totalScore) || !isFinite(totalScore)) return 0;
  
  // Retourne un score entre 0 et 100
  return Math.max(0, Math.min(100, Math.round(totalScore)));
}

// Génération de descriptions dynamiques basées sur l'impact score
export function generateGameDescription({ kills, deaths, assists, impactScore, win }: any) {
  const kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;

  if (impactScore >= 85) {
    const phrases = [
      "🔥 Tu es entré dans cette game comme un ouragan divin. Rien ne pouvait t'arrêter. Chaque action était millimétrée, chaque teamfight tournait autour de toi. Les ennemis ont probablement désinstallé après ça.",
      "⚡ Mode Dieu activé. Rien ne pouvait t'arrêter. Une leçon de gameplay qui va dans les annales.",
      "💎 Une performance digne des plus grands. Si Riot regarde cette game, t'es directement embauché.",
      "👑 On n'a pas vu ça depuis Faker en 2013. Une destruction totale et méthodique."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  if (impactScore >= 70) {
    const phrases = [
      "💪 Performance solide et maîtrisée. Tu as été un pilier pour ton équipe, présent à chaque moment clé. Tu n'as pas juste joué — tu as imposé ton rythme à toute la partie.",
      "🚀 Solide performance, rien à redire. Tu as tenu la game à toi tout seul. Presque.",
      "🎯 Clairement un joueur qui sait ce qu'il fait. T'es pas là pour rigoler. Et ça s'est vu.",
      "💪 Tu as été l'épine dorsale de ton équipe. Chaque décision était la bonne."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  if (impactScore >= 50) {
    const phrases = [
      "✅ Une game correcte, sans éclat mais propre. Tu n'as pas trollé, tu n'as pas brillé. T'as fait le taff, et parfois c'est tout ce qu'on demande. Solide, sans être légendaire.",
      "👌 Pas catastrophique, mais pas mémorable non plus. Tu étais là, mais on s'en rappelle pas vraiment.",
      "🎮 C'était... bon, c'était une partie. Voilà. Service minimum mais correct.",
      "✅ Un peu partout, un peu nulle part. Mais au moins t'as pas feed."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  if (impactScore >= 35) {
    const phrases = [
      "😐 Game mitigée. Présent sans être impactant, utile sans être décisif. Tu pourrais faire bien mieux, on t'a déjà vu carry, là t'étais en mode spectateur impliqué.",
      "🤷‍♂️ Tu étais là, mais on se demande encore à quoi tu servais.",
      "😴 Une présence discrète. Trop discrète. On t'a presque oublié.",
      "🫤 Pas terrible, mais pas catastrophique non plus. Moyen, quoi."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  if (impactScore >= 20) {
    const phrases = [
      "🫠 C'était lent, mou, sans impact. On se demande encore si tu regardais Netflix sur l'autre écran. Ta présence n'a pas fait pencher la balance, t'as juste subi la game.",
      "😵‍💫 Une masterclass de nullité, on n'a pas vu ça depuis la bêta.",
      "🤦‍♂️ Il aurait mieux fait de regarder la game sur Twitch.",
      "😴 Même les bots auraient eu plus d'impact que toi."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  // Impact score < 20
  const phrases = [
    "💀 Tu as troll la partie comme un joueur bronze sous caféine. Une série d'erreurs grotesques, un positionnement digne d'un bot IA, et un score qui donne la nausée. T'étais l'arme secrète de l'équipe ennemie. Un vrai désastre.",
    "💩 Un fantôme sur la Faille. Invisible. Inutile. Irritant. Tes mates vont te bloquer après ça.",
    "🤡 Tu as cassé le record du monde de feed. Cette performance va hanter tes cauchemars.",
    "💀 Mon dieu... Cette game va dans les annales. Pas dans le bon sens."
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Ordre de tri des rangs
export const rankOrder = {
  'CHALLENGER': 1, 'GRANDMASTER': 2, 'MASTER': 3,
  'EMERALD': 4, 'DIAMOND': 5, 'PLATINUM': 6,
  'GOLD': 7, 'SILVER': 8, 'BRONZE': 9, 'IRON': 10,
};

// Fonction de tri par rang et division
export function sortByRankAndDivision(a: any, b: any) {
  const rankA = rankOrder[a.tier as keyof typeof rankOrder] ?? 99;
  const rankB = rankOrder[b.tier as keyof typeof rankOrder] ?? 99;
  
  if (rankA !== rankB) return rankA - rankB;

  const divisionA = parseInt(a.rank.replace(/\D/g, ''), 10) || 4;
  const divisionB = parseInt(b.rank.replace(/\D/g, ''), 10) || 4;
  return divisionA - divisionB;
} 