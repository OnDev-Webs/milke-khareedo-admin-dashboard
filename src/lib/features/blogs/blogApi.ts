import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BlogResponse, BlogDetailsResponse } from "./blogSlice";

export const fetchBlogs = createAsyncThunk<
  BlogResponse,
  { page?: number; limit?: number; search?: string },
  { rejectValue: string }
>(
  "blogs/fetchAll",
  async ({ page = 1, limit = 15, search }, { rejectWithValue }) => {
    try {
      let url = `admin/blogs?page=${page}&limit=${limit}`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk<
  BlogDetailsResponse,
  string,
  { rejectValue: string }
>("blogs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`admin/blog/${id}`);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch blog details"
    );
  }
});

export const createBlog = createAsyncThunk<
  BlogDetailsResponse,
  FormData,
  { rejectValue: string }
>("blogs/createBlog", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`admin/blog`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create blog"
    );
  }
});

export const updateBlog = createAsyncThunk<
  BlogDetailsResponse,
  { id: string; payload: FormData },
  { rejectValue: string }
>(
  "blogs/updateBlog",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/blog/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update blog"
      );
    }
  }
);

export const deleteBlog = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>("blogs/deleteBlog", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`admin/blog/${id}`);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete blog"
    );
  }
});

