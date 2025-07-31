import { Summoner, PlayerRank, PlayerStats, Match } from '@/types/league';
import { computeImpactScore, generateGameDescription } from './impactScoreService';

export class RiotApiService {
  // Récupérer les informations d'un summoner par son nom
  static async getSummonerByName(summonerName: string): Promise<Summoner> {
    try {
      const response = await fetch(`/api/summoner?name=${encodeURIComponent(summonerName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du summoner:', error);
      throw error;
    }
  }

  // Récupérer les informations de rank d'un summoner
  static async getSummonerRank(puuid: string): Promise<PlayerRank[]> {
    try {
      const response = await fetch(`/api/rank?summonerId=${puuid}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du rank:', error);
      throw error;
    }
  }

  // Récupérer la liste des matchs d'un joueur (filtré pour Solo/Duo uniquement)
  static async getMatchIds(puuid: string, count: number = 10): Promise<string[]> {
    try {
      const response = await fetch(`/api/matches?puuid=${puuid}&count=${count}&queue=420`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs:', error);
      throw error;
    }
  }

  // Récupérer les détails d'un match
  static async getMatchDetails(matchId: string): Promise<Match> {
    try {
      const response = await fetch(`/api/match?matchId=${matchId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du match:', error);
      throw error;
    }
  }

  // Récupérer les informations complètes d'un joueur (summoner + rank)
  static async getPlayerRank(summonerName: string): Promise<PlayerRank> {
    try {
      console.log('🎮 Récupération des infos rank pour:', summonerName);
      
      // 1. Récupérer les infos du summoner
      const summoner = await this.getSummonerByName(summonerName);
      console.log('✅ Summoner trouvé:', summoner.name);
      
      // 2. Récupérer les infos de rank
      const rankInfos = await this.getSummonerRank(summoner.puuid);
      console.log('✅ Rank infos trouvées:', rankInfos.length);
      
      // Trouver le rank SoloQ (RANKED_SOLO_5x5)
      const soloQRank = rankInfos.find(rank => rank.queueType === 'RANKED_SOLO_5x5');
      
      if (!soloQRank) {
        // Si pas de rank SoloQ, créer un rank par défaut
        return {
          summonerName: summoner.name,
          tier: 'UNRANKED',
          rank: '',
          leaguePoints: 0,
          wins: 0,
          losses: 0,
          winrate: 0,
          totalGames: 0,
          queueType: 'RANKED_SOLO_5x5'
        };
      }
      
      // Calculer le winrate
      const totalGames = soloQRank.wins + soloQRank.losses;
      const winrate = totalGames > 0 ? (soloQRank.wins / totalGames) * 100 : 0;
      
      return {
        summonerName: soloQRank.summonerName,
        tier: soloQRank.tier,
        rank: soloQRank.rank,
        leaguePoints: soloQRank.leaguePoints,
        wins: soloQRank.wins,
        losses: soloQRank.losses,
        winrate: Math.round(winrate * 100) / 100,
        totalGames,
        queueType: soloQRank.queueType
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du rank:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des dernières games d'un joueur
  static async getPlayerStats(summonerName: string): Promise<PlayerStats[]> {
    try {
      console.log('🎮 Récupération des stats pour:', summonerName);
      
      // 1. Récupérer les infos du summoner
      const summoner = await this.getSummonerByName(summonerName);
      
      // 2. Récupérer les IDs des matchs (filtré pour Solo/Duo)
      const matchIds = await this.getMatchIds(summoner.puuid, 10);
      console.log('✅ Match IDs trouvés:', matchIds.length);
      
      // 3. Récupérer les détails des 3 premiers matchs
      const recentMatches = await Promise.all(
        matchIds.slice(0, 3).map(matchId => this.getMatchDetails(matchId))
      );
      
      // 4. Traiter les données pour chaque match
      const playerStats: PlayerStats[] = [];
      
      for (const match of recentMatches) {
        // Trouver le participant correspondant au joueur
        const participant = match.info.participants.find(p => p.puuid === summoner.puuid);
        
        if (participant) {
          // Calculer l'impact score
          const impactScore = computeImpactScore(participant);
          
          // Générer la description dynamique
          const description = generateGameDescription({
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            impactScore,
            win: participant.win
          });
          
          const gameDuration = match.info.gameDuration / 60; // en minutes
          
          playerStats.push({
            matchId: match.info.gameId.toString(),
            championName: participant.championName,
            role: participant.individualPosition,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            csPerMinute: Math.round((participant.totalMinionsKilled / gameDuration) * 10) / 10,
            damageDealt: participant.totalDamageDealtToChampions,
            visionScore: participant.visionScore,
            gameDuration: match.info.gameDuration,
            win: participant.win,
            gameDate: new Date(match.info.gameCreation).toLocaleDateString('fr-FR'),
            impactScore,
            description
          });
        }
      }
      
      console.log('✅ Stats traitées:', playerStats.length);
      return playerStats;
      
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  }
} 