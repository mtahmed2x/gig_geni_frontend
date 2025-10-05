import { baseApi } from "../baseApi";
import { UpdateUserProfilePayload, UserProfileResponseData } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponseData, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
      transformResponse: (response: { data: UserProfileResponseData }) =>
        response.data,
    }),
    updateUserProfile: builder.mutation<
      UserProfileResponseData,
      UpdateUserProfilePayload
    >({
      query: (payload) => ({
        url: "/user/update",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: { data: UserProfileResponseData }) =>
        response.data,
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
