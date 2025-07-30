import { QuizQuestionFromJSON, DailyQuizData, QuizScore, QuizLeaderboard, PlayerStats } from '@/types/quiz';
import quizData from '../../quizz/lol_quiz_vague_1.json';

// Convertir les données JSON en format TypeScript
const allQuestions: QuizQuestionFromJSON[] = quizData as QuizQuestionFromJSON[];

// Générer les 10 jours de questions (10 questions par jour)
const generateDailyQuestions = (): DailyQuizData[] => {
  const dailyQuizzes: DailyQuizData[] = [];
  const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
  
  for (let day = 1; day <= 10; day++) {
    const startIndex = (day - 1) * 10;
    const dayQuestions = shuffledQuestions.slice(startIndex, startIndex + 10);
    
    dailyQuizzes.push({
      dayNumber: day,
      questions: dayQuestions,
      date: new Date().toISOString().split('T')[0] // Date actuelle pour le moment
    });
  }
  
  return dailyQuizzes;
};

// Obtenir le jour actuel (1-10) basé sur la date
const getCurrentDay = (): number => {
  const today = new Date();
  const startDate = new Date('2024-01-01'); // Date de référence
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