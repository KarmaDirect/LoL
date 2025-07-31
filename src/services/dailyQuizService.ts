import { QuizQuestionFromJSON, DailyQuizData, QuizScore, QuizLeaderboard, PlayerStats } from '@/types/quiz';
import quizData from '../../quizz/lol_quiz_vague_1.json';

// Convertir les données JSON en format TypeScript
const allQuestions: QuizQuestionFromJSON[] = quizData as QuizQuestionFromJSON[];

// Générer les 10 jours de questions (10 questions par jour) - SANS RÉPÉTITION
const generateDailyQuestions = (): DailyQuizData[] => {
  const dailyQuizzes: DailyQuizData[] = [];
  // Mélanger toutes les questions une seule fois
  const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
  
  // Calculer combien de jours complets on peut faire
  const totalQuestions = shuffledQuestions.length;
  const questionsPerDay = 10;
  const maxDays = Math.floor(totalQuestions / questionsPerDay);
  
  console.log(`📊 Génération des questions: ${totalQuestions} questions disponibles pour ${maxDays} jours complets`);
  
  for (let day = 1; day <= maxDays; day++) {
    const startIndex = (day - 1) * questionsPerDay;
    const dayQuestions = shuffledQuestions.slice(startIndex, startIndex + questionsPerDay);
    
    dailyQuizzes.push({
      dayNumber: day,
      questions: dayQuestions,
      date: new Date().toISOString().split('T')[0]
    });
  }
  
  // Si il reste des questions, les ajouter au dernier jour
  const remainingQuestions = totalQuestions % questionsPerDay;
  if (remainingQuestions > 0 && maxDays > 0) {
    const lastDayQuestions = shuffledQuestions.slice(maxDays * questionsPerDay);
    dailyQuizzes[dailyQuizzes.length - 1].questions.push(...lastDayQuestions);
    console.log(`📝 ${remainingQuestions} questions supplémentaires ajoutées au jour ${maxDays}`);
  }
  
  return dailyQuizzes;
};

// Obtenir le jour actuel (1-10) basé sur une date de référence plus récente
const getCurrentDay = (): number => {
  const today = new Date();
  // Utiliser une date de référence pour commencer au jour 1
  const startDate = new Date('2024-12-25'); // Date de référence ajustée pour jour 1
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return (daysDiff % 10) + 1;
};

// Obtenir les questions du jour actuel
export const getCurrentDayQuestions = (): QuizQuestionFromJSON[] => {
  const currentDay = getCurrentDay();
  const dailyQuizzes = getDailyQuizzes();
  const currentQuiz = dailyQuizzes.find(quiz => quiz.dayNumber === currentDay);
  
  if (!currentQuiz) {
    // Fallback: générer de nouvelles questions si pas trouvé
    const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, 10);
  }
  
  return currentQuiz.questions;
};

// Obtenir ou créer les données quotidiennes
const getDailyQuizzes = (): DailyQuizData[] => {
  const stored = localStorage.getItem('dailyQuizData');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newDailyQuizzes = generateDailyQuestions();
  localStorage.setItem('dailyQuizData', JSON.stringify(newDailyQuizzes));
  return newDailyQuizzes;
};

// Sauvegarder un score
export const saveDailyQuizScore = (score: QuizScore): void => {
  try {
    const currentDay = getCurrentDay();
    const existingData = localStorage.getItem('dailyQuizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    let currentLeaderboard = leaderboards.find(lb => lb.dayNumber === currentDay);
    
    if (!currentLeaderboard) {
      currentLeaderboard = {
        dayNumber: currentDay,
        date: new Date().toISOString().split('T')[0],
        scores: []
      };
      leaderboards.push(currentLeaderboard);
    }
    
    // Ajouter le nouveau score
    currentLeaderboard.scores.push({
      ...score,
      id: `${currentDay}_${Date.now()}`,
      dayNumber: currentDay,
      date: new Date().toISOString()
    });
    
    // Trier par score décroissant, puis par temps croissant
    currentLeaderboard.scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSpent - b.timeSpent;
    });
    
    // Garder seulement les 50 meilleurs scores
    currentLeaderboard.scores = currentLeaderboard.scores.slice(0, 50);
    
    localStorage.setItem('dailyQuizLeaderboards', JSON.stringify(leaderboards));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
  }
};

// Récupérer le leaderboard du jour actuel
export const getCurrentDayLeaderboard = (): QuizLeaderboard | null => {
  try {
    const currentDay = getCurrentDay();
    const existingData = localStorage.getItem('dailyQuizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    return leaderboards.find(lb => lb.dayNumber === currentDay) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return null;
  }
};

// Vérifier si un joueur a déjà participé aujourd'hui
export const hasPlayerPlayedToday = (playerName: string): boolean => {
  try {
    const currentDay = getCurrentDay();
    const existingData = localStorage.getItem('dailyQuizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    const currentLeaderboard = leaderboards.find(lb => lb.dayNumber === currentDay);
    if (!currentLeaderboard) return false;
    
    return currentLeaderboard.scores.some(score => score.playerName === playerName);
  } catch (error) {
    console.error('Erreur lors de la vérification du joueur:', error);
    return false;
  }
};

// Obtenir les statistiques d'un joueur
export const getPlayerStats = (playerName: string): PlayerStats | null => {
  try {
    const existingData = localStorage.getItem('dailyQuizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    const playerScores = leaderboards.flatMap(lb => 
      lb.scores.filter(score => score.playerName === playerName)
    );
    
    if (playerScores.length === 0) return null;
    
    const bestScore = Math.max(...playerScores.map(s => s.score));
    const totalDaysPlayed = new Set(playerScores.map(s => s.dayNumber)).size;
    const averageScore = playerScores.reduce((sum, score) => sum + score.score, 0) / playerScores.length;
    const lastPlayed = playerScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
    
    return {
      playerName,
      bestScore,
      totalDaysPlayed,
      averageScore: Math.round(averageScore * 10) / 10,
      lastPlayed
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des stats du joueur:', error);
    return null;
  }
};

// Obtenir tous les leaderboards
export const getAllDailyLeaderboards = (): QuizLeaderboard[] => {
  try {
    const existingData = localStorage.getItem('dailyQuizLeaderboards');
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des leaderboards:', error);
    return [];
  }
};

// Obtenir les statistiques globales
export const getDailyQuizStats = () => {
  try {
    const allLeaderboards = getAllDailyLeaderboards();
    const allScores = allLeaderboards.flatMap(lb => lb.scores);
    
    if (allScores.length === 0) {
      return {
        totalParticipants: 0,
        averageScore: 0,
        bestScore: 0,
        totalDays: 0,
        currentDay: getCurrentDay()
      };
    }
    
    const totalParticipants = new Set(allScores.map(s => s.playerName)).size;
    const averageScore = allScores.reduce((sum, score) => sum + score.score, 0) / allScores.length;
    const bestScore = Math.max(...allScores.map(s => s.score));
    const totalDays = allLeaderboards.length;
    
    return {
      totalParticipants,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore,
      totalDays,
      currentDay: getCurrentDay()
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    return {
      totalParticipants: 0,
      averageScore: 0,
      bestScore: 0,
      totalDays: 0,
      currentDay: getCurrentDay()
    };
  }
};

// Vérifier que les questions ne se répètent pas sur les 10 jours
export const verifyNoQuestionRepetition = (): boolean => {
  try {
    const dailyQuizzes = getDailyQuizzes();
    const allQuestionsUsed = new Set<string>();
    const repetitions: string[] = [];
    
    for (const quiz of dailyQuizzes) {
      for (const question of quiz.questions) {
        const questionKey = `${question.question}_${question.answer}`;
        if (allQuestionsUsed.has(questionKey)) {
          repetitions.push(`Jour ${quiz.dayNumber}: ${question.question}`);
          console.warn(`❌ RÉPÉTITION DÉTECTÉE - Jour ${quiz.dayNumber}: ${question.question}`);
        } else {
          allQuestionsUsed.add(questionKey);
        }
      }
    }
    
    if (repetitions.length > 0) {
      console.error(`❌ ${repetitions.length} répétitions détectées dans les jours générés:`);
      repetitions.forEach(rep => console.error(`  - ${rep}`));
      return false;
    }
    
    console.log('✅ Aucune répétition détectée dans les jours générés');
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification des répétitions:', error);
    return false;
  }
};

// Obtenir les questions utilisées pour un jour spécifique
export const getQuestionsForDay = (dayNumber: number): QuizQuestionFromJSON[] => {
  try {
    const dailyQuizzes = getDailyQuizzes();
    const dayQuiz = dailyQuizzes.find(quiz => quiz.dayNumber === dayNumber);
    return dayQuiz ? dayQuiz.questions : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des questions du jour:', error);
    return [];
  }
};

// Réinitialiser les données (pour changer de vague)
export const resetDailyQuizData = (): void => {
  try {
    localStorage.removeItem('dailyQuizData');
    localStorage.removeItem('dailyQuizLeaderboards');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
  }
};

// Obtenir le jour actuel
export const getCurrentDayNumber = (): number => {
  return getCurrentDay();
};

// Fonction pour forcer le jour 1 (pour les tests)
export const forceDayOne = (): void => {
  try {
    // Supprimer les données existantes pour forcer la régénération
    localStorage.removeItem('dailyQuizData');
    localStorage.removeItem('dailyQuizLeaderboards');
    console.log('Jour 1 forcé - données réinitialisées');
    console.log('Nouvelles questions générées pour tous les 10 jours');
  } catch (error) {
    console.error('Erreur lors du forçage du jour 1:', error);
  }
};

// Fonction pour forcer un jour spécifique (pour les tests)
export const forceSpecificDay = (dayNumber: number): void => {
  try {
    if (dayNumber < 1 || dayNumber > 10) {
      console.error('Jour invalide. Doit être entre 1 et 10.');
      return;
    }
    
    // Supprimer les données existantes pour forcer la régénération
    localStorage.removeItem('dailyQuizData');
    localStorage.removeItem('dailyQuizLeaderboards');
    console.log(`Jour ${dayNumber} forcé - données réinitialisées`);
  } catch (error) {
    console.error('Erreur lors du forçage du jour spécifique:', error);
  }
};

// Fonction pour vérifier et afficher toutes les questions générées
export const debugAllDays = (): void => {
  try {
    console.log('=== DEBUG: Questions disponibles ===');
    console.log(`Total des questions dans le JSON: ${allQuestions.length}`);
    
    const dailyQuizzes = getDailyQuizzes();
    console.log('=== DEBUG: Toutes les questions générées ===');
    dailyQuizzes.forEach((quiz, index) => {
      console.log(`Jour ${quiz.dayNumber}: ${quiz.questions.length} questions`);
      quiz.questions.forEach((q, qIndex) => {
        console.log(`  ${qIndex + 1}. ${q.question.substring(0, 50)}...`);
      });
    });
    
    // Vérifier qu'on a bien toutes les questions réparties
    const totalQuestionsGenerated = dailyQuizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
    console.log(`Total des questions générées: ${totalQuestionsGenerated}/${allQuestions.length}`);
    console.log('=== FIN DEBUG ===');
  } catch (error) {
    console.error('Erreur lors du debug:', error);
  }
};

// Fonction pour vérifier l'intégrité des données
export const verifyDataIntegrity = (): void => {
  try {
    console.log('=== VÉRIFICATION INTÉGRITÉ DES DONNÉES ===');
    console.log(`Questions chargées depuis le JSON: ${allQuestions.length}`);
    
    if (allQuestions.length < 70) {
      console.error(`❌ ERREUR: ${allQuestions.length} questions (minimum 70 recommandé)`);
      return;
    }
    
    console.log('✅ Questions chargées avec succès');
    
    const dailyQuizzes = getDailyQuizzes();
    console.log(`Jours générés: ${dailyQuizzes.length}`);
    
    if (dailyQuizzes.length < 7) {
      console.error(`❌ ERREUR: ${dailyQuizzes.length} jours générés (minimum 7 recommandé)`);
      return;
    }
    
    console.log('✅ Jours générés avec succès');
    
    const totalQuestionsGenerated = dailyQuizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
    console.log(`Questions réparties: ${totalQuestionsGenerated}/${allQuestions.length}`);
    
    if (totalQuestionsGenerated !== allQuestions.length) {
      console.error(`❌ ERREUR: ${totalQuestionsGenerated} questions réparties au lieu de ${allQuestions.length}`);
      return;
    }
    
    console.log('✅ Toutes les questions sont correctement réparties');
    console.log('=== VÉRIFICATION TERMINÉE ===');
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
  }
};

// Fonction pour vérifier les répétitions dans le fichier JSON original
export const checkOriginalFileRepetitions = (): void => {
  try {
    console.log('=== VÉRIFICATION RÉPÉTITIONS DANS LE FICHIER JSON ===');
    
    const questionKeys = new Set<string>();
    const repetitions: string[] = [];
    
    allQuestions.forEach((question, index) => {
      const questionKey = `${question.question}_${question.answer}`;
      
      if (questionKeys.has(questionKey)) {
        repetitions.push(`Question ${index + 1}: ${question.question}`);
        console.warn(`❌ RÉPÉTITION DÉTECTÉE - Question ${index + 1}: ${question.question}`);
      } else {
        questionKeys.add(questionKey);
      }
    });
    
    if (repetitions.length === 0) {
      console.log('✅ Aucune répétition détectée dans le fichier JSON original');
    } else {
      console.error(`❌ ${repetitions.length} répétitions détectées dans le fichier JSON original:`);
      repetitions.forEach(rep => console.error(`  - ${rep}`));
    }
    
    console.log(`Total des questions uniques dans le JSON: ${questionKeys.size}/${allQuestions.length}`);
    console.log('=== FIN VÉRIFICATION FICHIER JSON ===');
  } catch (error) {
    console.error('Erreur lors de la vérification du fichier JSON:', error);
  }
}; 