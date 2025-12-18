import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardState } from "./dashboardSlice";

type DashboardResponse = Omit<DashboardState, "loading" | "error">;

export const fetchDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/admin_dashboard");
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);
