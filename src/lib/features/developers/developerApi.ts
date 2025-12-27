import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Developer, DeveloperResponse } from "./developerSlice";
import { DeveloperForm } from "@/schema/developer/devloperSchema";

export const createDeveloper = createAsyncThunk<
  DeveloperResponse,
  FormData,
  { rejectValue: string }
>("developers/createDeveloper", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`admin/create_developer`,payload ,{
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create developer"
    );
  }
});

export const fetchDevelopers = createAsyncThunk<
  DeveloperResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>(
  "developers/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
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
  }
);

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


export const updateDeveloper = createAsyncThunk<
  DeveloperResponse,
  { id: string; payload: FormData },
  { rejectValue: string }
>(
  "developers/updateDeveloper",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `admin/update_developer/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update developer"
      );
    }
  }
);

export const deleteDeveloper = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>(
  "developers/deleteDeveloper",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `admin/delete_developer/${id}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete developer"
      );
    }
  }
);

