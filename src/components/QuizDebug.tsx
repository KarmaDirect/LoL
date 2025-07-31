'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getCurrentDayNumber, 
  getDailyQuizStats, 
  verifyNoQuestionRepetition, 
  getQuestionsForDay,
  forceDayOne,
  resetDailyQuizData,
  debugAllDays,
  verifyDataIntegrity,
  checkOriginalFileRepetitions
} from '@/services/dailyQuizService';
import { Brain, Calendar, AlertTriangle, RotateCcw, Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function QuizDebug() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [stats, setStats] = useState<any>(null);
  const [noRepetition, setNoRepetition] = useState<boolean>(true);
  const [dayQuestions, setDayQuestions] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const availableDays = 7; // 74 questions = 7 jours complets + 4 questions supplémentaires

  useEffect(() => {
    updateDebugInfo();
  }, []);

  const updateDebugInfo = () => {
    setCurrentDay(getCurrentDayNumber());
    setStats(getDailyQuizStats());
    setNoRepetition(verifyNoQuestionRepetition());
    setDayQuestions(getQuestionsForDay(selectedDay));
  };

  const handleForceDayOne = () => {
    forceDayOne();
    updateDebugInfo();
  };

  const handleResetAll = () => {
    resetDailyQuizData();
    updateDebugInfo();
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    setDayQuestions(getQuestionsForDay(day));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-lol-purple" />
        <h3 className="text-lg font-semibold text-white">Debug Quiz Quotidien</h3>
      </div>

      {/* Informations actuelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-lol-blue" />
            <span className="text-sm text-gray-300">Jour actuel</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentDay}/{availableDays}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {noRepetition ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm text-gray-300">Questions uniques</span>
          </div>
          <div className="text-sm text-white">
            {noRepetition ? '✅ Aucune répétition' : '❌ Répétitions détectées'}
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-lol-purple" />
            <span className="text-sm text-gray-300">Participants</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalParticipants || 0}</div>
        </div>
      </div>

      {/* Actions de debug - Version simplifiée */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleForceDayOne}
          className="flex items-center gap-2 px-4 py-2 bg-lol-blue text-white rounded-lg font-medium"
        >
          <Play className="w-4 h-4" />
          Forcer Jour 1
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Complet
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={updateDebugInfo}
          className="flex items-center gap-2 px-4 py-2 bg-lol-purple text-white rounded-lg font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={debugAllDays}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium"
        >
          <Brain className="w-4 h-4" />
          Debug Console
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={verifyDataIntegrity}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          Vérifier Intégrité
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkOriginalFileRepetitions}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium"
        >
          <AlertTriangle className="w-4 h-4" />
          Vérifier Fichier JSON
        </motion.button>
      </div>

      {/* Sélecteur de jour */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Voir les questions du jour :
        </label>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: availableDays }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-lol-purple text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Jour {day}
            </button>
          ))}
        </div>
      </div>

      {/* Questions du jour sélectionné */}
      {dayQuestions.length > 0 && (
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">
            Questions du Jour {selectedDay} ({dayQuestions.length} questions)
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {dayQuestions.map((question, index) => (
              <div key={index} className="text-sm text-gray-300 p-2 bg-white/5 rounded">
                <div className="font-medium text-white mb-1">
                  {index + 1}. {question.question}
                </div>
                <div className="text-xs text-gray-400">
                  Réponse: {question.answer} | Difficulté: {question.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avertissement */}
      <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-yellow-200">
            Ce composant est uniquement pour le debug. Il sera supprimé en production.
          </span>
        </div>
      </div>
    </motion.div>
  );
} 