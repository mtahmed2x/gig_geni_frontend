import { baseApi } from "../baseApi";
import { QuizSettings, QuizSettingsPayload } from "@/types";

export const quizSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizSettings: builder.query<QuizSettings, string>({
      query: (competitionId) => `/quizSettings?competitionId=${competitionId}`,
      providesTags: (result, error, competitionId) => [
        { type: "QuizSettings", id: competitionId },
      ],
      transformResponse: (response: { data: QuizSettings }) => response.data,
    }),

    // RENAME: This is now explicitly for creating new settings
    createQuizSettings: builder.mutation<QuizSettings, QuizSettingsPayload>({
      query: (payload) => ({
        url: "/quizSettings/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { competitionId }) => [
        { type: "QuizSettings", id: competitionId },
      ],
      transformResponse: (response: { data: QuizSettings }) => response.data,
    }),

    // --- NEW MUTATION for updating existing settings ---
    updateQuizSettings: builder.mutation<
      QuizSettings,
      { id: string; payload: QuizSettingsPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/quizSettings/update/${id}`, // Uses the dynamic ID
        method: "PATCH", // PATCH is standard for partial updates
        body: payload,
      }),
      // Also invalidates the tag to trigger a refetch
      invalidatesTags: (result, error, { payload }) => [
        { type: "QuizSettings", id: payload.competitionId },
      ],
      transformResponse: (response: { data: QuizSettings }) => response.data,
    }),
  }),
});

export const {
  useGetQuizSettingsQuery,
  useCreateQuizSettingsMutation, // <-- Renamed hook
  useUpdateQuizSettingsMutation, // <-- Export the new hook
} = quizSettingsApi;
