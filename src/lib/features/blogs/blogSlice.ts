import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./blogApi";

export interface Blog {
  _id: string;
  title: string;
  author: string;
  authorName?: string;
  tags: string[];
  bannerImage?: string;
  galleryImages?: string[];
  content: string;
  category?: {
    id: string;
    name: string;
    isActive?: boolean;
  };
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: Blog[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlogDetailsResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  loadingDetails: false,
  error: null,
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 0,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog(state) {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload?.data || [];
        state.page = action.payload?.pagination?.page || 1;
        state.limit = action.payload?.pagination?.limit || 15;
        state.total = action.payload?.pagination?.total || 0;
        state.totalPages = action.payload?.pagination?.totalPages || 0;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.loadingDetails = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedBlog = action.payload?.data || null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload || "Failed to fetch blog details";
      })
      .addCase(createBlog.fulfilled, (state) => {
        // Blog created successfully
      })
      .addCase(updateBlog.fulfilled, (state) => {
        // Blog updated successfully
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        // Blog deleted successfully
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;

