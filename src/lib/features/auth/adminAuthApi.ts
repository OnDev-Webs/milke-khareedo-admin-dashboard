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
  profileImage?: string | null;
}

export type AdminProfile = {
  countryCode?: string;
  isPhoneVerified?: boolean;
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  city?: string;
  country?: string;
  phoneNumber?: string;
  pincode?: string;
  state?: string;
  profileImage?: string | null;
  firstName?: string;
  lastName?: string;
};

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
          profileImage: apiData.user.profileImage || null,
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
          profileImage: apiData.profileImage || null,
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

export const getAdminProfile = createAsyncThunk<
  AdminProfile,
  void,
  { rejectValue: string }
>(
  "auth/getAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/get_admin_profile");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch admin profile");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin profile"
      );
    }
  }
);

export const updateAdminProfile = createAsyncThunk<
  AdminProfile,
  { firstname?: string; profileImage?: File },
  { rejectValue: string }
>(
  "auth/updateAdminProfile",
  async ({ firstname, profileImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (firstname) {
        formData.append("firstname", firstname);
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // For FormData, axios will automatically set Content-Type with boundary
      // The interceptor will skip setting Content-Type for FormData
      const response = await axiosInstance.put("/admin/update_admin_profile", formData);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update admin profile");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin profile"
      );
    }
  }
);

