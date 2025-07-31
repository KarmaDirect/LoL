// Configuration des constantes pour l'application

export const RIOT_API_CONFIG = {
  BASE_URL: 'https://euw1.api.riotgames.com/lol',
  DATA_DRAGON_BASE: 'https://ddragon.leagueoflegends.com/cdn/13.24.1',
  UPDATE_INTERVAL: 30000, // 30 secondes
  CHAMPION_IMAGE_PATH: '/img/champion',
  SPELL_IMAGE_PATH: '/img/spell',
  PROFILE_ICON_PATH: '/img/profileicon',
};

export const LIVE_GAME_CONFIG = {
  REFRESH_INTERVAL: 30000, // 30 secondes
  MAX_DISPLAY_COUNT: 6, // Nombre max d'amis affichés sur la page d'accueil
};

export const UI_CONFIG = {
  ANIMATION_DURATION: 0.3,
  HOVER_SCALE: 1.05,
  TAP_SCALE: 0.95,
};

export const GAME_MODES = {
  CLASSIC: 'CLASSIC',
  ARAM: 'ARAM',
  URF: 'URF',
  TFT: 'TFT',
};

export const TEAM_IDS = {
  BLUE: 100,
  RED: 200,
};

export const SUMMONER_SPELLS = {
  21: 'SummonerBarrier',
  1: 'SummonerBoost',
  14: 'SummonerDot',
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',
  7: 'SummonerHeal',
  13: 'SummonerMana',
  30: 'SummonerPoroRecall',
  31: 'SummonerPoroThrow',
  11: 'SummonerSmite',
  39: 'SummonerSnowURFSnowball_Mark',
  32: 'SummonerSnowball',
  12: 'SummonerTeleport',
  54: 'Summoner_UltBookPlaceholder',
  55: 'Summoner_UltBookSmitePlaceholder',
}; 