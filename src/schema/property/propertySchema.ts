import { z } from "zod";

export const configurationSchema = z.object({
  unitType: z.string().min(1),
  carpetArea: z.string().min(1),
  builtUpArea: z.string().min(1),
  price: z.string().min(1),
  availabilityStatus: z.enum(["Available", "Sold"]),
});

export const connectivityItemSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const propertySchema = z.object({
  projectName: z.string().min(3),
  developer: z.string(),
  location: z.string(),

  projectSize: z.string(),
  landParcel: z.string(),
  possessionDate: z.string(),

  developerPrice: z.string(),
  offerPrice: z.string(),
  minGroupMembers: z.number().min(1),

  reraId: z.string(),
  reraQRcode: z
    .object({
      url: z.string().url(),
      isCover: z.boolean().default(true),
      order: z.number().default(1),
    })
    .optional(),
  possessionStatus: z.string(),

  description: z.string(),
  overview: z.string(),

  configurations: z.array(configurationSchema),

  images: z.array(
    z.object({
      url: z.string().url(),
      isCover: z.boolean(),
      order: z.number(),
    })
  ),

  highlights: z.array(z.string()).min(3),
  amenities: z.array(z.string()).min(3),

  layouts: z.array(
    z.object({
      configurationUnitType: z.string(),
      image: z.string().url(),
    })
  ),

  latitude: z.number(),
  longitude: z.number(),
  connectivity: z.object({
    schools: z.array(connectivityItemSchema),
    hospitals: z.array(connectivityItemSchema),
    transportation: z.array(connectivityItemSchema),
    restaurants: z.array(connectivityItemSchema),
  }),

  relationshipManagerId: z.string(),
  leadDistributionAgents: z.array(z.string()),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
