import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Lead, LeadResponse, LeadDetailsResponse } from "./leadcrmSlice";

export const fetchLeads = createAsyncThunk<
  LeadResponse,
  { page?: number; limit?: number; search?: string | undefined , dateRange?: "past_24_hours" | "past_7_days" | "past_30_days"; },
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

// CRM DASHBOARD 

export type CRMDashboardParams = {
  dateRange?: "past_24_hours" | "past_7_days" | "past_30_days";
  sortBy?: "newest_first" | "oldest_first" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
};

export type CRMDashboardResponse = {
  success: boolean;
  message: string;
  data: {
    kpis: {
      leadsReceived: number;
      leadsContacted: number;
      leadsContactedPercentage: number;
      responseTime: string;
    };
    todaysFollowUps: any[];
    leads: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

/* ================= THUNK ================= */

export const fetchCRMDashboard = createAsyncThunk<
  CRMDashboardResponse,
  CRMDashboardParams | void,
  { rejectValue: string }
>(
  "crmDashboard/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        dateRange = "past_24_hours",
        sortBy = "newest_first",
        page = 1,
        limit = 10,
      } = params as CRMDashboardParams;

      const query = new URLSearchParams({
        dateRange,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const res = await axiosInstance.get(
        `/admin/crm-dashboard?${query}`
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch CRM dashboard"
      );
    }
  }
);

// notificationTypes
export type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  source?: string;
  timeAgo: string;
  isRead: boolean;
  notificationType: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
};

export type NotificationGroup = {
  dateLabel: string; // Today | Yesterday | 12 Sep 2025
  notifications: NotificationItem[];
};

export type NotificationResponse = {
  success: boolean;
  message: string;
  data: NotificationGroup[];
};


/* ================= GET NOTIFICATIONS ================= */

export const fetchNotifications = createAsyncThunk<
  NotificationResponse,
  void,
  { rejectValue: string }
>(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/notifications");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

/* ================= MARK ALL AS READ ================= */

export const markAllNotificationsAsRead = createAsyncThunk<
  { success: boolean; message: string; data: { updatedCount: number } },
  void,
  { rejectValue: string }
>(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        "/admin/notifications/mark-all-read"
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark notifications as read"
      );
    }
  }
);
