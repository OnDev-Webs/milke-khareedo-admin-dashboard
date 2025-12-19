import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Developer, DeveloperResponse } from "./developerSlice";

export const fetchDevelopers = createAsyncThunk<
  DeveloperResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>("developers/fetchAll", async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `admin/get_all_developer?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch developers"
    );
  }
});

export const fetchDeveloperById = createAsyncThunk<
  Developer,
  string,
  { rejectValue: string }
>("developers/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/developers/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch developer"
    );
  }
});
