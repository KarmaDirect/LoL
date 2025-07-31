import { Friend, LiveGame, LiveGameInfo } from '@/types/liveGame';
import { RIOT_API_CONFIG, SUMMONER_SPELLS, TEAM_IDS } from '@/config/constants';

// Mapping des championId vers les noms de champions (pour les champions les plus populaires)
const CHAMPION_NAMES: { [key: number]: string } = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'Twisted Fate', 5: 'Xin Zhao',
  6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'Master Yi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir',
  16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu',
  21: 'Miss Fortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana',
  26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: 'Chogath', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco',
  36: 'Dr Mundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar',
  48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'Jarvan IV',
  60: 'Elise', 61: 'Orianna', 62: 'Wukong', 63: 'Brand', 64: 'Lee Sin',
  67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger',
  75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas',
  80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali',
  85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon',
  92: 'Riven', 96: 'KogMaw', 98: 'Shen', 99: 'Lux', 101: 'Xerath',
  102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani',
  114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim',
  121: 'Khazix', 122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana',
  133: 'Quinn', 134: 'Syndra', 136: 'Aurelion Sol', 141: 'Kayn', 142: 'Zoe',
  143: 'Zyra', 145: 'Kaisa', 147: 'Seraphine', 150: 'Gnar', 154: 'Zac',
  157: 'Yasuo', 161: 'Velkoz', 163: 'Taliyah', 164: 'Camille', 166: 'Akshan',
  200: 'Belveth', 201: 'Braum', 202: 'Jhin', 203: 'Kindred', 221: 'Zeri',
  222: 'Jinx', 223: 'Tahm Kench', 234: 'Viego', 235: 'Senna', 236: 'Lucian',
  238: 'Zed', 240: 'Kled', 245: 'Ekko', 246: 'Qiyana', 254: 'Vi',
  266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi', 360: 'Samira',
  412: 'Thresh', 420: 'Illaoi', 421: 'RekSai', 427: 'Ivern', 429: 'Kalista',
  432: 'Bard', 516: 'Ornn', 517: 'Sylas', 518: 'Neeko', 523: 'Aphelios',
  526: 'Rell', 555: 'Pyke', 711: 'Vex', 777: 'Yone', 875: 'Sett',
  876: 'Lillia', 887: 'Gwen', 888: 'Renata', 895: 'Nilah', 897: 'KSante',
  902: 'Milio', 950: 'Naafiri', 901: 'Briar', 902: 'Milio', 903: 'Hwei'
};

// Cache pour éviter les requêtes répétées
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute (augmenté pour réduire les requêtes)

// Rate limiting amélioré
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 seconde entre les requêtes (très conservateur)
const MAX_REQUESTS_PER_MINUTE = 50; // Limite à 50 requêtes par minute
let requestCount = 0;
let minuteStartTime = Date.now();

// Fonction utilitaire pour attendre
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour gérer le rate limiting amélioré
async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now();
  
  // Réinitialiser le compteur si une minute s'est écoulée
  if (now - minuteStartTime >= 60000) {
    requestCount = 0;
    minuteStartTime = now;
  }
  
  // Vérifier la limite par minute
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = 60000 - (now - minuteStartTime);
    console.log(`⏳ Rate limiting: limite par minute atteinte, attente de ${waitTime}ms`);
    await delay(waitTime);
    requestCount = 0;
    minuteStartTime = Date.now();
  }
  
  // Vérifier l'intervalle minimum entre les requêtes
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Rate limiting: attente de ${waitTime}ms`);
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
  requestCount++;
  
  console.log(`📊 Requête ${requestCount}/${MAX_REQUESTS_PER_MINUTE} cette minute`);
  
  return fetch(url, options);
}

// Fonction pour vérifier le cache
function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Cache hit pour ${key}`);
    return cached.data;
  }
  return null;
}

// Fonction pour mettre en cache
function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`💾 Cache mis à jour pour ${key}`);
}

export async function getSummonerByName(summonerName: string): Promise<any> {
  try {
    // Vérifier le cache
    const cacheKey = `summoner-${summonerName}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    console.log(`🔍 Récupération des données summoner pour ${summonerName}...`);
    
    const response = await rateLimitedFetch(`/api/summoner?name=${encodeURIComponent(summonerName)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur API: ${response.status}`);
    }

    const summonerData = await response.json();
    setCache(cacheKey, summonerData);
    console.log(`✅ Données summoner récupérées pour ${summonerName}`);
    return summonerData;
  } catch (error) {
    console.error(`Erreur lors de la récupération du summoner ${summonerName}:`, error);
    throw error;
  }
}

export async function getActiveGameBySummonerId(summonerId: string): Promise<LiveGame | null> {
  try {
    // Cette fonction n'est plus utilisée directement, on utilise checkPlayerLiveStatus
    throw new Error('Cette fonction est dépréciée. Utilisez checkPlayerLiveStatus.');
  } catch (error) {
    console.error(`Erreur lors de la récupération de la partie active pour ${summonerId}:`, error);
    throw error;
  }
}

export async function checkPlayerLiveStatus(player: Friend): Promise<LiveGameInfo | null> {
  try {
    // Vérifier le cache
    const cacheKey = `live-${player.summonerName}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    console.log(`🔍 Vérification du statut live pour ${player.summonerName}...`);
    
    const response = await rateLimitedFetch(`/api/summoner?name=${encodeURIComponent(player.summonerName)}&action=live`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur API: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.live) {
      console.log(`ℹ️ ${player.summonerName} n'est pas en partie`);
      // Mettre en cache même les résultats négatifs (mais avec une durée plus courte)
      setCache(cacheKey, null);
      return null;
    }

    console.log(`✅ ${player.summonerName} est en partie !`);
    
    // Enrichir les données avec les noms des champions
    const enrichedParticipants = data.game.participants.map((participant: any) => {
      const championName = CHAMPION_NAMES[participant.championId] || `Champion ${participant.championId}`;
      return {
        ...participant,
        championName,
        isTrackedPlayer: participant.summonerName === player.summonerName,
      };
    });

    const result = {
      player,
      game: {
        ...data.game,
        participants: enrichedParticipants,
      },
      lastUpdated: typeof window !== 'undefined' ? Date.now() : 0,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Erreur lors de la vérification du statut live pour ${player.summonerName}:`, error);
    return null;
  }
}

export async function checkAllPlayersLiveStatus(players: Friend[]): Promise<LiveGameInfo[]> {
  const liveGames: LiveGameInfo[] = [];

  // Vérifier chaque joueur en séquence pour éviter le rate limiting
  for (const player of players) {
    try {
      const liveGame = await checkPlayerLiveStatus(player);
      if (liveGame) {
        liveGames.push(liveGame);
      }
    } catch (error) {
      console.error(`Erreur pour ${player.summonerName}:`, error);
    }
  }

  return liveGames;
}

export function getSummonerSpellName(spellId: number): string {
  return SUMMONER_SPELLS[spellId as keyof typeof SUMMONER_SPELLS] || `Spell ${spellId}`;
}

export function getTeamName(teamId: number): string {
  return teamId === TEAM_IDS.BLUE ? 'Équipe Bleue' : 'Équipe Rouge';
}

export function getRoleFromLane(lane: string, role: string): string {
  if (lane === 'BOTTOM' && role === 'DUO_CARRY') return 'ADC';
  if (lane === 'BOTTOM' && role === 'DUO_SUPPORT') return 'Support';
  if (lane === 'JUNGLE') return 'Jungle';
  if (lane === 'MIDDLE') return 'Mid';
  if (lane === 'TOP') return 'Top';
  return role || lane;
} 