import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminLogin, AdminUser, getAdminProfile, updateAdminProfile, AdminProfile } from "./adminAuthApi";

export type Role = {
  id: string;
  name: string;
};

export type PermissionsOpetions = {
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  export: boolean;
};

export type Permissions = {
  property: PermissionsOpetions;
  developer: PermissionsOpetions;
  crm: PermissionsOpetions;
  team: PermissionsOpetions;
};

export interface IAdmin {
  id?: string;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  name: string;
  email: string;
  token: string;
  phone?: string;
  phoneNumber?: string;
  countryCode? : string;
  profileImage?: string | null;
  firstName?: string;
  lastName?: string;
  role?: Role;
  permissions?: Permissions;
  isAuthenticated?:boolean;
  profileLoading?: boolean;
  profileError?: string | null;
}

const initialState: IAdmin = {
  id: "",
  loading: false,
  isAuthenticated:false,
  isLoggedIn: false,
  error: null,
  name: "",
  email: "",
  token: "",
  role: {
    id: "",
    name: "",
  },
  permissions: {
    property: { add: false, view: false, edit: false, delete: false, export: false },
    crm: { add: false, view: false, edit: false, delete: false, export: false },
    developer: { add: false, view: false, edit: false, delete: false, export: false },
    team: { add: false, view: false, edit: false, delete: false, export: false },
  },
  profileLoading: false,
  profileError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => {
      // Clear remember me on logout
      if (typeof window !== "undefined") {
        try {
          // Dynamic import to avoid SSR issues
          const { clearRememberMe } = require("@/utils/rememberMe");
          clearRememberMe();
        } catch (e) {
          // Ignore if rememberMe utils not available
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
      }
      return initialState;
    },
     setAuthFromStorage: (state, action:PayloadAction<{token:string; admin:IAdmin}>) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.isAuthenticated = true;
      // Restore all auth data from storage
      if (action.payload.admin) {
        state.id = action.payload.admin.id || "";
        state.name = action.payload.admin.name || "";
        state.email = action.payload.admin.email || "";
        state.role = action.payload.admin.role || { id: "", name: "" };
        state.profileImage = action.payload.admin.profileImage || null;
        if (action.payload.admin.permissions) {
          state.permissions = action.payload.admin.permissions;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        adminLogin.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.isAuthenticated = true;

          state.id = action.payload.id;
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.token = action.payload.token;
          state.role = action.payload.role;
          state.profileImage = action.payload.profileImage || null;
          
          // Store permissions from role if available
          if (action.payload.role?.permissions) {
            state.permissions = action.payload.role.permissions;
          }
        }
      )

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.error.message || "Login failed";
      })
      // Get Admin Profile
      .addCase(getAdminProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
        state.profileLoading = false;
        state.profileError = null;
        
        // Update profile fields
        state.id = action.payload._id || state.id;
        state.name = action.payload.name || state.name;
        state.email = action.payload.email || state.email;
        state.profileImage = action.payload.profileImage || null;
        state.firstName = action.payload.firstName || "";
        state.lastName = action.payload.lastName || "";
        state.phoneNumber = action.payload.phoneNumber || "";
        state.countryCode = action.payload.countryCode || "";
        state.phone = action.payload.phoneNumber || state.phone;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to fetch profile";
      })
      // Update Admin Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action: PayloadAction<AdminProfile>) => {
        state.profileLoading = false;
        state.profileError = null;
        
        // Update profile fields
        state.id = action.payload._id || state.id;
        state.name = action.payload.name || state.name;
        state.email = action.payload.email || state.email;
        state.profileImage = action.payload.profileImage || null;
        state.firstName = action.payload.firstName || "";
        state.lastName = action.payload.lastName || "";
        state.phoneNumber = action.payload.phoneNumber || "";
        state.phone = action.payload.phoneNumber || state.phone;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to update profile";
      });
  },
});

export const { resetAuth,setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
