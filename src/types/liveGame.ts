export interface Friend {
  summonerName: string;
}

export interface LiveGamePlayer {
  summonerId: string;
  summonerName: string;
  championId: number;
  championName?: string;
  teamId: number;
  spell1Id: number;
  spell2Id: number;
  role?: string;
  lane?: string;
  isTrackedPlayer?: boolean;
}

export interface LiveGame {
  gameId: number;
  gameType: string;
  gameStartTime: number;
  mapId: number;
  gameLength: number;
  platformId: string;
  gameMode: string;
  gameQueueConfigId: number;
  observers: {
    encryptionKey: string;
  };
  participants: LiveGamePlayer[];
}

export interface LiveGameInfo {
  player: Friend;
  game: LiveGame;
  lastUpdated: number;
}

export interface LiveGameState {
  liveGames: LiveGameInfo[];
  isLoading: boolean;
  error: string | null;
} 