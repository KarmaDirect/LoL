'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoredSummoner, PlayerRank, PlayerStats } from '@/types/league';
import { getStoredSummoners } from '@/services/storageService';
import { RiotApiService } from '@/services/riotApi';

interface AppContextType {
  // État des summoners
  storedSummoners: StoredSummoner[];
  setStoredSummoners: (summoners: StoredSummoner[]) => void;
  
  // État des données des joueurs
  playerRanks: { [key: string]: PlayerRank };
  playerStats: { [key: string]: PlayerStats[] };
  
  // État de chargement
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // État d'erreur
  error: string | null;
  setError: (error: string | null) => void;
  
  // Actions
  loadPlayerData: (summonerName: string) => Promise<void>;
  loadAllPlayersData: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // État de la dernière mise à jour
  lastUpdate: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [storedSummoners, setStoredSummoners] = useState<StoredSummoner[]>([]);
  const [playerRanks, setPlayerRanks] = useState<{ [key: string]: PlayerRank }>({});
  const [playerStats, setPlayerStats] = useState<{ [key: string]: PlayerStats[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Charger les données de tous les joueurs
  const loadAllPlayersData = async (summoners: StoredSummoner[]) => {
    if (summoners.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    const newPlayerRanks: { [key: string]: PlayerRank } = {};
    const newPlayerStats: { [key: string]: PlayerStats[] } = {};

    try {
      for (const summoner of summoners) {
        try {
          console.log(`🎮 Chargement des données pour ${summoner.name}...`);
          
          const [rankData, statsData] = await Promise.all([
            RiotApiService.getPlayerRank(summoner.name),
            RiotApiService.getPlayerStats(summoner.name)
          ]);
          
          newPlayerRanks[summoner.name] = rankData;
          newPlayerStats[summoner.name] = statsData;
          
          console.log(`✅ Données chargées pour ${summoner.name}`);
        } catch (error) {
          console.error(`❌ Erreur pour ${summoner.name}:`, error);
          setError(`Impossible de charger les données pour ${summoner.name}`);
        }
      }
      
      setPlayerRanks(newPlayerRanks);
      setPlayerStats(newPlayerStats);
      setLastUpdate(new Date().toLocaleString('fr-FR'));
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données. Vérifiez votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les summoners stockés au démarrage
  useEffect(() => {
    const summoners = getStoredSummoners();
    setStoredSummoners(summoners);
    
    if (summoners.length > 0) {
      loadAllPlayersData(summoners);
    }
  }, []);

  // Charger les données d'un joueur spécifique
  const loadPlayerData = async (summonerName: string) => {
    try {
      console.log(`🎮 Chargement des données pour ${summonerName}...`);
      
      const [rankData, statsData] = await Promise.all([
        RiotApiService.getPlayerRank(summonerName),
        RiotApiService.getPlayerStats(summonerName)
      ]);
      
      setPlayerRanks(prev => ({
        ...prev,
        [summonerName]: rankData
      }));
      
      setPlayerStats(prev => ({
        ...prev,
        [summonerName]: statsData
      }));
      
      console.log(`✅ Données chargées pour ${summonerName}`);
      setLastUpdate(new Date().toLocaleString('fr-FR'));
      
    } catch (error) {
      console.error(`❌ Erreur pour ${summonerName}:`, error);
      setError(`Impossible de charger les données pour ${summonerName}`);
      throw error;
    }
  };

  // Rafraîchir toutes les données
  const refreshData = async () => {
    await loadAllPlayersData(storedSummoners);
  };

  const value: AppContextType = {
    storedSummoners,
    setStoredSummoners,
    playerRanks,
    playerStats,
    isLoading,
    setIsLoading,
    error,
    setError,
    loadPlayerData,
    loadAllPlayersData: () => loadAllPlayersData(storedSummoners),
    refreshData,
    lastUpdate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 