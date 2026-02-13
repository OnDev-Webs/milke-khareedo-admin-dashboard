import { z } from "zod";

export const subConfigurationSchame = z.object({
  carpetArea: z.string().min(1),
  price: z.string().min(1),
  layouts: z.array(z.instanceof(File)).optional(),
})

export const configurationSchema = z.object({
  unitType: z.string().min(1),
  subConfigurations:z.array(subConfigurationSchame).min(1),
  availabilityStatus: z.enum(["Available", "Sold"]),
});

export const connectivityItemSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

const fileSchema =
  typeof window === "undefined"
    ? z.any()
    : z.instanceof(File);

export const propertySchema = z.object({
  projectName: z.string().min(3),
  developer: z.string(),
  location: z.string(),

  projectSize: z.string(),
  landParcel: z.string(),
  possessionDate: z.string(),
  totalUnits: z.number().min(1),


  developerPrice: z.string(),
  offerPrice: z.string(),
  minGroupMembers: z.number().min(1),

  reraId: z.string(),
  reraQrImage: z
    .instanceof(File)
    .optional(),
    
  possessionStatus: z.string().min(1),

  description: z.string(),

  configurations: z.array(configurationSchema).min(1),

  images: z.array(fileSchema).optional(),

  highlights: z.array(z.string()).min(3),
  amenities: z.array(z.string()).min(3),

  layouts: z
    .record(z.string(), z.array(fileSchema))
    .optional(),

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
