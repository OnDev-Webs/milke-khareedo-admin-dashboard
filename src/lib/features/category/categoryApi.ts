import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export interface Category {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// GET categories
export const fetchCategories = createAsyncThunk<
  CategoryResponse,
  { page?: number; limit?: number; search?: string; isActive?: boolean },
  { rejectValue: string }
>("categories/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("admin/categories", { params });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
});

// CREATE category
export const createCategory = createAsyncThunk<
  any,
  { name: string; isActive?: boolean },
  { rejectValue: string }
>("categories/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("admin/categories", payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create category"
    );
  }
});

// UPDATE category
export const updateCategory = createAsyncThunk<
  any,
  { id: string; payload: { name?: string; isActive?: boolean } },
  { rejectValue: string }
>("categories/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`admin/categories/${id}`, payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update category"
    );
  }
});
