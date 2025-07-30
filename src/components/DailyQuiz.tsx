'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Trophy, ArrowLeft, RotateCcw, Users, Clock, Target, Crown, Calendar, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { QuizQuestionFromJSON, QuizScore, QuizLeaderboard, PlayerStats } from '@/types/quiz';
import { 
  getCurrentDayQuestions, 
  saveDailyQuizScore, 
  getCurrentDayLeaderboard, 
  hasPlayerPlayedToday, 
  getPlayerStats,
  getCurrentDayNumber,
  getDailyQuizStats
} from '@/services/dailyQuizService';

export default function DailyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestionFromJSON[]>([]);
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboard | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [globalStats, setGlobalStats] = useState<any>(null);

  useEffect(() => {
    // Charger les questions du jour
    const dailyQuestions = getCurrentDayQuestions();
    setQuestions(dailyQuestions);
    
    // Charger le leaderboard actuel
    const currentLeaderboard = getCurrentDayLeaderboard();
    setLeaderboard(currentLeaderboard);
    
    // Charger les stats globales
    const stats = getDailyQuizStats();
    setGlobalStats(stats);
    
    // Obtenir le jour actuel
    setCurrentDay(getCurrentDayNumber());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !quizCompleted) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, quizCompleted]);

  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      alert('Veuillez entrer votre pseudo !');
      return;
    }
    
    if (hasPlayerPlayedToday(playerName.trim())) {
      alert('Vous avez déjà participé au quiz aujourd\'hui !');
      return;
    }
    
    setShowNameInput(false);
    setStartTime(new Date());
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (questions[currentQuestion].options[answerIndex] === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      // Sauvegarder le score
      const finalScore: QuizScore = {
        id: '',
        playerName: playerName.trim(),
        score: score,
        totalQuestions: questions.length,
        correctAnswers: score,
        date: new Date().toISOString(),
        timeSpent,
        dayNumber: currentDay
      };
      saveDailyQuizScore(finalScore);
      
      // Recharger le leaderboard et les stats
      const updatedLeaderboard = getCurrentDayLeaderboard();
      setLeaderboard(updatedLeaderboard);
      
      const stats = getPlayerStats(playerName.trim());
      setPlayerStats(stats);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setShowNameInput(true);
    setPlayerName('');
    setStartTime(null);
    setTimeSpent(0);
    setPlayerStats(null);
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "🎉 Expert absolu ! Tu maîtrises parfaitement League of Legends !";
    if (percentage >= 80) return "🌟 Excellent ! Tu as une connaissance exceptionnelle du jeu !";
    if (percentage >= 70) return "👍 Très bien ! Tu connais très bien l'univers de LoL !";
    if (percentage >= 60) return "👌 Bien joué ! Tu as une bonne maîtrise du jeu !";
    if (percentage >= 50) return "😊 Pas mal ! Tu connais les bases de LoL !";
    if (percentage >= 40) return "😅 Moyen... Il faut réviser un peu !";
    if (percentage >= 30) return "😬 Difficile... Il faut vraiment réviser !";
    return "💀 Ouch... Il faut vraiment se remettre à LoL !";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'text-green-400';
      case 'moyen': return 'text-yellow-400';
      case 'difficile': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return '🟢';
      case 'moyen': return '🟡';
      case 'difficile': return '🔴';
      default: return '⚪';
    }
  };

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-lol-dark">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="w-16 h-16 text-lol-purple" />
                <Calendar className="w-12 h-12 text-lol-blue" />
              </div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Quiz Quotidien LoL</h1>
              <p className="text-gray-400">Jour {currentDay}/10 - Testez vos connaissances sur League of Legends</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Votre pseudo</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-lol-purple focus:outline-none"
                  placeholder="Entrez votre pseudo..."
                  maxLength={20}
                />
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-lol-purple" />
                  Informations du quiz
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>• 10 questions par jour (rotation sur 10 jours)</div>
                  <div>• Une seule participation par jour</div>
                  <div>• Score sur 10 points</div>
                  <div>• Leaderboard en temps réel</div>
                  <div>• Progression automatique quotidienne</div>
                </div>
              </div>

              {globalStats && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-lol-gold" />
                    Statistiques globales
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{globalStats.totalParticipants}</div>
                      <div className="text-gray-400">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{globalStats.averageScore}/10</div>
                      <div className="text-gray-400">Score moyen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{globalStats.bestScore}/10</div>
                      <div className="text-gray-400">Meilleur score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lol-gold font-bold">{globalStats.totalDays}</div>
                      <div className="text-gray-400">Jours actifs</div>
                    </div>
                  </div>
                </div>
              )}

              {leaderboard && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-lol-gold" />
                    Leaderboard du jour {currentDay}
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.scores.slice(0, 5).map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-4 h-4 text-lol-gold" />}
                          <span className="text-white">{score.playerName}</span>
                        </div>
                        <span className="text-lol-gold font-bold">{score.score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartQuiz}
                disabled={!playerName.trim()}
                className="w-full lol-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Target className="w-4 h-4" />
                <span>Commencer le quiz</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lol-dark">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-16 h-16 text-lol-purple" />
              <Calendar className="w-12 h-12 text-lol-blue" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Quiz Quotidien LoL</h1>
            <p className="text-gray-400">Jour {currentDay}/10 - Joueur: {playerName}</p>
          </div>

          {!quizCompleted ? (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-lol-gold font-bold">Score: {score}/10</span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeSpent)}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-lol-blue to-lol-purple h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-medium ${getDifficultyColor(questions[currentQuestion]?.difficulty)}`}>
                    {getDifficultyIcon(questions[currentQuestion]?.difficulty)} {questions[currentQuestion]?.difficulty}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{questions[currentQuestion]?.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {questions[currentQuestion]?.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                      selectedAnswer === null
                        ? 'quiz-option'
                        : selectedAnswer === index
                        ? option === questions[currentQuestion].answer
                          ? 'quiz-option-correct'
                          : 'quiz-option-incorrect'
                        : option === questions[currentQuestion].answer
                        ? 'quiz-option-correct'
                        : 'quiz-option'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedAnswer !== null && (
                        <>
                          {option === questions[currentQuestion].answer ? (
                            <CheckCircle className="w-5 h-5 text-lol-green" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="w-5 h-5 text-lol-red" />
                          ) : null}
                        </>
                      )}
                      <span className="text-white">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Result */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="text-center mb-4">
                    {questions[currentQuestion].options[selectedAnswer!] === questions[currentQuestion].answer ? (
                      <div className="text-lol-green font-semibold">✅ Correct !</div>
                    ) : (
                      <div className="text-lol-red font-semibold">❌ Incorrect</div>
                    )}
                    <div className="text-gray-300 mt-2">
                      Réponse correcte : <span className="text-lol-green font-semibold">{questions[currentQuestion].answer}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="w-full lol-button"
                  >
                    {currentQuestion + 1 < questions.length ? 'Question suivante' : 'Voir les résultats'}
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Results */
            <div className="text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-lol-gold" />
              <h2 className="text-2xl font-bold text-white mb-4">Quiz terminé !</h2>
              <p className="text-xl text-gray-300 mb-2">
                Score final : {score}/{questions.length}
              </p>
              <p className="text-lg text-lol-gold font-bold mb-2">
                {score}/10 points
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Temps : {formatTime(timeSpent)}
              </p>
              <p className="text-lg text-gray-400 mb-8">
                {getScoreMessage(score, questions.length)}
              </p>

              {/* Player Stats */}
              {playerStats && (
                <div className="mb-8 p-6 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-lol-gold" />
                    Vos statistiques
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
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

              {/* Leaderboard */}
              {leaderboard && (
                <div className="mb-8 p-6 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4 text-lol-gold" />
                    Classement du jour {currentDay}
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.scores.slice(0, 10).map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-4 h-4 text-lol-gold" />}
                          <span className="text-white">{score.playerName}</span>
                          {score.playerName === playerName && (
                            <span className="text-lol-purple text-sm">(Vous)</span>
                          )}
                        </div>
                        <span className="text-lol-gold font-bold">{score.score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartQuiz}
                  className="lol-button"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer</span>
                </motion.button>
                
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="lol-button-secondary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à l'accueil</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 