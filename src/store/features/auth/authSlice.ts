import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, LoginResponseData } from "@/types";
// --- REMOVED: No longer need to import authApi ---
// import { authApi } from "@/store/api/authApi";
import type { RootState } from "@/store/store"; // <-- Use 'import type' for robustness

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<LoginResponseData>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  // --- REMOVED: The extraReducers are no longer needed ---
  // The logic has been moved to onQueryStarted in authApi.ts
  extraReducers: (builder) => {},
});

export const { userLoggedIn, logout, updateUser } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;
