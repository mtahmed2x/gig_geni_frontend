import { baseApi } from "../baseApi";
import {
  CreateQuizQuestionPayload,
  GenerateQuizQuestionsPayload,
  QuizQuestion,
} from "@/types";

export const quizQuestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuizQuestion: builder.mutation<
      QuizQuestion[],
      CreateQuizQuestionPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["QuizQuestion"],
      transformResponse: (response: { data: QuizQuestion[] }) => response.data,
    }),

    addMultipleQuizQuestions: builder.mutation<
      QuizQuestion[],
      { competitionId: string; questions: Partial<QuizQuestion>[] }
    >({
      query: (payload) => ({
        url: `/quiz-question/create-multiple`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["QuizQuestion"],
      transformResponse: (response: { data: QuizQuestion[] }) => response.data,
    }),

    fetchQuizQuestions: builder.query<QuizQuestion[], string>({
      query: (competitionId) => `/quiz-question?competition=${competitionId}`,
      providesTags: ["QuizQuestion"],
      transformResponse: (response: { data: QuizQuestion[] }) => response.data,
    }),

    generateQuizQuestions: builder.mutation<
      QuizQuestion[],
      GenerateQuizQuestionsPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/generate",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { data: QuizQuestion[] }) => response.data,
    }),
  }),
});

export const {
  useCreateQuizQuestionMutation,
  useAddMultipleQuizQuestionsMutation,
  useFetchQuizQuestionsQuery,
  useGenerateQuizQuestionsMutation,
} = quizQuestionApi;
