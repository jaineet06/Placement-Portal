
import mongoose from "mongoose";
import Application from "#models/application.model.js";
import Job from "#models/job.model.js";
import Role from "#models/role.model.js";
import { Parser } from "json2csv";
import AppError from "../utils/AppError.js";

export const createJobService = async ({
  companyName, recruiter, title, description,
  jobType, lastDate, location, roles, rounds
}) => {
  const job = await Job.create({
    companyName, recruiter, title, description,
    jobType, lastDate: new Date(lastDate), location, rounds
  });

  const roleDocs = roles.map((role) => ({ jobId: job._id, roleName: role }));
  const createdRoles = await Role.insertMany(roleDocs);

  job.roles = createdRoles.map((role) => ({ id: role._id }));
  await job.save();

  return job._id;
};

export const deleteJobService = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) throw new AppError("Job not found", 404);

  const roles = await Role.find({ jobId });
  const roleIds = roles.map((r) => r._id);

  await Application.deleteMany({ job: jobId, role: { $in: roleIds } });
  await Role.deleteMany({ jobId });
  await Job.findByIdAndDelete(jobId);
};

export const changeJobStatusService = async (jobId, status) => {
  const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
  if (!job) throw new AppError("Job not found", 404);
  return job;
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId)
    .populate({ path: "roles.id", select: "roleName createdAt" })
    .lean();

  if (!job) throw new AppError("Job not found", 404);
  return job;
};

export const getApplicationsForJobByIdService = async (jobId) => {
  const applications = await Application.aggregate([
    { $match: { job: new mongoose.Types.ObjectId(jobId) } },
    { $sort: { appliedAt: -1 } },
    { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "userDoc" } },
    { $unwind: "$userDoc" },
    { $lookup: { from: "students", localField: "user", foreignField: "user", as: "studentDoc" } },
    { $unwind: "$studentDoc" },
    { $lookup: { from: "roles", localField: "role", foreignField: "_id", as: "roleDoc" } },
    { $unwind: "$roleDoc" },
    {
      $project: {
        appliedAt: 1,
        status: 1,
        user: { _id: "$userDoc._id", enrollNumber: "$userDoc.enrollNumber", email: "$userDoc.email" },
        student: {
          fullName: "$studentDoc.fullName",
          branch: "$studentDoc.branch",
          user: { _id: "$userDoc._id", enrollNumber: "$userDoc.enrollNumber" }
        },
        role: { _id: "$roleDoc._id", roleName: "$roleDoc.roleName" }
      }
    }
  ]);

  return applications;
};

export const getAllJobServices = async () => {
  const jobs = await Job.find()
    .populate({ path: "roles.id", select: "roleName" })
    .sort({ createdAt: -1 })
    .lean();

  return jobs.map((job) => ({ ...job, rolesCount: job.roles.length }));
};

export const exportRoleApplicantsToCSVService = async (roleId) => {
  const role = await Role.findById(roleId)
    .populate("jobId", "title companyName")
    .lean();

  if (!role) throw new AppError("Role not found", 404);

  const applications = await Application.find({ role: roleId })
    .populate("user", "enrollNumber email")
    .lean();

  if (!applications.length) throw new AppError("No applicants found for this role", 404);

  const userIds = applications.map((a) => a.user._id);
  const Student = (await import("#models/student.model.js")).default;
  const students = await Student.find({ user: { $in: userIds } })
    .select("user fullName branch mobile resume")
    .lean();

  const studentByUser = Object.fromEntries(students.map((s) => [s.user.toString(), s]));

  const rows = applications.map((app) => {
    const student = studentByUser[app.user._id.toString()] || {};
    return {
      enrollNumber: app.user?.enrollNumber ?? "",
      name: student.fullName ?? "",
      email: app.user?.email ?? "",
      mobile: student.mobile ?? "",
      branch: student.branch ?? "",
      resume: student.resume?.url ?? "",
      appliedAt: app.appliedAt,
    };
  });

  const parser = new Parser();
  const csv = parser.parse(rows);

  return {
    csv,
    roleName: role.roleName,
    companyName: role.jobId?.companyName ?? "Company",
  };
};

export const updateApplicationStatusService = async (userId, jobId, roleId, status) => {
  const application = await Application.findOneAndUpdate(
    { user: userId, job: jobId, role: roleId },
    { $set: { status } },
    { new: true }
  ).populate([
    { path: "user", select: "email name" },
    { path: "job", select: "companyName" },
    { path: "role", select: "roleName" }
  ]);

  return application;
};