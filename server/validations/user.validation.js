import { z } from "zod"

export const userSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long")
        .trim(),

    email: z
        .string()
        .email("Invalid email address")
        .transform((val) => val.toLowerCase().trim()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    enrollNumber: z
        .string()
        .length(12, "Enrollment number must be exactly 12 characters")
        .regex(/^[A-Za-z0-9]+$/, "Only alphanumeric allowed")
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(6, "Password is required")
    .transform((val) => val.trim()),
});


export const idParamSchema = z.object({
  id: z
    .string()
    .length(24, "Invalid user ID")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})