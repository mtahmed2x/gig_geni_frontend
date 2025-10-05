import { baseApi } from "../baseApi";
import {
  CreateCompetitionPayload,
  CreateCompetitionResponseData,
  FetchCompetitionByIdResponseData,
  FetchCompetitionsResponseData,
  JoinCompetitionResponseData,
} from "@/types";

export const competitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompetition: builder.mutation<
      CreateCompetitionResponseData,
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
      transformResponse: (response: { data: CreateCompetitionResponseData }) =>
        response.data,
    }),
    fetchMyCompetitions: builder.query<FetchCompetitionsResponseData, void>({
      query: () => "/competition?user=true",
      providesTags: ["MyCompetitions"],
      transformResponse: (response: { data: FetchCompetitionsResponseData }) =>
        response.data,
    }),
    fetchJoinedCompetitions: builder.query<FetchCompetitionsResponseData, void>(
      {
        query: () => "/competition?participant=true",
        providesTags: ["JoinedCompetitions"],
        transformResponse: (response: {
          data: FetchCompetitionsResponseData;
        }) => response.data,
      }
    ),
    fetchAllCompetitions: builder.query<FetchCompetitionsResponseData, void>({
      query: () => "/competition",
      providesTags: ["Competition"],
      transformResponse: (response: { data: FetchCompetitionsResponseData }) =>
        response.data,
    }),
    fetchCompetitionById: builder.query<
      FetchCompetitionByIdResponseData,
      string
    >({
      query: (id) => `/competition/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Competition", id }],
      transformResponse: (response: {
        data: FetchCompetitionByIdResponseData;
      }) => response.data,
    }),
    joinCompetition: builder.mutation<JoinCompetitionResponseData, string>({
      query: (id) => ({
        url: `/competition/${id}/join`,
        method: "POST",
      }),
      invalidatesTags: ["JoinedCompetitions", "Competition"],
      transformResponse: (response: { data: JoinCompetitionResponseData }) =>
        response.data,
    }),
  }),
});

export const {
  useCreateCompetitionMutation,
  useFetchMyCompetitionsQuery,
  useFetchJoinedCompetitionsQuery,
  useFetchAllCompetitionsQuery,
  useFetchCompetitionByIdQuery,
  useJoinCompetitionMutation,
} = competitionApi;
