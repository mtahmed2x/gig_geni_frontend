import { ApiResponse } from "@/types";
import { baseApi } from "./baseApi";
import {
  CreateParticipantPayload,
  GetParticipantsResponse,
} from "../features/participant/types";

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

    getParticipants: builder.query<
      ApiResponse<GetParticipantsResponse>,
      string
    >({
      query: (competitionId) => ({
        url: "participant",
        params: { competitionId },
      }),
    }),
  }),
});

export const { useCreateParticipantMutation, useGetParticipantsQuery } =
  participantApi;
