import { ApiResponse } from "@/types";
import { baseApi } from "./baseApi";
import {
  GetUserResponse,
  UpdateUserProfilePayload,
} from "../features/user/types";
import { unwrapResponse } from "../utils";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<ApiResponse<GetUserResponse>, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateAvatar: builder.mutation<
      GetUserResponse,
      { payload: {}; avatar: File }
    >({
      query: ({ payload, avatar }) => {
        const formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("data", JSON.stringify(payload));
        return {
          url: "/user/update",
          method: "PATCH",
          body: formData,
        };
      },
      transformResponse: unwrapResponse<GetUserResponse>,
      invalidatesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<
      GetUserResponse,
      UpdateUserProfilePayload
    >({
      query: (payload) => ({
        url: "/user/update",
        method: "PATCH",
        body: payload,
      }),
      transformResponse: unwrapResponse<GetUserResponse>,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateAvatarMutation,
  useUpdateUserProfileMutation,
} = userApi;
