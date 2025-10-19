// types/quizAttempt.ts

// 1. A dedicated type for the answers you SEND to the API
export interface AnswerPayload {
  questionId: string; // Correctly matches the request JSON
  answer: string | string[] | boolean | null;
}

// 2. The main payload for submitting a quiz
export type SubmitAnswerPayload = {
  competitionId: string;
  answers: AnswerPayload[]; // Uses the new, correct AnswerPayload type
};

// --- Response Types ---

// 3. The answer structure you RECEIVE from the API (includes feedback)
export interface AnswerFeedback {
  question: string; // This is the question ID in the response
  answer: string | string[] | boolean | null;
  isCorrect: boolean;
  pointsAwarded: number;
}

// 4. The QuizAttempt object as returned by the API
export interface QuizAttempt {
  _id: string;
  userId: string;
  competitionId: string;
  answers: AnswerFeedback[]; // Uses the detailed feedback type
  totalScore: number;
  passed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 5. The corrected structure of the 'data' object in the API response
export interface SubmitAnswerResponse {
  message: string; // e.g., "Congratulations! You have passed the quiz."
  attempt: QuizAttempt;
}
