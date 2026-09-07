import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Username is required"),
  email: z.email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role: z.enum(["BUYER", "SELLER"], "Role is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
