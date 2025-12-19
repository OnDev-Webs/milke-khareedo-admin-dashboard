import { createAsyncThunk } from "@reduxjs/toolkit";
import { Property } from "./propertiesSlice";
import axiosInstance from "@/utils/axiosInstance";

export const fetchProperties = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("properties/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/admin/get_all_property");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch properties");
  }
});

export const fetchPropertyById = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("properties/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/properties/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch property");
  }
});
