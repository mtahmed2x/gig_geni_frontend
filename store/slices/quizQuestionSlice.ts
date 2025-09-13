import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import quizQuestionService from "../services/quizQuestionService";
import { QuizQuestion, CreateQuizQuestionPayload } from "@/types";

interface QuizQuestionState {
  questions: QuizQuestion[];
  isLoading: boolean;
  error: string | null;
}

const initialState: QuizQuestionState = {
  questions: [],
  isLoading: false,
  error: null,
};

export const fetchQuizQuestions = createAsyncThunk(
  "quiz/fetchAll",
  async (competitionId: string, { rejectWithValue }) => {
    try {
      return await quizQuestionService.fetchQuizQuestions(competitionId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch questions");
    }
  }
);

export const createQuizQuestion = createAsyncThunk(
  "quiz/create",
  async (payload: CreateQuizQuestionPayload, { rejectWithValue }) => {
    try {
      return await quizQuestionService.createQuizQuestion(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create question");
    }
  }
);

export const deleteQuizQuestion = createAsyncThunk(
  "quiz/delete",
  async (questionId: string, { rejectWithValue }) => {
    try {
      return await quizQuestionService.deleteQuizQuestion(questionId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete question");
    }
  }
);

const quizQuestionSlice = createSlice({
  name: "quizQuestion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("quiz/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("quiz/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.isLoading = false;
          state.questions = action.payload || [];
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("quiz/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const selectQuizQuestions = (state: {
  quizQuestion: QuizQuestionState;
}) => state.quizQuestion.questions;
export const selectQuizIsLoading = (state: {
  quizQuestion: QuizQuestionState;
}) => state.quizQuestion.isLoading;

export default quizQuestionSlice.reducer;
