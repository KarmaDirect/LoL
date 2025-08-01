'use client';

import { useState, useEffect } from 'react';
import { LiveGameInfo } from '@/types/liveGame';

export function useLiveGames() {
  const [liveGames, setLiveGames] = useState<LiveGameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPlayerLiveGame = (summonerName: string): LiveGameInfo | null => {
    return liveGames.find(game => game.player.summonerName === summonerName) || null;
  };

  const isPlayerLive = (summonerName: string): boolean => {
    return liveGames.some(game => game.player.summonerName === summonerName);
  };

  // Pour l'instant, retourner des données vides
  // À connecter avec l'API Riot plus tard
  useEffect(() => {
    setLiveGames([]);
  }, []);

  return {
    liveGames,
    isLoading,
    getPlayerLiveGame,
    isPlayerLive,
  };
} 