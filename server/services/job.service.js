import Application from "#models/application.model.js";
import Job from "#models/job.model.js"
import Role from "#models/role.model.js";

export const createJobService = async ({
    companyName,
    recruiter,
    title,
    description,
    jobType,
    lastDate,
    location,
    roles
}) => {
    try {
        const job = await Job.create({
            companyName,
            recruiter,
            title,
            description,
            jobType,
            lastDate: new Date(lastDate),
            location,
        })

        const jobId = job._id;

        const roleDocs = roles.map((role) => ({
            jobId,
            roleName: role
        }))

        const createdRoles = await Role.insertMany(roleDocs)

        job.roles = createdRoles.map((role) => ({
            id: role._id
        }))

        await job.save()

        return jobId
    } catch (error) {
        console.error("DB Job Create Error:", error)
        throw error
    }
}

export const deleteJobService = async (jobId) => {
    try {
        const roles = await Role.find({ jobId })

        const roleIds = roles.map((r) => r._id)

        await Application.deleteMany({
            job: jobId,
            role: { $in: roleIds }
        })

        await Role.deleteMany({ jobId })

        await Job.findByIdAndDelete(jobId)

    } catch (error) {
        console.error("DB Job Delete Error:", error)
        throw error
    }
}

export const getJobByIdService = async (jobId) => {
    try {
        const job = await Job.findById(jobId).populate({
            path: "roles.id",
            select: "roleName createdAt"
        }).lean()

        if (!job) return null

        return job
    } catch (error) {
        console.error("Error in getting job by id:", error)
        throw error
    }
}

export const getApplicationsForJobByIdService = async (jobId) => {
    try {
        const applications = Application.find({ job: jobId }).populate({
            path: "student"
        }).populate({
            path: "role"
        }).sort({ appliedAt: -1 }).lean()

        return applications
    } catch (error) {
        console.error("Error in getting aaplications for job by id:", error)
        throw error
    }
}