import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Permissions } from "./adminAuthSlice";


export type Role = {
  id: string;
  name: string;
  permissions: Permissions;
};
export type AdminUser = {
  id:string;
  name:string;
  email:string;
  role:Role;
  token:string;
}

export const adminLogin = createAsyncThunk<
 AdminUser,
 {email:string,password:string}
>(
  "auth/adminLogin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      console.log(response?.data)
      return response?.data?.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP send failed"
      );
    }
  }
);

