"use client";

import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useForm } from "react-hook-form";

export const usePropertyForm = (initialData?: Partial<PropertyFormValues>) => {
  return useForm<PropertyFormValues>({
    mode: "onSubmit",
    shouldUnregister: false,

    defaultValues: {
      projectName: "",
      developerId: "",
      location: "",

      projectSize: "",
      landParcel: "",
      possessionDate: "",

      developerPrice: "",
      offerPrice: "",
      minGroupMembers: 0,

      reraId: "",
      reraQRcode: undefined,
      possessionStatus: "",

      overview: "",

      description: "",

      configurations: [],

      images: [],

      highlights: [],
      amenities: [],

      layouts: [],

      connectivity: {
        schools: [],
        hospitals: [],
        transportation: [],
        restaurants: [],
      },

      latitude: undefined,
      longitude: undefined,
      relationshipManagerId: undefined,
      leadDistributionAgents: [],


      ...initialData,
    },
  });
};
