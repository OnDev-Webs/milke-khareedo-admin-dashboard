// src/lib/features/roles/roleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAgentRoles, fetchRelationshipManagers, Agent } from "./roleApi";

export interface RoleState {
  agents: Agent[];
  managers: Agent[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  agents: [],
  managers: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoles(state) {
      state.agents = [];
      state.managers = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Agent Roles
    builder.addCase(fetchAgentRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAgentRoles.fulfilled, (state, action: PayloadAction<Agent[]>) => {
      state.loading = false;
      state.agents = action.payload;
    });
    builder.addCase(fetchAgentRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch agent roles";
    });

    // Fetch Relationship Managers
    builder.addCase(fetchRelationshipManagers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRelationshipManagers.fulfilled, (state, action: PayloadAction<Agent[]>) => {
      state.loading = false;
      state.managers = action.payload;
    });
    builder.addCase(fetchRelationshipManagers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch relationship managers";
    });
  },
});

export const { clearRoles } = roleSlice.actions;
export default roleSlice.reducer;
