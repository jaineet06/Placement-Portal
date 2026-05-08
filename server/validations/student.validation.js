import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  parentName: z.string().min(2).max(100).trim(),

  branch: z.string().min(2).trim(),

  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid birth date"),

  category: z.string().min(2).trim(),

  mobile: z
    .string()
    .length(10, "Mobile must be 10 digits")
    .regex(/^[0-9]+$/),

  alternateMobile: z.preprocess(
  (val) => val === "" ? undefined : val,
  z.string()
    .length(10, "Alternate mobile must be 10 digits")
    .regex(/^[0-9]+$/)
    .optional()
),

  parentMobile: z
    .string()
    .length(10, "Parent mobile must be 10 digits")
    .regex(/^[0-9]+$/),
});

export const jobIdParamSchema = z.object({
  jobId: z
    .string()
    .length(24, "Invalid Job ID")
    .regex(/^[0-9a-fA-F]{24}$/),
});

export const applyJobSchema = z.object({
  roles: z
    .array(
      z
        .string()
        .length(24, "Invalid Role ID")
        .regex(/^[0-9a-fA-F]{24}$/)
    )
    .min(1, "Select at least one role"),
});