import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import competitionService from "../services/competitionService";
import { Competition, CreateCompetitionPayload } from "@/types";

interface CompetitionState {
  allCompetitions: Competition[];
  myCompetitions: Competition[];
  joinedCompetitions: Competition[];
  selectedCompetition: Competition | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompetitionState = {
  allCompetitions: [],
  myCompetitions: [],
  joinedCompetitions: [],
  selectedCompetition: null,
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

export const fetchAllCompetitions = createAsyncThunk(
  "competition/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await competitionService.fetchAllCompetitions();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch competitions");
    }
  }
);

export const fetchCompetitionById = createAsyncThunk(
  "competition/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await competitionService.fetchCompetitionById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch competition details"
      );
    }
  }
);

export const joinCompetition = createAsyncThunk(
  "competition/join",
  async (competitionId: string, { rejectWithValue }) => {
    try {
      return await competitionService.joinCompetition(competitionId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to join competition");
    }
  }
);

export const fetchJoinedCompetitions = createAsyncThunk(
  "competition/fetchJoined",
  async (_, { rejectWithValue }) => {
    try {
      return await competitionService.fetchJoinedCompetitions();
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch joined competitions"
      );
    }
  }
);

const competitionSlice = createSlice({
  name: "competition",
  initialState,
  reducers: {
    clearSelectedCompetition: (state) => {
      state.selectedCompetition = null;
    },
  },
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
      })
      .addCase(fetchCompetitionById.pending, (state) => {
        state.isLoading = true;
        state.selectedCompetition = null;
        state.error = null;
      })
      .addCase(fetchCompetitionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCompetition = action.payload || null;
      })
      .addCase(fetchCompetitionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCompetitions = action.payload || [];
      })
      .addCase(fetchAllCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(joinCompetition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinCompetition.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(joinCompetition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJoinedCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJoinedCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.joinedCompetitions = action.payload || [];
      })
      .addCase(fetchJoinedCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCompetition } = competitionSlice.actions;

export const selectCompetitionIsLoading = (state: {
  competition: CompetitionState;
}) => state.competition.isLoading;
export const selectAllCompetitions = (state: {
  competition: CompetitionState;
}) => state.competition.allCompetitions;
export const selectMyCompetitions = (state: {
  competition: CompetitionState;
}) => state.competition.myCompetitions;
export const selectJoinedCompetitions = (state: {
  competition: CompetitionState;
}) => state.competition.joinedCompetitions; // <-- Add new selector
export const selectSelectedCompetition = (state: {
  competition: CompetitionState;
}) => state.competition.selectedCompetition;

export default competitionSlice.reducer;
