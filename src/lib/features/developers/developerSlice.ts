import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDeveloperById, fetchDevelopers } from "./developerApi";


export interface SourcingManager {
  name: string;
  mobile: string;
  email: string;
}

export interface Developer {
  _id: string;
  logo: string;
  developerName: string;
  description: string;
  city: string;
  establishedYear: number;
  totalProjects: number;
  website: string;
  sourcingManager: SourcingManager;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperResponse {
  data: Developer[];
  count: number;
  total: number;
  page: number;
  limit: number;
}


interface DeveloperState {
  list: Developer[];
  selected: Developer | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: DeveloperState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
};

const developerSlice = createSlice({
  name: "developers",
  initialState,
  reducers: {
    clearSelectedDeveloper(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchDevelopers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Fetch by ID
      .addCase(fetchDeveloperById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchDeveloperById.fulfilled,
        (state, action: PayloadAction<Developer>) => {
          state.loading = false;
          state.selected = action.payload;
        }
      )
      .addCase(fetchDeveloperById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSelectedDeveloper } = developerSlice.actions;
export default developerSlice.reducer;
