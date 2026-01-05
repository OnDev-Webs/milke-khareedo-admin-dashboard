import { createAsyncThunk } from "@reduxjs/toolkit";
import { Property } from "./propertiesSlice";
import axiosInstance from "@/utils/axiosInstance";

export const createProperty = createAsyncThunk<
  Property,
  FormData,
  { rejectValue: string }
>("properties/createProperty", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/admin/create_property", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch properties"
    );
  }
});

// export const fetchProperties = createAsyncThunk<
//   Property[],
//   void,
//   { rejectValue: string }
// >("properties/fetchAll", async (_, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.get("/admin/get_all_property");
//     return res.data.data;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Failed to fetch properties"
//     );
//   }
// });


export const fetchProperties = createAsyncThunk<
  {
    data: Property[];
    total: number;
    page: number;
    totalPages: number;
  },
  { page?: number; limit?: number; search?: string },
  { rejectValue: string }
>("properties/fetchAll", async ({ page = 1, limit = 12, search }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/admin/get_all_property", {
      params: { page, limit, search },
    });

    return {
      data: res.data.data,
      total: res.data.total,
      page: res.data.page,
      totalPages: res.data.totalPages,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch properties"
    );
  }
});

export const fetchPropertyById = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("properties/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`admin/get_all_property_by_id/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch property"
    );
  }
});

export const deletePropertyById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("properties/deletePropertyById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`admin/delete_property/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch property"
    );
  }
});


export const updateProperty = createAsyncThunk<
  Property,
  { id: string; payload: FormData },
  { rejectValue: string }
>(
  "properties/updateProperty",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update_property/${id}`,
        payload
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update property"
      );
    }
  }
);

