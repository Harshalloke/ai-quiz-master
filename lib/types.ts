export interface Quiz {
  id?: string;
  user_id?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  score?: number;
  completed_at?: string;
  created_at?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  userAnswer?: string;
}

export interface QuizSetup {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface QuizResult {
  score: number;
  total: number;
  questions: QuizQuestion[];
  timeTaken?: number;
}
