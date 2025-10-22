import { ApiResponse } from "@/types";
import { baseApi } from "./baseApi";
import {
  CreateParticipantPayload,
  GetParticipantResponse,
  GetParticipantsResponse,
  Participant,
} from "../features/participant/types";
import { unwrapResponse } from "../utils";

export const participantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParticipant: builder.mutation<
      ApiResponse<GetParticipantsResponse>,
      CreateParticipantPayload
    >({
      query: (payload) => ({
        url: "participant/create",
        method: "POST",
        body: payload,
      }),
    }),

    updateParticipant: builder.mutation<
      GetParticipantResponse,
      Partial<Participant> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/participant/update/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse<GetParticipantResponse>,
      invalidatesTags: ["Participant"],
    }),

    getParticipant: builder.query<GetParticipantResponse, string>({
      query: (competitionId) => ({
        url: "participant",
        params: { competitionId, mine: "true" },
      }),
      transformResponse: unwrapResponse<GetParticipantResponse>,
      providesTags: ["Participant"],
    }),

    getParticipants: builder.query<GetParticipantsResponse, string>({
      query: (competitionId) => ({
        url: "participant",
        params: { competitionId },
      }),
      transformResponse: unwrapResponse<GetParticipantsResponse>,
    }),
  }),
});

export const {
  useCreateParticipantMutation,
  useUpdateParticipantMutation,
  useGetParticipantQuery,
  useGetParticipantsQuery,
} = participantApi;
