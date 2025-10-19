import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  RefreshTokenPayload,
  ApiResponse,
} from "@/types";

import { userLoggedIn } from "@/lib/features/auth/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation<
      ApiResponse<LoginResponse>,
      { payload: VerifyOtpPayload; tempToken: string }
    >({
      query: ({ payload, tempToken }) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${tempToken}` },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.data!));
        } catch (error) {
          console.error("OTP Verification failed:", error);
        }
      },
    }),
    login: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.data!));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    refreshToken: builder.mutation<
      ApiResponse<LoginResponse>,
      RefreshTokenPayload
    >({
      query: (payload) => ({
        url: "/auth/refresh",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
} = authApi;
