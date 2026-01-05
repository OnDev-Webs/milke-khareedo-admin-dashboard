import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deletePropertyById, fetchProperties, fetchPropertyById } from "./propertiesApi";

export interface Developer {
  _id: string;
  developerName: string;
}

export interface Configuration {
  _id: string;
  unitType: string;
  carpetArea: string;
  builtUpArea: string;
  price: string;
  availabilityStatus: "Available" | "Sold" | string;
}

export interface PropertyImage {
  _id: string;
  url: string;
  isCover: boolean;
  order: number;
}

export interface Layout {
  _id: string;
  configurationUnitType: string;
  image: string;
  configuration: Configuration;
}

export interface ConnectivityItem {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Connectivity {
  schools: ConnectivityItem[];
  hospitals: ConnectivityItem[];
  transportation: ConnectivityItem[];
  restaurants: ConnectivityItem[];
}

export interface Agent {
  _id: string;
  name: string;
}

export interface Property {
  _id: string;
  projectId: string;
  projectName: string;
  developer: Developer;
  location: string;
  latitude: number;
  longitude: number;
  projectSize: string;
  landParcel: string;
  possessionDate: string;
  developerPrice: string;
  offerPrice: string;
  discountPercentage: string;
  minGroupMembers: number;
  reraId: string;
  reraQrImage: string;
  possessionStatus: string;
  description: string;
  configurations: Configuration[];
  images: PropertyImage[];
  highlights: string[];
  amenities: string[];
  layouts: Layout[];
  connectivity: Connectivity;
  relationshipManager: Agent;
  leadDistributionAgents: Agent[];
  joinedGroupCount: number;
  isStatus: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface PropertyState {
  PropertiesList: Property[];
  selected: Property | null;
  loading: boolean;
  error: string | null;
  total: number,
  page: number,
  totalPages: number,
  count: number,
}

const initialState: PropertyState = {
  PropertiesList: [],
  selected: null,
  loading: false,
  error: null,
  count: 0,
  page: 0,
  total: 0,
  totalPages: 0
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearSelectedProperty(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.PropertiesList = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.count = action.payload.data.length;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Fetch by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action: PayloadAction<Property>) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Fetch by ID
      .addCase(deletePropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.PropertiesList = state.PropertiesList.filter(
          (p: Property) => p._id !== action.meta.arg
        );
      })
      .addCase(deletePropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;