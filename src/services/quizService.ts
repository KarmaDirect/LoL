export interface QuizScore {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  timeSpent: number; // en secondes
  difficulty: string;
}

export interface QuizLeaderboard {
  quizId: string;
  quizName: string;
  scores: QuizScore[];
  createdAt: string;
}

// Générer un ID unique pour chaque quiz
export const generateQuizId = (): string => {
  const today = new Date().toISOString().split('T')[0];
  return `quiz_${today}`;
};

// Sauvegarder un score
export const saveQuizScore = (score: QuizScore): void => {
  try {
    const quizId = generateQuizId();
    const existingData = localStorage.getItem('quizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    let currentLeaderboard = leaderboards.find(lb => lb.quizId === quizId);
    
    if (!currentLeaderboard) {
      currentLeaderboard = {
        quizId,
        quizName: `Quiz LoL - ${new Date().toLocaleDateString('fr-FR')}`,
        scores: [],
        createdAt: new Date().toISOString()
      };
      leaderboards.push(currentLeaderboard);
    }
    
    // Ajouter le nouveau score
    currentLeaderboard.scores.push({
      ...score,
      id: `${quizId}_${Date.now()}`,
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
    
    localStorage.setItem('quizLeaderboards', JSON.stringify(leaderboards));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
  }
};

// Récupérer le leaderboard actuel
export const getCurrentQuizLeaderboard = (): QuizLeaderboard | null => {
  try {
    const quizId = generateQuizId();
    const existingData = localStorage.getItem('quizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    return leaderboards.find(lb => lb.quizId === quizId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return null;
  }
};

// Récupérer tous les leaderboards
export const getAllQuizLeaderboards = (): QuizLeaderboard[] => {
  try {
    const existingData = localStorage.getItem('quizLeaderboards');
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des leaderboards:', error);
    return [];
  }
};

// Vérifier si un joueur a déjà participé aujourd'hui
export const hasPlayerPlayedToday = (playerName: string): boolean => {
  try {
    const quizId = generateQuizId();
    const existingData = localStorage.getItem('quizLeaderboards');
    const leaderboards: QuizLeaderboard[] = existingData ? JSON.parse(existingData) : [];
    
    const currentLeaderboard = leaderboards.find(lb => lb.quizId === quizId);
    if (!currentLeaderboard) return false;
    
    return currentLeaderboard.scores.some(score => score.playerName === playerName);
  } catch (error) {
    console.error('Erreur lors de la vérification du joueur:', error);
    return false;
  }
};

// Obtenir le meilleur score d'un joueur
export const getPlayerBestScore = (playerName: string): QuizScore | null => {
  try {
    const allLeaderboards = getAllQuizLeaderboards();
    let bestScore: QuizScore | null = null;
    
    allLeaderboards.forEach(leaderboard => {
      const playerScore = leaderboard.scores.find(score => score.playerName === playerName);
      if (playerScore && (!bestScore || playerScore.score > bestScore.score)) {
        bestScore = playerScore;
      }
    });
    
    return bestScore;
  } catch (error) {
    console.error('Erreur lors de la récupération du meilleur score:', error);
    return null;
  }
};

// Obtenir les statistiques globales
export const getQuizStats = () => {
  try {
    const allLeaderboards = getAllQuizLeaderboards();
    const allScores = allLeaderboards.flatMap(lb => lb.scores);
    
    if (allScores.length === 0) {
      return {
        totalParticipants: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuizzes: 0
      };
    }
    
    const totalParticipants = new Set(allScores.map(s => s.playerName)).size;
    const averageScore = allScores.reduce((sum, score) => sum + score.score, 0) / allScores.length;
    const bestScore = Math.max(...allScores.map(s => s.score));
    const totalQuizzes = allLeaderboards.length;
    
    return {
      totalParticipants,
      averageScore: Math.round(averageScore * 100) / 100,
      bestScore,
      totalQuizzes
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    return {
      totalParticipants: 0,
      averageScore: 0,
      bestScore: 0,
      totalQuizzes: 0
    };
  }
};

// Supprimer tous les leaderboards (fonction de nettoyage)
export const clearAllQuizData = (): void => {
  try {
    localStorage.removeItem('quizLeaderboards');
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
  }
}; 