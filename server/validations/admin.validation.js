import { z } from "zod";

export const enrollmentParamSchema = z.object({
  id: z
    .string()
    .length(12, "Enrollment number must be exactly 12 characters")
    .regex(/^[A-Za-z0-9]+$/, "Only alphanumeric allowed"),
});

export const userIdParamSchema = z.object({
  userId: z
    .string()
    .length(24, "Invalid user ID")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

export const changeApplicationStatusSchema = z.object({
  status: z.enum(["Applied", "Shortlisted", "Rejected", "Selected"]),

  jobId: z
    .string()
    .length(24, "Invalid Job ID")
    .regex(/^[0-9a-fA-F]{24}$/),

  userId: z
    .string()
    .length(24, "Invalid User ID")
    .regex(/^[0-9a-fA-F]{24}$/),

  roleId: z.string().min(1, "Role ID is required").trim(),
});

export const updateStudentStatusSchema = z.object({
  isBlocked: z.boolean(),
});
