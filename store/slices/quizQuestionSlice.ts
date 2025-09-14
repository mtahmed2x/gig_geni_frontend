import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

export const createQuizQuestion = createAsyncThunk(
  "quizQuestion/create",
  async (payload: CreateQuizQuestionPayload, { rejectWithValue }) => {
    try {
      return await quizQuestionService.createQuizQuestion(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add question");
    }
  }
);

export const fetchQuizQuestions = createAsyncThunk(
  "quizQuestion/fetchAll",
  async (competitionId: string, { rejectWithValue }) => {
    try {
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
      return rejectWithValue(error.message || "Failed to generate AI questions");
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
  // --- Using the explicit `addCase` pattern for 100% type safety ---
  extraReducers: (builder) => {
    builder
      // --- Cases for createQuizQuestion ---
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

      // --- Cases for fetchQuizQuestions ---
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

      // --- Cases for generateQuizQuestions ---
      .addCase(generateQuizQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateQuizQuestions.fulfilled, (state) => {
        // This case is intentionally different for the preview feature.
        // It only stops the loading state. The component will handle the payload.
        state.isLoading = false;
      })
      .addCase(generateQuizQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// --- FIX: Export all synchronous actions created in the `reducers` object ---
export const { clearQuizQuestions, setQuestions } = quizQuestionSlice.actions;

// --- Selectors (These are correct) ---
export const selectQuizQuestions = (state: RootState) => state.quizQuestion.questions;
export const selectQuizIsLoading = (state: RootState) => state.quizQuestion.isLoading;

export default quizQuestionSlice.reducer;