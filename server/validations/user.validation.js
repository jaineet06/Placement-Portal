import { z } from "zod"

export const userSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long"),

    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    enrollNumber: z
        .string()
        .length(12, "Enrollment number must be exactly 12 characters")
});