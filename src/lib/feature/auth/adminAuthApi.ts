import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const adminLogin = createAsyncThunk<
  { email: string; role: string },
  { email: string; role: string }
>(
  "auth/adminLogin",
  async (
    { email, role }: { email: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      await axiosInstance.post("/admin/admin_login", {
        email,
        role,
      });
      return { email, role };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP send failed"
      );
    }
  }
);

