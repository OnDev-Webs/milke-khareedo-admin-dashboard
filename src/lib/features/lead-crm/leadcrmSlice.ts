import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchLeads,
  fetchLeadById,
  createLeadActivity,
  updateLeadStatus,
  fetchCRMDashboard,
  NotificationGroup,
  fetchNotifications,
  markAllNotificationsAsRead,
} from "./leadcrmApi";

export interface Lead {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  projectId: string;
  status: string;
  dateTime: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string | null;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TimelineItem {
  id: string;
  activityType: string;
  activityDate: string;
  formattedDate: string;
  description: string;
  performedBy: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  nextFollowUpDate: string | null;
  visitDate: string | null;
  visitTime: string | null;
  oldStatus: string | null;
  newStatus: string | null;
  metadata?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
}

export interface PropertyConfiguration {
  unitType: string;
  carpetArea: string;
  builtUpArea: string;
  price: string;
  availabilityStatus: string;
  _id: string;
}

export interface PropertyImage {
  url: string;
  isCover: boolean;
  order: number;
  _id: string;
}

export interface RelationshipManager {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  latitude: number;
  longitude: number;
  possessionDate: string;
  configurations: PropertyConfiguration[];
  amenities: string[];
  images: PropertyImage[];
  relationshipManager: RelationshipManager;
}

export interface NextFollowUp {
  date: string;
  formattedDate: string;
  isOverdue: boolean;
}

export interface LeadDetails {
  _id: string;
  leadName: string;
  date: string;
  phoneNumber: string;
  projectId: string;
  source: string;
  ipAddress: string;
  remark: string;
  status: string;
  statusValue: string;
  visitStatus: string;
  user: User;
  property: Property;
  rmEmail: string;
  rmPhone: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineItem[];
  nextFollowUp: NextFollowUp | null;
  followUpNotification: any;
}

export interface LeadDetailsResponse {
  success: boolean;
  message: string;
  data: LeadDetails;
}

interface LeadCRMState {
  leads: Lead[];
  selected: LeadDetails | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loadingDetails: boolean;
  crmDashboardLoading: boolean;
  crmDashboardData: any | null;
  notifications: NotificationGroup[];
  notificationLoading: boolean;
}

const initialState: LeadCRMState = {
  leads: [],
  selected: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  loadingDetails: false,
  crmDashboardLoading: false,
  crmDashboardData: null,

  notifications: [],
  notificationLoading: false,
};

const leadcrmSlice = createSlice({
  name: "leadcrm",
  initialState,
  reducers: {
    clearSelectedLead(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload?.data || [];
        state.page = action.payload?.pagination?.page || 1;
        state.limit = action.payload?.pagination?.limit || 10;
        state.total = action.payload?.pagination?.total || 0;
        state.totalPages = action.payload?.pagination?.totalPages || 0;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.loadingDetails = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selected = action.payload?.data || null;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload || "Failed to fetch lead details";
      })
      .addCase(createLeadActivity.fulfilled, (state) => {
        // Activity created successfully, details will be refetched
      })
      .addCase(updateLeadStatus.fulfilled, (state) => {
        // Status updated successfully, details will be refetched
      });

    builder
      .addCase(fetchCRMDashboard.pending, (state) => {
        state.crmDashboardLoading = true;
      })
      .addCase(fetchCRMDashboard.fulfilled, (state, action) => {
        state.crmDashboardLoading = false;
        state.crmDashboardData = action.payload;
      })
      .addCase(fetchCRMDashboard.rejected, (state, action) => {
        state.crmDashboardLoading = false;
        state.error = action.payload || "Failed to fetch CRM dashboard";
      });

    /* ================= NOTIFICATIONS ================= */

    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notifications = action.payload?.data || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationLoading = false;
        state.error = action.payload || "Failed to fetch notifications";
      });

    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications.forEach((group) => {
        group.notifications.forEach((notification) => {
          notification.isRead = true;
        });
      });
    });

  },
});

export const { clearSelectedLead } = leadcrmSlice.actions;
export default leadcrmSlice.reducer;
