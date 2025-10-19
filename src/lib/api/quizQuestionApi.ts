import {
  ApiResponse,
  CreateQuizQuestionPayload,
  GenerateQuizQuestionsPayload,
  QuizQuestion,
} from "@/types";
import { baseApi } from "./baseApi";
import {
  GetAllQuizQuestionResponse,
  GetQuizQuestionResponse,
} from "../features/quizQuestion/types";

export const quizQuestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuizQuestion: builder.mutation<
      ApiResponse<GetAllQuizQuestionResponse>,
      CreateQuizQuestionPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["QuizQuestion"],
    }),

    addMultipleQuizQuestions: builder.mutation<
      ApiResponse<GetAllQuizQuestionResponse>,
      { competitionId: string; questions: Partial<QuizQuestion>[] }
    >({
      query: (payload) => ({
        url: `/quiz-question/create-multiple`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["QuizQuestion"],
    }),

    getAllQuizQuestion: builder.query<
      ApiResponse<GetAllQuizQuestionResponse>,
      string
    >({
      query: (competitionId) => `/quiz-question?competition=${competitionId}`,
      providesTags: ["QuizQuestion"],
    }),

    getQuizQuestion: builder.query<
      ApiResponse<GetQuizQuestionResponse>,
      string
    >({
      query: (id) => `/quiz-question/${id}`,
    }),

    updateQuizQuestion: builder.mutation<
      ApiResponse<GetQuizQuestionResponse>,
      Partial<QuizQuestion> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/quiz-question/update/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    generateQuizQuestions: builder.mutation<
      ApiResponse<GetAllQuizQuestionResponse>,
      GenerateQuizQuestionsPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/generate",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateQuizQuestionMutation,
  useAddMultipleQuizQuestionsMutation,
  useGetAllQuizQuestionQuery,
  useGetQuizQuestionQuery,
  useUpdateQuizQuestionMutation,
  useGenerateQuizQuestionsMutation,
} = quizQuestionApi;
