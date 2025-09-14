import { api } from "@/lib/apiClient";
import {
  CreateQuizQuestionPayload,
  GenerateQuizQuestionsPayload,
  QuizQuestion,
} from "@/types";

const createQuizQuestion = async (
  payload: CreateQuizQuestionPayload
): Promise<QuizQuestion[] | undefined> => {
  const response = await api.post<QuizQuestion[]>(
    "/quiz-question/create",
    payload
  );
  return response.data.data;
};

const fetchQuizQuestions = async (
  competitionId: string
): Promise<QuizQuestion[] | undefined> => {
  const response = await api.get<QuizQuestion[]>(
    `/quiz-question?competition=${competitionId}`
  );
  return response.data.data;
};

const generateQuizQuestions = async (
  payload: GenerateQuizQuestionsPayload
): Promise<QuizQuestion[] | undefined> => {
  const response = await api.post<QuizQuestion[]>(
    "/quiz-question/generate",
    payload
  );
  return response.data.data;
};

const quizService = {
  createQuizQuestion,
  fetchQuizQuestions,
  generateQuizQuestions,
};

export default quizService;
