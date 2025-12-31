import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Lead, LeadResponse, LeadDetailsResponse } from "./leadcrmSlice";

export const fetchLeads = createAsyncThunk<
  LeadResponse,
  { page?: number; limit?: number; search?: string | undefined },
  { rejectValue: string }
>(
  "leadcrm/fetchAll",
  async ({ page = 1, limit = 10, search }, { rejectWithValue }) => {
    try {
      let url = `admin/lead_list?page=${page}&limit=${limit}`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const res = await axiosInstance.get(url);
      console.log("response is :-",res.data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leads"
      );
    }
  }
);

export const fetchLeadById = createAsyncThunk<
  LeadDetailsResponse,
  string,
  { rejectValue: string }
>("leadcrm/fetchById", async (leadId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`admin/view_lead_list/${leadId}`);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch lead details"
    );
  }
});

export const createLeadActivity = createAsyncThunk<
  { success: boolean; message: string },
  {
    leadId: string;
    activityType: string;
    description: string;
    nextFollowUpDate?: string;
    visitDate?: string;
    visitTime?: string;
  },
  { rejectValue: string }
>(
  "leadcrm/createActivity",
  async (payload, { rejectWithValue }) => {
    try {
      const { leadId, ...activityData } = payload;
      const res = await axiosInstance.post(
        `admin/lead/${leadId}/activity`,
        activityData
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create activity"
      );
    }
  }
);

export const updateLeadStatus = createAsyncThunk<
  { success: boolean; message: string },
  { leadId: string; status: string },
  { rejectValue: string }
>(
  "leadcrm/updateStatus",
  async ({ leadId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/lead/${leadId}/status`, {
        status,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lead status"
      );
    }
  }
);

export const updateLeadRemark = createAsyncThunk<
  { success: boolean; message: string },
  { leadId: string; remark: string },
  { rejectValue: string }
>(
  "leadcrm/updateRemark",
  async ({ leadId, remark }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/lead/${leadId}/remark`, {
        remark,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lead remark"
      );
    }
  }
);

export const deleteLead = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>(
  "leadcrm/deleteLead",
  async (leadId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`admin/delete_lead_list/${leadId}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lead"
      );
    }
  }
);

export const exportLeadsCSV = createAsyncThunk<
  { success: boolean; message: string; csvUrl: string; totalLeads: number; exportedAt: string },
  void,
  { rejectValue: string }
>(
  "leadcrm/exportCSV",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`admin/export_all_leads_csv`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to export leads CSV"
      );
    }
  }
);

