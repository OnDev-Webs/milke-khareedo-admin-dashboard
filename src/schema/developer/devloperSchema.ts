import { z } from "zod";

export const DeveloperSchema = z.object({

  name: z.string().min(1, "Developer name is required"),
  description: z.string().optional(),
  city: z.string().min(1, "City is required"),
  establishedYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year"),
  totalProjects: z
    .string()
    .regex(/^\d+$/, "Must be a number"),
  website: z.string().optional(),

  contactName: z.string().min(1, "Contact person is required"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string(),
});

export type DeveloperForm = z.infer<typeof DeveloperSchema>;