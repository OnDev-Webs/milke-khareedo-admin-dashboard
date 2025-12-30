import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {addRole,fetchRoles, fetchRoleById,updateRole,deleteRole,fetchAgentRoles,fetchRelationshipManagers,Role, Agent,} from "./roleApi";

export interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  agents: Agent[];
  managers: Agent[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RoleState = {
  roles: [],
  selectedRole: null,
  agents: [],
  managers: [],
  loading: false,
  error: null,
  success: false,
};

/* ================= SLICE ================= */

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoleState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedRole(state) {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    /* ========== ADD ROLE ========== */
    builder.addCase(addRole.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.loading = false;
      state.roles.unshift(action.payload);
      state.success = true;
    });
    builder.addCase(addRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add role";
    });

    /* ========== FETCH ALL ROLES ========== */
    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
      state.loading = false;
      state.roles = action.payload;
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch roles";
    });

    /* ========== FETCH ROLE BY ID ========== */
    builder.addCase(fetchRoleById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoleById.fulfilled, (state, action: PayloadAction<Role>) => {
      state.loading = false;
      state.selectedRole = action.payload;
    });
    builder.addCase(fetchRoleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch role";
    });

    /* ========== UPDATE ROLE ========== */
    builder.addCase(updateRole.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.loading = false;
      state.success = true;

      const index = state.roles.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
      }

      state.selectedRole = action.payload;
    });
    builder.addCase(updateRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update role";
    });

    /* ========== DELETE ROLE ========== */
    builder.addCase(deleteRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.roles = state.roles.filter((r) => r._id !== action.payload);
    });
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete role";
    });

    /* ========== FETCH AGENT ROLES ========== */
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

    /* ========== FETCH RELATIONSHIP MANAGERS ========== */
    builder.addCase(fetchRelationshipManagers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchRelationshipManagers.fulfilled,
      (state, action: PayloadAction<Agent[]>) => {
        state.loading = false;
        state.managers = action.payload;
      }
    );
    builder.addCase(fetchRelationshipManagers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch relationship managers";
    });
  },
});


export const { clearRoleState, clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;
