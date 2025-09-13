import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import competitionService from "../services/competitionService";
import { Competition, CreateCompetitionPayload } from "@/types";

interface CompetitionState {
  myCompetitions: Competition[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CompetitionState = {
  myCompetitions: [],
  isLoading: false,
  error: null,
};

export const createCompetition = createAsyncThunk(
  "competition/create",
  async (
    data: { payload: CreateCompetitionPayload; bannerImage: File },
    { rejectWithValue }
  ) => {
    try {
      return await competitionService.createCompetition(
        data.payload,
        data.bannerImage
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create competition");
    }
  }
);

export const fetchMyCompetitions = createAsyncThunk(
  "competition/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await competitionService.fetchMyCompetitions();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch competitions");
    }
  }
);

const competitionSlice = createSlice({
  name: "competition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompetition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompetition.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.competition) {
          state.myCompetitions.push(action.payload.competition);
        }
      })
      .addCase(createCompetition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myCompetitions = action.payload || [];
      })
      .addCase(fetchMyCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCompetitionIsLoading = (state: {
  competition: CompetitionState;
}) => state.competition.isLoading;
export const selectMyCompetitions = (state: {
  competition: CompetitionState;
}) => state.competition.myCompetitions;

export default competitionSlice.reducer;
