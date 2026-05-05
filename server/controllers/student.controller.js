import { applyJobService, fetchAllAppliedJobsService } from "#services/student.service.js";
import Job from "../models/job.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import Role from "#models/role.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import sendMail from "#configs/nodemailer.js";
import { getApplicationSubmittedTemplate } from "#utils/mail-templates.js";

const createStudent = async (req, res) => {
    const { id } = req.user;
    
    try {
        const {
            fullName,
            parentName,
            branch,
            birthDate,
            category,
            mobile,
            alternateMobile,
            parentMobile
        } = req.validatedData;

        const newStudent = new Student({
            user: id,
            fullName,
            parentName,
            parentMobile,
            branch,
            birthDate,
            category,
            mobile,
            alternateMobile,
        });

        await newStudent.save();

        return res.status(200).json({
            success: true,
            message: "Student created successfully",
            student: newStudent
        });

    } catch (error) {
        console.error("Create Student Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }
};


const getStudents = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = req.query.search?.trim() || "";
        const skip = (page - 1) * limit;

        let filter = {};

        if (searchQuery) {
            const regex = new RegExp(searchQuery, "i");

            const users = await User.find({
                enrollNumber: regex,
            }).select("_id");

            const userIds = users.map(u => u._id);

            filter = {
                $or: [
                    { fullName: regex }, // keep if exists in Student
                    ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : [])
                ]
            };
        }

        const students = await Student.find(filter)
            .populate("user", "enrollNumber fullName email")
            .skip(skip)
            .limit(limit);

        const total = await Student.countDocuments(filter);

        return res.json({
            success: true,
            message: "Students fetched successfully",
            students,
            total: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Server Error" });
    }
};


const getStudent = async (req, res) => {
    const { id } = req.user;

    try {
        const student = await Student.findOne({ user: id });

        // ✅ FIX: prevent crash
        if (!student) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }

        const userData = await User.findById(id).select("enrollNumber");

        return res.json({
            success: true,
            message: "Student fetched successfully",
            student: {
                ...student._doc,
                enrollNumber: userData?.enrollNumber,
            },
        });

    } catch (error) {
        console.error("Get Student Error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


const studentExist = async (req, res) => {
    const { id } = req.user;

    try {
        const student = await Student.findOne({ user: id });

        // ✅ FIX: prevent double response
        if (!student) {
            return res.json({ isStudent: false });
        }

        return res.json({ isStudent: true });

    } catch (error) {
        return res.json({ success: false, message: "Server Error" });
    }
};


const uploadStudentFiles = async (req, res) => {
    const { id } = req.user;

    try {
        if (!req.files || (!req.files.resume && !req.files.profilePath)) {
            return res.status(400).json({
                success: false,
                message: "No files provided for update."
            });
        }

        const student = await Student.findOne({ user: id });

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Student not found."
            });
        }

        let resumePath = null;
        let profilePicPath = null;

        if (req.files.resume && req.files.resume[0]) {
            const resume = req.files.resume[0];

            if (resume.mimetype !== "application/pdf") {
                return res.json({ success: false, message: "Resume must be a PDF." });
            }

            if (resume.size > 2 * 1024 * 1024) {
                return res.json({ success: false, message: "Resume size must be less than 2MB" });
            }

            if (student.resume?.public_id) {
                await deleteFromCloudinary(student.resume.public_id, "raw");
            }

            resumePath = await uploadToCloudinary(
                resume.path,
                "students/resumes",
                `${student.id}-resume`,
                "raw"
            );
        }

        if (req.files.profilePath && req.files.profilePath[0]) {
            const profile = req.files.profilePath[0];

            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validTypes.includes(profile.mimetype)) {
                return res.json({ success: false, message: "Profile image must be JPG, PNG, or JPEG." });
            }

            if (profile.size > 1 * 1024 * 1024) {
                return res.json({ success: false, message: "Profile image must be under 1MB." });
            }

            if (student.profilePath?.public_id) {
                await deleteFromCloudinary(student.profilePath.public_id, "image");
            }

            profilePicPath = await uploadToCloudinary(
                profile.path,
                "students/profilePics",
                `${student.id}-profile`,
                "image"
            );
        }

        if (resumePath) student.resume = resumePath;
        if (profilePicPath) student.profilePath = profilePicPath;

        await student.save();

        return res.status(200).json({
            success: true,
            message: "Files updated succesfully"
        });

    } catch (error) {
        console.error("Update Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getStudentVefrification = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.json({ success: false, message: "No User exists" });
        }

        return res.status(200).json({
            success: true,
            isVerified: user.isVerified
        });

    } catch (error) {
        console.error("Update Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getStudentFiles = async (req, res) => {
    const { id } = req.user;

    try {
        const student = await Student.findOne({ user: id })
            .select("resume profilePath");

        if (!student) {
            return res.json({ success: false, message: "No Student exists" });
        }

        return res.json({
            success: true,
            files: {
                resume: student.resume?.url,
                profilePath: student.profilePath?.url
            }
        });

    } catch (error) {
        console.error("Error fetching student files:", error);
        return res.json({ success: false, message: "Server Error" });
    }
};


const fetchAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .sort({ createdAt: -1 })
            .select("-recruiter -roles.applicants");

        if (!jobs) {
            return res.json({ success: false, message: "No currrent openings" });
        }

        return res.json({
            success: true,
            message: "Jobs fetched successfully!",
            jobs
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error" });
    }
};


const fetchJobById = async (req, res) => {

    // ✅ from middleware
    const { jobId } = req.validatedParams;

    try {
        const job = await Job.findById(jobId)
            .populate({
                path: "roles.id",
                select: "roleName"
            })
            .select("-recruiter");

        if (!job) {
            return res.json({ success: false, message: "No job with specific id" });
        }

        return res.json({
            success: true,
            message: "Job fetched successfully!",
            job
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error" });
    }
};


const applyToJob = async (req, res) => {

    // ✅ from middleware
    const { jobId } = req.validatedParams;
    const { roles } = req.validatedData;

    const userId = req.user.id;

    try {

        const student = await Student.findOne({ user: userId }).populate({
            path: "user",
            select: "email name"
        });

        if (!student) {
            return res.json({ success: false, message: "Create student profile first" });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.json({ success: false, message: "No job found" });
        }

        if (job.status === "Closed" || job.lastDate < new Date()) {
            return res.json({ success: false, message: "No longer accepting responses" });
        }

        const applications = await applyJobService(userId, jobId, roles);

        if (applications.length === 0) {
            return res.json({ success: false, message: "Already applied for all roles" });
        }

        const roleDocs = await Role.find({ _id: { $in: roles } }).select("roleName");
        const roleNames = roleDocs.map(r => r.roleName);

        await sendMail({
            to: student.user.email,
            subject: `Application Received: ${job.companyName}`,
            body: getApplicationSubmittedTemplate(
                student.user.name,
                job.companyName,
                roleNames.join(", "),
                new Date().toLocaleDateString("en-IN", {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            )
        });

        return res.json({ success: true, message: "Successfully applied for roles" });

    } catch (error) {
        return res.json({ success: false, message: "Server error while applying for jobs." });
    }
};


const fetchAllAppliedJobs = async (req, res) => {
    const userId = req.user?.id;

    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const appliedJobs = await fetchAllAppliedJobsService(userId);

        return res.json({
            success: true,
            message: "Applied jobs fetched successfully",
            appliedJobs,
        });

    } catch (error) {
        console.error("Fetch applied jobs error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching applied jobs"
        });
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
    fetchAllAppliedJobs
};