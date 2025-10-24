export enum QuestionType {
  Single = "single",
  Multiple = "multiple",
  TrueFalse = "true_false",
  Short = "short",
  Broad = "broad",
}

export enum QuestionDifficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export interface QuizQuestionOption {
  _id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  _id: string;
  competition: string;
  question: string;
  type: QuestionType;
  options?: QuizQuestionOption[];
  wordLimit?: number;
  points: number;
  difficulty: QuestionDifficulty;
  isMarkdown: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizQuestionPayload {
  competition: string;
  question: string;
  type: QuestionType;
  options?: { text: string; isCorrect?: boolean }[];
  wordLimit?: number;
  points: number;
  difficulty: QuestionDifficulty;
  isMarkdown: boolean;
}

export type GetAllQuizQuestionResponse = QuizQuestion[];
export type GetQuizQuestionResponse = QuizQuestion;

export interface GenerateQuizQuestionPayload {
  competitionId: string;
  category: string;
  description: string;
  totalQuestions: number;
  difficulty: QuestionDifficulty;
  distribution: {
    single: number;
    multiple: number;
    true_false: number;
    short: number;
    broad: number;
  };
  shortWordLimit: number;
  broadWordLimit: number;
  pointsPerQuestion: number;
  isMarkdown: boolean;
}
