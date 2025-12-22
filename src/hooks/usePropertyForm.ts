"use client";

import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useForm } from "react-hook-form";

export const usePropertyForm = (initialData?: Partial<PropertyFormValues>) => {
  return useForm<PropertyFormValues>({
    mode: "onSubmit",
    shouldUnregister: false,

    defaultValues: {
      projectName: "",
      developer: "",
      location: "",

      projectSize: "",
      landParcel: "",
      possessionDate: "",

      developerPrice: "",
      offerPrice: "",
      minGroupMembers: 0,

      reraId: "",
      reraQrImage: undefined,
      possessionStatus: "",

      overview: "",

      description: "",

      configurations: [],


      highlights: [],
      amenities: [],

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
