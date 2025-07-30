'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Brain, Trophy, Users, Target, Crown } from 'lucide-react';
import Link from 'next/link';
import { getCurrentDayLeaderboard, getCurrentDayNumber, getDailyQuizStats } from '@/services/dailyQuizService';

export default function DailyQuizPreview() {
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [globalStats, setGlobalStats] = useState<any>(null);

  useEffect(() => {
    const currentLeaderboard = getCurrentDayLeaderboard();
    setLeaderboard(currentLeaderboard);
    
    const stats = getDailyQuizStats();
    setGlobalStats(stats);
    
    setCurrentDay(getCurrentDayNumber());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-lol-blue to-lol-purple rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quiz Quotidien LoL</h3>
            <p className="text-sm text-gray-400">Jour {currentDay}/10</p>
          </div>
        </div>
        <Link href="/daily-quiz">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lol-button"
          >
            <Target className="w-4 h-4" />
            <span>Participer</span>
          </motion.button>
        </Link>
      </div>

      {globalStats && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-lol-gold">{globalStats.totalParticipants}</div>
            <div className="text-xs text-gray-400">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-lol-gold">{globalStats.averageScore}/10</div>
            <div className="text-xs text-gray-400">Score moyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-lol-gold">{globalStats.bestScore}/10</div>
            <div className="text-xs text-gray-400">Meilleur</div>
          </div>
        </div>
      )}

      {leaderboard && leaderboard.scores.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-lol-gold" />
            Top 3 du jour
          </h4>
          <div className="space-y-2">
            {leaderboard.scores.slice(0, 3).map((score: any, index: number) => (
              <div key={score.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                <div className="flex items-center gap-2">
                  {index === 0 && <Crown className="w-4 h-4 text-lol-gold" />}
                  <span className="text-white text-sm">{score.playerName}</span>
                </div>
                <span className="text-lol-gold font-bold text-sm">{score.score}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>10 questions par jour</span>
          <Link href="/quiz-stats" className="text-lol-purple hover:text-white transition-colors">
            Voir les stats →
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 