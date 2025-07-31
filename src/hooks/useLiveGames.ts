'use client';

import { useState, useEffect, useCallback } from 'react';
import { Friend, LiveGameInfo } from '@/types/liveGame';
import { checkAllPlayersLiveStatus } from '@/services/liveGameService';
import { useApp } from '@/contexts/AppContext';

export function useLiveGames() {
  const { storedSummoners } = useApp();
  const [liveGames, setLiveGames] = useState<LiveGameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getFriendsFromLeaderboard = useCallback((): Friend[] => {
    // Convertir les summoners du leaderboard en format Friend
    return storedSummoners.map(summoner => ({
      summonerName: summoner.name
    }));
  }, [storedSummoners]);

  const checkLiveStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const friends = getFriendsFromLeaderboard();
      if (friends.length === 0) {
        setLiveGames([]);
        return;
      }

      console.log(`🔍 Vérification du statut live pour ${friends.length} joueurs du leaderboard...`);
      const liveGamesData = await checkAllPlayersLiveStatus(friends);
      setLiveGames(liveGamesData);
      setLastUpdate(new Date());
      
      if (liveGamesData.length > 0) {
        console.log(`✅ ${liveGamesData.length} joueur(s) en partie détecté(s)`);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des parties en direct:', error);
      setError('Erreur lors de la vérification des parties en direct');
    } finally {
      setIsLoading(false);
    }
  }, [getFriendsFromLeaderboard]);

  const isPlayerLive = useCallback((summonerName: string): boolean => {
    return liveGames.some(game => game.player.summonerName === summonerName);
  }, [liveGames]);

  const getPlayerLiveGame = useCallback((summonerName: string): LiveGameInfo | null => {
    return liveGames.find(game => game.player.summonerName === summonerName) || null;
  }, [liveGames]);

  // Initialisation et vérification automatique
  useEffect(() => {
    if (!isInitialized && storedSummoners.length > 0) {
      setIsInitialized(true);
      // Délai de 10 secondes pour éviter les conflits avec le chargement initial
      setTimeout(() => {
        checkLiveStatus();
      }, 10000);
    }
  }, [isInitialized, storedSummoners.length]);

  // Vérification automatique toutes les 10 minutes
  useEffect(() => {
    if (!isInitialized || storedSummoners.length === 0) return;

    const interval = setInterval(() => {
      checkLiveStatus();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [isInitialized, storedSummoners.length]);

  return {
    liveGames,
    isLoading,
    error,
    lastUpdate,
    checkLiveStatus,
    isPlayerLive,
    getPlayerLiveGame,
  };
} 