import { z } from "zod";

const yearSchema = z
    .number({ invalid_type_error: "Passout year must be a number" })
    .min(1980, "Year is too old")
    .max(new Date().getFullYear(), "Year cannot be in the future");

const percentageSchema = z.object({
    percentage: z
        .number({ invalid_type_error: "Percentage must be a number" })
        .min(0, "Percentage cannot be less than 0")
        .max(100, "Percentage cannot exceed 100"),

    // ✅ added passoutYear
    passoutYear: yearSchema
});

export const educationSchema = z.object({
    ssc: percentageSchema.optional(),

    hsc: percentageSchema.optional(),

    diploma: percentageSchema.optional(),

    spi: z
        .array(
            z
                .number({ invalid_type_error: "SPI must be a number" })
                .min(0)
                .max(10)
        )
        .min(1, "Provide at least one SPI value"),

    cpi: z
        .number({ invalid_type_error: "CPI must be a number" })
        .min(0)
        .max(10)
        .optional(),

    cgpa: z
        .number({ invalid_type_error: "CGPA must be a number" })
        .min(0)
        .max(10)
        .optional(),
})
.refine((data) => {
    const hscProvided = data.hsc?.percentage !== undefined;
    const diplomaProvided = data.diploma?.percentage !== undefined;

    return !(hscProvided && diplomaProvided);
}, {
    message: "Provide either HSC or Diploma, not both.",
})
.refine((data) => {
    const hscProvided = data.hsc?.percentage !== undefined;
    const diplomaProvided = data.diploma?.percentage !== undefined;

    return hscProvided || diplomaProvided;
}, {
    message: "Either HSC or Diploma is required.",
});