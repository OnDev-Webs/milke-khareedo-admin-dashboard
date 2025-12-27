// src/lib/features/roles/roleApi.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export interface Agent {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
}

// Fetch all agents
export const fetchAgentRoles = createAsyncThunk<Agent[], void, { rejectValue: string }>(
  "roles/fetchAgentRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/get_agent_role");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent roles");
    }
  }
);

// Fetch all relationship managers
export const fetchRelationshipManagers = createAsyncThunk<Agent[], void, { rejectValue: string }>(
  "roles/fetchRelationshipManagers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/get_relationship_manager");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch relationship managers");
    }
  }
);
