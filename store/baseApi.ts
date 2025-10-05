import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponseData, RefreshTokenPayload } from "@/types";
import { BASE_URL } from "@/config/constants";
import { logout, userLoggedIn } from "@/store/features/auth/authSlice";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { token: refreshToken } as RefreshTokenPayload,
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const loginData = refreshResult.data as { data: LoginResponseData };
      api.dispatch(userLoggedIn(loginData.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Competition",
    "QuizQuestion",
    "MyCompetitions",
    "JoinedCompetitions",
    "QuizSettings",
  ],
  endpoints: () => ({}),
});
