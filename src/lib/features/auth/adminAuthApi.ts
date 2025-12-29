import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Permissions } from "./adminAuthSlice";


export type Role = {
  id: string;
  name: string;
  permissions: Permissions;
};
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export const adminLogin = createAsyncThunk<
  AdminUser,
  { email: string, password: string }
>(
  "auth/adminLogin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      const apiData = response?.data?.data;

      // Handle both nested {user: {...}, token: '...'} and flat structures
      if (apiData?.user && apiData?.token) {
        // Nested structure: {user: {...}, token: '...'}
        return {
          id: apiData.user.id || apiData.user._id || "",
          name: apiData.user.name || "",
          email: apiData.user.email || "",
          role: apiData.user.role || { id: "", name: "", permissions: {} as Permissions },
          token: apiData.token,
        };
      }

      // Flat structure: {id, name, email, role, token}
      if (apiData?.id && apiData?.token) {
        return {
          id: apiData.id,
          name: apiData.name || "",
          email: apiData.email || "",
          role: apiData.role || { id: "", name: "", permissions: {} as Permissions },
          token: apiData.token,
        };
      }

      // If structure doesn't match, throw error
      throw new Error("Invalid API response structure");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

