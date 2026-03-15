import mongoose from "mongoose";
import Application from "#models/application.model.js";
import Job from "#models/job.model.js"
import Role from "#models/role.model.js";
import { Parser } from "json2csv";

export const createJobService = async ({
    companyName,
    recruiter,
    title,
    description,
    jobType,
    lastDate,
    location,
    roles,
    rounds
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
            rounds
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
        const applications = await Application.aggregate([
            { $match: { job: new mongoose.Types.ObjectId(jobId) } },
            { $sort: { appliedAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDoc"
                }
            },
            { $unwind: "$userDoc" },
            {
                $lookup: {
                    from: "students",
                    localField: "user",
                    foreignField: "user",
                    as: "studentDoc"
                }
            },
            { $unwind: "$studentDoc" },
            {
                $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "roleDoc"
                }
            },
            { $unwind: "$roleDoc" },
            {
                $project: {
                    appliedAt: 1,
                    status: 1,
                    user: {
                        _id: "$userDoc._id",
                        enrollNumber: "$userDoc.enrollNumber",
                        email: "$userDoc.email"
                    },
                    student: {
                        fullName: "$studentDoc.fullName",
                        branch: "$studentDoc.branch",
                        user: {
                            _id: "$userDoc._id",
                            enrollNumber: "$userDoc.enrollNumber"
                        }
                    },
                    role: {
                        _id: "$roleDoc._id",
                        roleName: "$roleDoc.roleName"
                    }
                }
            }
        ]);
        return applications;
    } catch (error) {
        console.error("Error in getting applications for job by id:", error);
        throw error;
    }
};

export const getAllJobServices = async () => {
    try {
        const jobs = await Job.find().populate({ path: "roles.id", select: "roleName" }).sort({ createdAt: -1 }).lean()

        return jobs.map((job) => ({
            ...job,
            rolesCount: job.roles.length
        }));
    } catch (error) {
        console.error("Error in getting all jobs:", error)
        throw error
    }
}

export const exportRoleApplicantsToCSVService = async (roleId) => {
    try {
        const applications = await Application.find({ role: roleId })
            .populate("user", "enrollNumber email")
            .lean();

        if (!applications.length) return null;

        const userIds = applications.map((a) => a.user._id);
        const Student = (await import("#models/student.model.js")).default;
        const students = await Student.find({ user: { $in: userIds } })
            .select("user fullName branch mobile resume")
            .lean();
        const studentByUser = Object.fromEntries(
            students.map((s) => [s.user.toString(), s])
        );

        const rows = applications.map((app) => {
            const student = studentByUser[app.user._id.toString()] || {};
            return {
                enrollNumber: app.user?.enrollNumber ?? "",
                name: student.fullName ?? "",
                email: app.user?.email ?? "",
                mobile: student.mobile ?? "",
                branch: student.branch ?? "",
                resume: student.resume?.url ?? "",
                status: app.status ?? "",
                appliedAt: app.appliedAt
            };
        });

        const parser = new Parser();
        return parser.parse(rows);
    } catch (error) {
        console.error("Error in exporting applicants to CSV:", error);
        throw error;
    }
};

export const updateApplicationStatusService = async (userId, jobId, roleId, status) => {
    try {
        const application = await Application.findOneAndUpdate(
            { user: userId, job: jobId, role: roleId },
            { $set: { status } },
            { new: true }
        );
        return application;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};