import { api } from "@/lib/apiClient";
import {
  CreateQuizQuestionPayload,
  FetchQuizQuestionsResponseData,
} from "@/types";

const fetchQuizQuestions = async (
  competitionId: string
): Promise<FetchQuizQuestionsResponseData | undefined> => {
  const response = await api.get<FetchQuizQuestionsResponseData>(
    `/quiz-question/${competitionId}`
  );
  return response.data.data;
};

const createQuizQuestion = async (
  payload: CreateQuizQuestionPayload
): Promise<FetchQuizQuestionsResponseData | undefined> => {
  const response = await api.post<FetchQuizQuestionsResponseData>(
    "/quiz-question/create",
    payload
  );
  return response.data.data;
};

const deleteQuizQuestion = async (
  questionId: string
): Promise<FetchQuizQuestionsResponseData | undefined> => {
  const response = await api.delete<FetchQuizQuestionsResponseData>(
    `/quiz-question/${questionId}`
  );
  return response.data.data;
};

const quizQuestionService = {
  fetchQuizQuestions,
  createQuizQuestion,
  deleteQuizQuestion,
};

export default quizQuestionService;
