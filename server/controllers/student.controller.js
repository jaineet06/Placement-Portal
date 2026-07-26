import {
  applyJobService,
  fetchAllAppliedJobsService,
} from "#services/student.service.js";
import Job from "../models/job.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import Role from "#models/role.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import sendMail from "#configs/nodemailer.js";
import { getApplicationSubmittedTemplate } from "#utils/mail-templates.js";
import AppError from "../utils/AppError.js";
import Application from "#models/application.model.js";

const createStudent = async (req, res, next) => {
  const { id } = req.user;
  try {
    const newStudent = await Student.create({ user: id, ...req.validatedData });
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchQuery = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;

    let filter = {};
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      const users = await User.find({ enrollNumber: regex }).select("_id");
      const userIds = users.map((u) => u._id);
      filter = {
        $or: [
          { fullName: regex },
          ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
        ],
      };
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("user", "enrollNumber fullName email")
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      students,
      total: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  const { id } = req.user;
  try {
    const student = await Student.findOne({ user: id });
    if (!student) throw new AppError("Student not found", 404);

    const userData = await User.findById(id).select("enrollNumber");
    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      student: { ...student._doc, enrollNumber: userData?.enrollNumber },
    });
  } catch (error) {
    next(error);
  }
};

const studentExist = async (req, res, next) => {
  const { id } = req.user;
  try {
    const student = await Student.findOne({ user: id });
    res.status(200).json({ isStudent: !!student });
  } catch (error) {
    next(error);
  }
};

const uploadStudentFiles = async (req, res, next) => {
  const { id } = req.user;
  try {
    if (!req.files || (!req.files.resume && !req.files.profilePath)) {
      throw new AppError("No files provided for update", 400);
    }

    const student = await Student.findOne({ user: id });
    if (!student) throw new AppError("Student not found", 404);

    if (req.files.resume?.[0]) {
      const resume = req.files.resume[0];
      if (resume.mimetype !== "application/pdf")
        throw new AppError("Resume must be a PDF", 400);
      if (resume.size > 2 * 1024 * 1024)
        throw new AppError("Resume size must be less than 2MB", 400);

      if (student.resume?.public_id)
        await deleteFromCloudinary(student.resume.public_id, "raw");
      student.resume = await uploadToCloudinary(
        resume.path,
        "students/resumes",
        `${student.id}-resume`,
        "raw",
      );
    }

    if (req.files.profilePath?.[0]) {
      const profile = req.files.profilePath[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(profile.mimetype))
        throw new AppError("Profile image must be JPG, PNG, or JPEG", 400);
      if (profile.size > 2 * 1024 * 1024)
        throw new AppError("Profile image must be under 1MB", 400);

      if (student.profilePath?.public_id)
        await deleteFromCloudinary(student.profilePath.public_id, "image");
      student.profilePath = await uploadToCloudinary(
        profile.path,
        "students/profilePics",
        `${student.id}-profile`,
        "image",
      );
    }

    await student.save();
    res
      .status(200)
      .json({ success: true, message: "Files updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getStudentVefrification = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, isVerified: user.isVerified });
  } catch (error) {
    next(error);
  }
};

const getStudentFiles = async (req, res, next) => {
  const { id } = req.user;
  try {
    const student = await Student.findOne({ user: id }).select(
      "resume profilePath",
    );
    if (!student) throw new AppError("Student not found", 404);
    res.status(200).json({
      success: true,
      files: {
        resume: student.resume?.url,
        profilePath: student.profilePath?.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const fetchAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .select("-recruiter -roles.applicants");
    res
      .status(200)
      .json({ success: true, message: "Jobs fetched successfully", jobs });
  } catch (error) {
    next(error);
  }
};

const fetchJobById = async (req, res, next) => {
  const { jobId } = req.validatedParams;
  try {
    const job = await Job.findById(jobId)
      .populate({ path: "roles.id", select: "roleName" })
      .select("-recruiter");
    if (!job) throw new AppError("Job not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Job fetched successfully", job });
  } catch (error) {
    next(error);
  }
};

const applyToJob = async (req, res, next) => {
  const { jobId } = req.validatedParams;
  const { roles } = req.validatedData;
  const userId = req.user.id;

  try {
    const student = await Student.findOne({ user: userId }).populate({
      path: "user",
      select: "email name",
    });

    if (!student) {
      throw new AppError("Create student profile first", 400);
    }

    const job = await Job.findById(jobId);
    if (!job) throw new AppError("Job not found", 404);

    if (student.isBlocked) {
      throw new AppError(
        "Your account has been blocked by the admin from applying for jobs.",
        403,
      );
    }

    if (job.status === "Closed" || job.lastDate < new Date()) {
      throw new AppError("This job is no longer accepting applications", 400);
    }

    const applications = await applyJobService(userId, jobId, roles);
    if (applications.length === 0)
      throw new AppError("Already applied for all selected roles", 409);

    const roleDocs = await Role.find({ _id: { $in: roles } }).select(
      "roleName",
    );
    const roleNames = roleDocs.map((r) => r.roleName);

    await sendMail({
      to: student.user.email,
      subject: `Application Received: ${job.companyName}`,
      body: getApplicationSubmittedTemplate(
        student.user.name,
        job.companyName,
        roleNames.join(", "),
        new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      ),
    });

    res
      .status(201)
      .json({ success: true, message: "Successfully applied for roles" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const fetchAllAppliedJobs = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const appliedJobs = await fetchAllAppliedJobsService(userId);
    res.status(200).json({
      success: true,
      message: "Applied jobs fetched successfully",
      appliedJobs,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createStudent,
  getStudents,
  getStudent,
  uploadStudentFiles,
  getStudentVefrification,
  studentExist,
  getStudentFiles,
  fetchAllJobs,
  fetchJobById,
  applyToJob,
  fetchAllAppliedJobs,
};
