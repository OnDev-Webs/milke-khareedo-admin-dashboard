import z from "zod";

export const loginSchema = z.object({
  email: z.string().min(2, "Email is required"),
  password: z.string().min(2, "Password is required"),
});

export type loginFrom = z.infer<typeof loginSchema>;
