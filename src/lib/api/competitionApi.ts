import { ApiResponse } from "@/types";
import {
  Competition,
  CreateCompetitionPayload,
  CreateCompetitionResponse,
  GetAllCompetitionResponse,
  GetCompetitionResponse,
} from "../features/competition/types";
import { baseApi } from "./baseApi";
import { unwrapResponse } from "../utils";

export const competitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompetition: builder.mutation<
      CreateCompetitionResponse,
      { payload: CreateCompetitionPayload; bannerImage: File }
    >({
      query: ({ payload, bannerImage }) => {
        const formData = new FormData();
        formData.append("bannerImage", bannerImage);
        formData.append("data", JSON.stringify(payload));
        return {
          url: "/competition/create",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: unwrapResponse<CreateCompetitionResponse>,
      invalidatesTags: ["MyCompetitions"],
    }),
    GetMyCompetitions: builder.query<GetAllCompetitionResponse, void>({
      query: () => "/competition?user=true",
      transformResponse: unwrapResponse<GetAllCompetitionResponse>,
      providesTags: ["MyCompetitions"],
    }),

    GetJoinedCompetitions: builder.query<GetAllCompetitionResponse, void>({
      query: () => "/competition?participant=true",
      transformResponse: unwrapResponse<GetAllCompetitionResponse>,
      providesTags: ["JoinedCompetitions"],
    }),

    GetAllCompetition: builder.query<GetAllCompetitionResponse, void>({
      query: () => "/competition",
      transformResponse: unwrapResponse<GetAllCompetitionResponse>,
      providesTags: ["Competition"],
    }),

    GetCompetition: builder.query<GetCompetitionResponse, string>({
      query: (id) => `/competition/${id}`,
      transformResponse: unwrapResponse<GetCompetitionResponse>,
      providesTags: (_result, _error, id) => [{ type: "Competition", id }],
    }),

    updateCompetition: builder.mutation<
      GetCompetitionResponse,
      Partial<Competition> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/competition/update/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapResponse<GetCompetitionResponse>,
    }),
  }),
});

export const {
  useCreateCompetitionMutation,
  useGetMyCompetitionsQuery,
  useGetJoinedCompetitionsQuery,
  useGetAllCompetitionQuery,
  useGetCompetitionQuery,
  useUpdateCompetitionMutation,
} = competitionApi;
