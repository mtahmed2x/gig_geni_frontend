import { ApiResponse } from "@/types";
import { baseApi } from "./baseApi";
import {
  GetUserResponse,
  UpdateUserProfilePayload,
} from "../features/user/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<ApiResponse<GetUserResponse>, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<
      ApiResponse<GetUserResponse>,
      UpdateUserProfilePayload
    >({
      query: (payload) => ({
        url: "/user/update",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
