// src/store/slices/quizQuestionSlice.ts (RENAMED FILE)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// --- FIX: Import the correctly named service ---
import quizQuestionService from "../services/quizQuestionService";
import {
  QuizQuestion,
  CreateQuizQuestionPayload,
  GenerateQuizQuestionsPayload,
} from "@/types";
import type { RootState } from "..";

interface QuizState {
  questions: QuizQuestion[];
  isLoading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  questions: [],
  isLoading: false,
  error: null,
};

// --- Thunks are correct but rely on the service name ---
export const createQuizQuestion = createAsyncThunk(
  "quizQuestion/create", // Using the slice name for convention
  async (payload: CreateQuizQuestionPayload, { rejectWithValue }) => {
    try {
      // This will now work
      return await quizQuestionService.createQuizQuestion(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add question");
    }
  }
);

export const fetchQuizQuestions = createAsyncThunk(
  "quizQuestion/fetchAll", // Using the slice name for convention
  async (competitionId: string, { rejectWithValue }) => {
    try {
      // This will now work
      return await quizQuestionService.fetchQuizQuestions(competitionId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load questions");
    }
  }
);

export const generateQuizQuestions = createAsyncThunk(
  "quizQuestion/generate",
  async (payload: GenerateQuizQuestionsPayload, { rejectWithValue }) => {
    try {
      return await quizQuestionService.generateQuizQuestions(payload);
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to generate AI questions"
      );
    }
  }
);

const quizQuestionSlice = createSlice({
  name: "quizQuestion",
  initialState,
  reducers: {
    clearQuizQuestions: (state) => {
      state.questions = [];
    },
    setQuestions: (state, action: PayloadAction<QuizQuestion[]>) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuizQuestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createQuizQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload || [];
      })
      .addCase(createQuizQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload || [];
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(generateQuizQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateQuizQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        // The API returns the full list, so we replace our state with it
        state.questions = action.payload || [];
      })
      .addCase(generateQuizQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearQuizQuestions } = quizQuestionSlice.actions;

export const selectQuizQuestions = (state: RootState) =>
  state.quizQuestion.questions;
export const selectQuizIsLoading = (state: RootState) =>
  state.quizQuestion.isLoading;

export default quizQuestionSlice.reducer;
