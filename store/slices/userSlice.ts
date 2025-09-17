// src/store/slices/userSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";
import { User, UpdateUserProfilePayload } from "@/types";
import { logout, updateUser as updateAuthUser } from "./authSlice"; // Import actions from authSlice

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUserProfile();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload: UpdateUserProfilePayload, { dispatch, rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUserProfile(payload);
      // Also update the user object in the auth slice for consistency
      if (updatedUser) {
        dispatch(updateAuthUser(updatedUser));
      }
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload || null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Cases for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload || null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // When the user logs out, clear the profile state
      .addCase(logout, (state) => {
        state.profile = null;
      });
  },
});

// Selectors
export const selectUserProfile = (state: { user: UserState }) =>
  state.user.profile;
export const selectUserIsLoading = (state: { user: UserState }) =>
  state.user.isLoading;

export default userSlice.reducer;
