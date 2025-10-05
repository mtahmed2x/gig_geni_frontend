import { baseApi } from "../baseApi";
import {
  QuizAnswer,
  SubmitAnswerPayload,
  EvaluateQuizPayload,
  EvaluateQuizResponse,
} from "@/types";

export const quizAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAnswer: builder.mutation<QuizAnswer, SubmitAnswerPayload>({
      query: (payload) => ({
        url: "/quizAnswer/create",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { data: QuizAnswer }) => response.data,
    }),

    evaluateQuiz: builder.mutation<EvaluateQuizResponse, EvaluateQuizPayload>({
      query: (payload) => ({
        url: "/quizAnswer/evaluate",
        method: "POST",
        body: payload,
      }),
      // The response contains the final score and pass/fail message.
      transformResponse: (response: { data: EvaluateQuizResponse }) =>
        response.data,
      invalidatesTags: (result, error, { competitionId }) => [
        { type: "Competition", id: competitionId },
      ],
    }),
  }),
});

export const { useSubmitAnswerMutation, useEvaluateQuizMutation } =
  quizAnswerApi;
