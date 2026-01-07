// src/lib/features/users/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  User,
  toggleUserStatus,
} from "./userApi";

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== CREATE USER ===== */
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create user failed";
      })

      /* ===== FETCH USERS ===== */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch users failed";
      })

      /* ===== FETCH USER BY ID ===== */
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch user failed";
      })

      /* ===== UPDATE USER ===== */
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;

        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update user failed";
      })

      /* ===== DELETE USER ===== */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      })

      /* ===== TOGGLE USER STATUS ===== */
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
      })
      /* ===== TOGGLE USER STATUS ===== */
      /* ===== TOGGLE USER STATUS ===== */
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;

        // 🔥 IMPORTANT: id vs _id mapping
        const index = state.users.findIndex(
          (u) => u._id === updatedUser.id
        );

        if (index !== -1) {
          // 🔥 DIRECT mutation (RTK handles immutability)
          state.users[index].isActive = updatedUser.isActive;
        }

        // 🔥 selectedUser bhi update karo
        if (state.selectedUser && state.selectedUser._id === updatedUser.id) {
          state.selectedUser.isActive = updatedUser.isActive;
        }
      })

      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Toggle user status failed";
      });

  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
