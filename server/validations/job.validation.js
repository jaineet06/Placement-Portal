import { z } from "zod"

export const createJobSchema = z.object({
    companyName: z.string().min(2),
    recruiter: z.object({
        hrName: z.string().min(2),
        email: z.string().email().min(10).max(255).toLowerCase(),
        contact: z.string().length(10)
    }),
    title: z.string().min(3),
    description: z.string().min(10),
    jobType: z.enum(["Full Time", "Internship", "Internship + FTE"]),
    lastDate: z.string().refine(
        (date) => new Date(date) > new Date(),
        "Last date must be in the future"
    ),
    location: z.string().optional(),
    roles: z.array(z.string().min(2)).min(1)
})

export const changeJobStatusSchema = z.object({
    status: z.enum(["Open", "Closed"])
})