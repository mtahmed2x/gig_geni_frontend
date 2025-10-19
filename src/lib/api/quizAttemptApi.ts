// lib/api/quizAnswerApi.ts

import { ApiResponse } from "@/types";
import { baseApi } from "./baseApi";
import {
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from "../features/quizAttempt/types"; // Make sure this path is correct

export const quizAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAnswer: builder.mutation<
      ApiResponse<SubmitAnswerResponse>, // This now correctly expects the { message, attempt } structure
      SubmitAnswerPayload // This now correctly uses the { questionId, answer } structure
    >({
      query: (payload) => ({
        url: "/quizAttempt/submit",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useSubmitAnswerMutation } = quizAnswerApi;
