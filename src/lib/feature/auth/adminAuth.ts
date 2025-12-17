import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminLogin } from "./adminAuthApi";
type Role = {
  id: string;
  name: string;
};

type PermissionsOpetions = {
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  export: boolean;
};

type Permissions = {
  property: PermissionsOpetions;
  developer: PermissionsOpetions;
  crm: PermissionsOpetions;
  team: PermissionsOpetions;
};

export interface IAdmin {
  id?: string;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  name: string;
  email: string;
  token: string;
  profileImage?: string;
  phone?: string;
  role?: Role;
  permissions: Permissions;
}

const initialState: IAdmin = {
  id: "",
  isLoading: false,
  isLoggedIn: false,
  error: "",
  name: "",
  email: "",
  profileImage: "",
  phone: "",
  token: "",
  role: {
    id: "",
    name: "",
  },
  permissions: {
    property: {
      add: false,
      view: false,
      edit: false,
      delete: false,
      export: false,
    },
    crm: {
      add: false,
      view: false,
      edit: false,
      delete: false,
      export: false,
    },
    developer: {
      add: false,
      view: false,
      edit: false,
      delete: false,
      export: false,
    },
    team: {
      add: false,
      view: false,
      edit: false,
      delete: false,
      export: false,
    },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<IAdmin>) => {
        // state.id = action.paylaod;
      });
  },
});
