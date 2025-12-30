// src/lib/features/users/userApi.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Role } from "../role/roleApi";


export interface User {
  _id: string;
  name?: string; 
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  countryCode?: string;
  profileImage?: string;
  role: Role | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  profileImage?: File;
}

/* ================= CREATE USER ================= */
// POST /admin/create_user
export const createUser = createAsyncThunk<
  User,
  CreateUserPayload,
  { rejectValue: string }
>("users/createUser", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/admin/create_user", payload);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create user"
    );
  }
});

/* ================= GET ALL USERS ================= */
// GET /admin
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/admin");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

/* ================= GET USER BY ID ================= */
// GET /admin/get_user/:id
export const fetchUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchUserById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/admin/get_user/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch user"
    );
  }
});

/* ================= UPDATE USER ================= */
// PUT /admin/update_user/:id
export const updateUser = createAsyncThunk<
  User,
  UpdateUserPayload,
  { rejectValue: string }
>("users/updateUser", async ({ id, profileImage, ...rest }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await axiosInstance.put(
      `/admin/update_user/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

/* ================= DELETE USER ================= */
// DELETE /admin/delete_user/:id
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/admin/delete_user/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});
