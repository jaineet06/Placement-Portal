import { z } from "zod";

export const addressSchema = z.object({
    type: z.enum(["permanent", "current"], "Invalid address type"),

    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(255, "Address too long")
        .trim(),

    city: z
        .string()
        .min(2, "City must be at least 2 characters")
        .trim(),

    state: z
        .string()
        .min(2, "State must be at least 2 characters")
        .trim(),

   pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),

    country: z
        .string()
        .min(2)
        .default("India")
        .transform((val) => val.trim()),
});