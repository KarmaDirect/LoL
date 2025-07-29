'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Trophy, ArrowLeft, RotateCcw, Users, Clock, Target, Crown } from 'lucide-react';
import Link from 'next/link';
import { getMixedQuestions, QuizQuestion } from '@/data/quizQuestions';
import { saveQuizScore, getCurrentQuizLeaderboard, hasPlayerPlayedToday, QuizScore } from '@/services/quizService';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Charger les questions du jour
    const dailyQuestions = getMixedQuestions(20);
    setQuestions(dailyQuestions);
    
    // Charger le leaderboard actuel
    const currentLeaderboard = getCurrentQuizLeaderboard();
    setLeaderboard(currentLeaderboard);
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
    if (answerIndex === questions[currentQuestion].correctAnswer) {
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
        score: Math.round((score / questions.length) * 100),
        totalQuestions: questions.length,
        correctAnswers: score,
        date: new Date().toISOString(),
        timeSpent,
        difficulty: 'Mixte'
      };
      saveQuizScore(finalScore);
      
      // Recharger le leaderboard
      const updatedLeaderboard = getCurrentQuizLeaderboard();
      setLeaderboard(updatedLeaderboard);
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
    
    // Nouvelles questions
    const newQuestions = getMixedQuestions(20);
    setQuestions(newQuestions);
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "🎉 Expert du lore ! Tu connais tout sur l'univers de LoL !";
    if (percentage >= 70) return "👍 Très bien ! Tu as une excellente connaissance du lore !";
    if (percentage >= 50) return "👌 Pas mal ! Tu connais bien les bases du lore !";
    if (percentage >= 30) return "😅 Moyen... Il faut réviser un peu le lore !";
    return "💀 Ouch... Il faut vraiment réviser le lore de LoL !";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <Brain className="w-16 h-16 mx-auto mb-4 text-lol-purple" />
              <h1 className="text-3xl font-bold text-gradient mb-2">Quiz LoL Lore</h1>
              <p className="text-gray-400">Testez vos connaissances sur l'univers de League of Legends</p>
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
                <h3 className="text-white font-semibold mb-2">Informations du quiz</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>• 20 questions mixtes (facile, moyen, difficile)</div>
                  <div>• Une seule participation par jour</div>
                  <div>• Leaderboard en temps réel</div>
                  <div>• Score sur 100 points</div>
                </div>
              </div>

              {leaderboard && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-lol-gold" />
                    Leaderboard du jour
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.scores.slice(0, 5).map((score: any, index: number) => (
                      <div key={score.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-4 h-4 text-lol-gold" />}
                          <span className="text-white">{score.playerName}</span>
                        </div>
                        <span className="text-lol-gold font-bold">{score.score}/100</span>
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
            <Brain className="w-16 h-16 mx-auto mb-4 text-lol-purple" />
            <h1 className="text-3xl font-bold text-gradient mb-2">Quiz LoL Lore</h1>
            <p className="text-gray-400">Joueur: {playerName}</p>
          </div>

          {!quizCompleted ? (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-lol-gold font-bold">Score: {score}</span>
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
              <h2 className="text-xl font-semibold text-white mb-6">
                {questions[currentQuestion]?.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion]?.choices.map((choice, index) => (
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
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'quiz-option-correct'
                          : 'quiz-option-incorrect'
                        : index === questions[currentQuestion].correctAnswer
                        ? 'quiz-option-correct'
                        : 'quiz-option'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedAnswer !== null && (
                        <>
                          {index === questions[currentQuestion].correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-lol-green" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="w-5 h-5 text-lol-red" />
                          ) : null}
                        </>
                      )}
                      <span className="text-white">{choice}</span>
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
                  <p className="text-gray-300 mb-4">{questions[currentQuestion].explanation}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="lol-button"
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
                {Math.round((score / questions.length) * 100)}/100 points
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Temps : {formatTime(timeSpent)}
              </p>
              <p className="text-lg text-gray-400 mb-8">
                {getScoreMessage(score, questions.length)}
              </p>

              {/* Leaderboard */}
              {leaderboard && (
                <div className="mb-8 p-6 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4 text-lol-gold" />
                    Classement du jour
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.scores.slice(0, 10).map((score: any, index: number) => (
                      <div key={score.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-4 h-4 text-lol-gold" />}
                          <span className="text-white">{score.playerName}</span>
                          {score.playerName === playerName && (
                            <span className="text-lol-purple text-sm">(Vous)</span>
                          )}
                        </div>
                        <span className="text-lol-gold font-bold">{score.score}/100</span>
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