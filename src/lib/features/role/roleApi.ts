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


export type Permission = {
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  export?: boolean;
};

export type PermissionsMap = {
  [module: string]: Permission;
};


export interface Role {
  _id: string;
  name: string;
  permissions: PermissionsMap; // ✅ OBJECT
  createdAt?: string;
  updatedAt?: string;
}


/* ================= ADD ROLE ================= */
// POST /admin/add_role
export const addRole = createAsyncThunk<
  Role,
  { name: string; permissions: PermissionsMap },
  { rejectValue: string }
>("roles/addRole", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/admin/add_role", payload);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add role"
    );
  }
});

/* ================= GET ALL ROLES ================= */
// GET /admin/get_role
export const fetchRoles = createAsyncThunk<
  Role[],
  void,
  { rejectValue: string }
>("roles/fetchRoles", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/admin/get_role");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch roles"
    );
  }
});

/* ================= GET ROLE BY ID ================= */
// GET /admin/get_role_by_id/:id
export const fetchRoleById = createAsyncThunk<
  Role,
  string,
  { rejectValue: string }
>("roles/fetchRoleById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/admin/get_role_by_id/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch role"
    );
  }
});

/* ================= UPDATE ROLE ================= */
// PUT /admin/update_role/:id
export const updateRole = createAsyncThunk<
  Role,
  { id: string; name: string; permissions: PermissionsMap },
  { rejectValue: string }
>("roles/updateRole", async ({ id, name, permissions }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/admin/update_role/${id}`, {
      name,
      permissions,
    });
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update role"
    );
  }
});

/* ================= DELETE ROLE ================= */
// DELETE /admin/delete_role/:id
export const deleteRole = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("roles/deleteRole", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/admin/delete_role/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete role"
    );
  }
});
