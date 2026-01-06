import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createDeveloper, deleteDeveloper, fetchDeveloperById, fetchDevelopers } from "./developerApi";


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
  developers: Developer[];
  selected: Developer | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: DeveloperState = {
  developers: [],
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

      .addCase(createDeveloper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeveloper.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createDeveloper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchDevelopers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.loading = false;
        const { data, page, limit, total } = action.payload;
        if (page === 1) {
          state.developers = data;           
        } else {
          state.developers = [...state.developers, ...data]; 
        }
        state.page = page;
        state.limit = limit;
        state.total = total;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })


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

    builder
      .addCase(deleteDeveloper.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDeveloper.fulfilled, (state, action) => {
        state.loading = false;
        state.developers = state.developers.filter(
          (dev) => dev._id !== action.meta.arg
        );
      })
      .addCase(deleteDeveloper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });

  },
});

export const { clearSelectedDeveloper } = developerSlice.actions;
export default developerSlice.reducer;
