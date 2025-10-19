import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { LoginResponse, RefreshTokenPayload } from "@/types";
import { logout, userLoggedIn } from "@/lib/features/auth/authSlice";
import { BASE_URL } from "@/config/constants";
import { RootState } from "../store";

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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
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
      const loginData = refreshResult.data as { data: LoginResponse };
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
    "Home",
    "User",
    "Competition",
    "QuizQuestion",
    "MyCompetitions",
    "JoinedCompetitions",
    "QuizSettings",
  ],
  endpoints: () => ({}),
});
