import { baseApi } from "../baseApi";
import { HomeResponseData } from "@/types";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchHomeData: builder.query<HomeResponseData, void>({
      query: () => "/home",
      providesTags: ["Home"],
      transformResponse: (response: { data: HomeResponseData }) =>
        response.data,
    }),
  }),
});

export const { useFetchHomeDataQuery } = homeApi;
