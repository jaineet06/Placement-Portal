import { changeJobStatusSchema, createJobSchema } from "../validations/job.validation.js"
import { createJobService, deleteJobService, getApplicationsForJobByIdService, getJobByIdService } from "../services/job.service.js"
import Job from "#models/job.model.js"

export const createJob = async (req, res) => {
    try {
        const validationResult = createJobSchema.safeParse(req.body)

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.flatten(),
            })
        }

        const jobId = await createJobService(validationResult.data)

        return res.status(201).json({
            success: true,
            message: "Job and roles created successfully",
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        await deleteJobService(jobId)

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete job",
        })
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { jobId } = req.params;

        const validationResult = changeJobStatusSchema.safeParse(req.body)

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.error.flatten(),
            })
        }

        await Job.findByIdAndUpdate(jobId, { status: validationResult.data.status });

        res.status(200).json({
            success: true,
            message: `Job status updated to ${validationResult.data.status}`,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update status job",
        })
    }
}

export const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await getJobByIdService(jobId)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            })
        }

        const applications = await getApplicationsForJobByIdService(jobId)

        return res.status(200).json({
            success: true,
            job,
            applications,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}