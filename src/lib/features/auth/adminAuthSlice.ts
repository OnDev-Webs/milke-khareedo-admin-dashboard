import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminLogin, AdminUser } from "./adminAuthApi";

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
  role?: Role;
  permissions?: Permissions;
  isAuthenticated?:boolean;
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
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => initialState,
     setAuthFromStorage: (state, action:PayloadAction<{token:string; admin:IAdmin}>) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
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

          state.id = action.payload.id;
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.token = action.payload.token;
          state.role = action.payload.role;
        }
      )

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { resetAuth,setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
