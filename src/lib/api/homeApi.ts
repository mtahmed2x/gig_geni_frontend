import { ApiResponse, HomeResponse } from "@/types";
import { baseApi } from "./baseApi";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchHomeData: builder.query<ApiResponse<HomeResponse>, void>({
      query: () => "/home",
      providesTags: ["Home"],
    }),
  }),
});

export const { useFetchHomeDataQuery } = homeApi;
