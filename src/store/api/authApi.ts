import {
  RegisterPayload,
  RegisterResponseData,
  LoginPayload,
  LoginResponseData,
  VerifyOtpPayload,
  RefreshTokenPayload,
} from "@/types";
import { baseApi } from "../baseApi";
import { userLoggedIn } from "@/store/features/auth/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponseData, RegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: { data: RegisterResponseData }) =>
        response.data,
    }),
    verifyOtp: builder.mutation<
      LoginResponseData,
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
          dispatch(userLoggedIn(data));
        } catch (error) {
          console.error("OTP Verification failed:", error);
        }
      },
      transformResponse: (response: { data: LoginResponseData }) =>
        response.data,
    }),
    login: builder.mutation<LoginResponseData, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      transformResponse: (response: { data: LoginResponseData }) =>
        response.data,
    }),
    refreshToken: builder.mutation<LoginResponseData, RefreshTokenPayload>({
      query: (payload) => ({
        url: "/auth/refresh",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: { data: LoginResponseData }) =>
        response.data,
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
} = authApi;
