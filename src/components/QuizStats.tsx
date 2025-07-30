'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Target, Calendar, Star, Crown, TrendingUp, Clock, Zap } from 'lucide-react';
import { QuizLeaderboard, PlayerStats } from '@/types/quiz';
import { getAllDailyLeaderboards, getDailyQuizStats, getPlayerStats } from '@/services/dailyQuizService';

export default function QuizStats() {
  const [leaderboards, setLeaderboards] = useState<QuizLeaderboard[]>([]);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const allLeaderboards = getAllDailyLeaderboards();
    setLeaderboards(allLeaderboards);
    
    const stats = getDailyQuizStats();
    setGlobalStats(stats);
  }, []);

  const handleSearchPlayer = () => {
    if (searchPlayer.trim()) {
      const stats = getPlayerStats(searchPlayer.trim());
      setPlayerStats(stats);
    }
  };

  const getTopPlayers = () => {
    const allScores = leaderboards.flatMap(lb => lb.scores);
    const playerMap = new Map<string, { totalScore: number; daysPlayed: number; bestScore: number }>();
    
    allScores.forEach(score => {
      const existing = playerMap.get(score.playerName);
      if (existing) {
        existing.totalScore += score.score;
        existing.daysPlayed += 1;
        existing.bestScore = Math.max(existing.bestScore, score.score);
      } else {
        playerMap.set(score.playerName, {
          totalScore: score.score,
          daysPlayed: 1,
          bestScore: score.score
        });
      }
    });
    
    return Array.from(playerMap.entries())
      .map(([name, stats]) => ({
        name,
        averageScore: stats.totalScore / stats.daysPlayed,
        totalScore: stats.totalScore,
        daysPlayed: stats.daysPlayed,
        bestScore: stats.bestScore
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);
  };

  const topPlayers = getTopPlayers();

  return (
    <div className="min-h-screen bg-lol-dark">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-16 h-16 text-lol-gold" />
              <TrendingUp className="w-12 h-12 text-lol-purple" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Statistiques du Quiz Quotidien</h1>
            <p className="text-gray-400">Analysez les performances et les classements</p>
          </div>

          {/* Global Stats */}
          {globalStats && (
            <div className="mb-8 p-6 bg-white/5 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-lol-gold" />
                Statistiques Globales
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-lol-gold mb-2">{globalStats.totalParticipants}</div>
                  <div className="text-gray-400 flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    Participants
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lol-gold mb-2">{globalStats.averageScore}/10</div>
                  <div className="text-gray-400 flex items-center justify-center gap-1">
                    <Target className="w-4 h-4" />
                    Score moyen
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lol-gold mb-2">{globalStats.bestScore}/10</div>
                  <div className="text-gray-400 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" />
                    Meilleur score
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lol-gold mb-2">{globalStats.totalDays}</div>
                  <div className="text-gray-400 flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Jours actifs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player Search */}
          <div className="mb-8 p-6 bg-white/5 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-lol-purple" />
              Rechercher un joueur
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchPlayer}
                onChange={(e) => setSearchPlayer(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-lol-purple focus:outline-none"
                placeholder="Entrez le pseudo du joueur..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPlayer()}
              />
              <button
                onClick={handleSearchPlayer}
                className="lol-button"
              >
                Rechercher
              </button>
            </div>
            
            {playerStats && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Statistiques de {playerStats.playerName}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lol-gold font-bold">{playerStats.bestScore}/10</div>
                    <div className="text-gray-400">Meilleur score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lol-gold font-bold">{playerStats.averageScore}/10</div>
                    <div className="text-gray-400">Score moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lol-gold font-bold">{playerStats.totalDaysPlayed}</div>
                    <div className="text-gray-400">Jours joués</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lol-gold font-bold">
                      {new Date(playerStats.lastPlayed).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-gray-400">Dernière partie</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Players */}
          <div className="mb-8 p-6 bg-white/5 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-lol-gold" />
              Top 10 des joueurs
            </h2>
            <div className="space-y-2">
              {topPlayers.map((player, index) => (
                <div key={player.name} className="flex items-center justify-between p-3 rounded bg-white/5">
                  <div className="flex items-center gap-3">
                    {index === 0 && <Crown className="w-5 h-5 text-lol-gold" />}
                    <span className="text-white font-medium">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{player.averageScore.toFixed(1)}/10</div>
                      <div className="text-gray-400">Moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{player.bestScore}/10</div>
                      <div className="text-gray-400">Meilleur</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{player.daysPlayed}</div>
                      <div className="text-gray-400">Jours</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Leaderboards */}
          <div className="p-6 bg-white/5 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lol-blue" />
              Leaderboards par jour
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboards.map((leaderboard) => (
                <div key={leaderboard.dayNumber} className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-lol-gold" />
                    Jour {leaderboard.dayNumber}
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.scores.slice(0, 5).map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-3 h-3 text-lol-gold" />}
                          <span className="text-white truncate">{score.playerName}</span>
                        </div>
                        <span className="text-lol-gold font-bold">{score.score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 