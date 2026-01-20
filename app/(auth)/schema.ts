import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(/^[0-9+\-\s()]+$/, "Invalid phone number").min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });