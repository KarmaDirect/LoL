export interface QuizQuestionFromJSON {
  question: string;
  options: string[];
  answer: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: string;
}

export interface DailyQuizData {
  dayNumber: number;
  questions: QuizQuestionFromJSON[];
  date: string;
}

export interface QuizScore {
  id: string;
  playerName: string;
  score: number; // sur 10
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  timeSpent: number;
  dayNumber: number;
}

export interface QuizLeaderboard {
  dayNumber: number;
  date: string;
  scores: QuizScore[];
}

export interface PlayerStats {
  playerName: string;
  bestScore: number;
  totalDaysPlayed: number;
  averageScore: number;
  lastPlayed: string;
} 