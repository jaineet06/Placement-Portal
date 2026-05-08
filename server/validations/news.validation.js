import { z } from "zod";

export const newsSchema = z.object({
    headline: z
        .string()
        .min(3, "Headline must be at least 3 characters")
        .max(255, "Headline too long")
        .trim(),

    tag: z
        .string()
        .min(2, "Tag must be at least 2 characters")
        .trim(),

    link: z
        .string()
        .url("Invalid URL")
        .optional()
        .or(z.literal("")),
});

export const newsIdParamSchema = z.object({
    newsId: z
        .string()
        .length(24, "Invalid News ID")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});