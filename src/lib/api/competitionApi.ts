import { ApiResponse } from "@/types";
import {
  Competition,
  CreateCompetitionPayload,
  CreateCompetitionResponse,
  GetAllCompetitionResponse,
  GetCompetitionResponse,
} from "../features/competition/types";
import { baseApi } from "./baseApi";

export const competitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompetition: builder.mutation<
      ApiResponse<CreateCompetitionResponse>,
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
      invalidatesTags: ["MyCompetitions"],
    }),
    GetMyCompetitions: builder.query<
      ApiResponse<GetAllCompetitionResponse>,
      void
    >({
      query: () => "/competition?user=true",
      providesTags: ["MyCompetitions"],
    }),

    GetJoinedCompetitions: builder.query<
      ApiResponse<GetAllCompetitionResponse>,
      void
    >({
      query: () => "/competition?participant=true",
      providesTags: ["JoinedCompetitions"],
    }),

    GetAllCompetition: builder.query<
      ApiResponse<GetAllCompetitionResponse>,
      void
    >({
      query: () => "/competition",
      providesTags: ["Competition"],
    }),

    GetCompetition: builder.query<ApiResponse<GetCompetitionResponse>, string>({
      query: (id) => `/competition/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Competition", id }],
    }),

    updateCompetition: builder.mutation<
      ApiResponse<GetCompetitionResponse>,
      Partial<Competition> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/competition/update/${id}`,
        method: "PATCH",
        body,
      }),
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
