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
import { unwrapResponse } from "../utils";

export const quizQuestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuizQuestion: builder.mutation<
      GetAllQuizQuestionResponse,
      CreateQuizQuestionPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/create",
        method: "POST",
        body: payload,
      }),
      transformResponse: unwrapResponse<GetAllQuizQuestionResponse>,
      invalidatesTags: ["QuizQuestion"],
    }),

    addMultipleQuizQuestions: builder.mutation<
      GetAllQuizQuestionResponse,
      { competitionId: string; questions: Partial<QuizQuestion>[] }
    >({
      query: (payload) => ({
        url: `/quiz-question/create-multiple`,
        method: "POST",
        body: payload,
      }),
      transformResponse: unwrapResponse<GetAllQuizQuestionResponse>,
      invalidatesTags: ["QuizQuestion"],
    }),

    getAllQuizQuestion: builder.query<GetAllQuizQuestionResponse, string>({
      query: (competitionId) => `/quiz-question?competition=${competitionId}`,
      transformResponse: unwrapResponse<GetAllQuizQuestionResponse>,
      providesTags: ["QuizQuestion"],
    }),

    getQuizQuestion: builder.query<GetQuizQuestionResponse, string>({
      query: (id) => `/quiz-question/${id}`,
      transformResponse: unwrapResponse<GetQuizQuestionResponse>,
    }),

    updateQuizQuestion: builder.mutation<
      GetQuizQuestionResponse,
      Partial<QuizQuestion> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/quiz-question/update/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse<GetQuizQuestionResponse>,
    }),

    generateQuizQuestions: builder.mutation<
      GetAllQuizQuestionResponse,
      GenerateQuizQuestionsPayload
    >({
      query: (payload) => ({
        url: "/quiz-question/generate",
        method: "POST",
        body: payload,
      }),
      transformResponse: unwrapResponse<GetAllQuizQuestionResponse>,
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
