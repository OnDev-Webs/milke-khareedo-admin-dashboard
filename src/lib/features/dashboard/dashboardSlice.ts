import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDashboard } from "./dashboardApi";

export type Overview = {
  totalDevelopers: number;
  liveProjects: number;
  totalLeads: number;
  totalBookingsThisMonth: number;
};

export type RecentLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
  projectName: string;
  amount: string;
  amountValue: number;
  createdAt: string;
};

export type SalesPerformance = {
  userId: string;
  userName: string;
  profileImage: string | null;
  totalLead: number;
  leadContacted: string;
  leadContactedPercentage: number;
  responseTime: string;
};

export type GroupBuyProgress = {
  targetUnits: number;
  confirmedUnits: number;
  progressPercentage: number;
};

export type DashboardState = {
  overview: Overview | null;
  recentLeads: RecentLead[];
  topPerformingProjects: any[];
  salesTeamPerformance: SalesPerformance[];
  groupBuyProgress: GroupBuyProgress | null;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  overview: null,
  recentLeads: [],
  topPerformingProjects: [],
  salesTeamPerformance: [],
  groupBuyProgress: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;

        state.overview = action.payload.overview;
        state.recentLeads = action.payload.recentLeads;
        state.topPerformingProjects = action.payload.topPerformingProjects;
        state.salesTeamPerformance = action.payload.salesTeamPerformance;
        state.groupBuyProgress = action.payload.groupBuyProgress;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export const { resetDashboard, } = dashboardSlice.actions;

export default dashboardSlice.reducer;
