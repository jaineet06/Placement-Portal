import Job from "../models/job.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


const createStudent = async (req, res) => {
    const { id } = req.user;
    const { fullName, parentName, branch, birthDate, category, mobile, alternateMobile, parentMobile } = req.body

    try {



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
        })

        await newStudent.save()

        return res.status(200).json({ success: true, message: "Student created successfully", student: newStudent });

    } catch (error) {
        console.error("Create Student Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }

}


const getStudents = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const searchQuery = req.query.search || ""
        const skip = (page - 1) * limit

        let filter = {};
        if (searchQuery) {
            const regex = new RegExp(searchQuery, "i");
            filter.fullName = regex;
        }


        const students = await Student.find(filter)
            .populate("user", "enrollNumber fullName email")
            .skip(skip)
            .limit(limit);


        const total = await Student.countDocuments()

        res.json({ success: true, message: "Students fetched Succesfully", students, total: Math.ceil(total / limit) });
    } catch (error) {
        return res.json({ success: false, message: "Server Error" });
    }
}


const getStudent = async (req, res) => {
    const { id } = req.user;
    try {
        const student = await Student.findOne({ user: id })


        const userData = await User.findById(id).select("enrollNumber");

        return res.json({
            success: true,
            message: "Student fetched successfully",
            student: {
                ...student._doc,
                enrollNumber: userData.enrollNumber,
            },
        });

    } catch (error) {
        console.error("Get Student Error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const studentExist = async (req, res) => {
    const { id } = req.user;
    try {
        const student = await Student.findOne({ user: id })
        if (!student) res.json({ isStudent: false });
        res.json({ isStudent: true });
    } catch (error) {
        return res.json({ success: false, message: "Server Error" });
    }
}


const uploadStudentFiles = async (req, res) => {
    const { id } = req.user
    try {

        if (!req.files || (!req.files.resume && !req.files.profilePath)) {
            return res.status(400).json({ success: false, message: "No files provided for update." });
        }
        const student = await Student.findOne({ user: id })
        if (!student) {
            return res.status(400).json({ success: false, message: "Student not found." })
        }

        let resumePath = null;
        let profilePicPath = null;

        if (req.files) {
            if (req.files.resume && req.files.resume[0]) {
                const resume = req.files.resume[0]

                if (resume.mimetype !== "application/pdf") {
                    return res.json({ success: false, message: "Resume must be a PDF." });
                }

                if (resume.size > 2 * 1024 * 1024) {
                    return res.json({ success: false, message: "Resume size must be less than 2MB" });
                }

                if (student.resume && student.resume.public_id) {

                    await deleteFromCloudinary(student.resume.public_id, "raw")
                }

                resumePath = await uploadToCloudinary(
                    resume.path,
                    "students/resumes",
                    `${student.id}-resume`,
                    "raw"
                )
            }

            if (req.files.profilePath && req.files.profilePath[0]) {
                const profile = req.files.profilePath[0]
                const validTypes = ["image/jpeg", "image/png", "image/jpg"]
                if (!validTypes.includes(profile.mimetype)) {
                    return res.json({ success: false, message: "Profile image must be JPG, PNG, or JPEG." });
                }

                if (profile.size > 1 * 1024 * 1024) {
                    return res.json({ success: false, message: "Profile image must be under 1MB." });
                }

                if (student.profilePath && student.profilePath.public_id) {

                    await deleteFromCloudinary(student.profilePath.public_id, "image")
                }

                profilePicPath = await uploadToCloudinary(
                    profile.path,
                    "students/profilePics",
                    `${student.id}-profile`,
                    "image"
                );
            }

            if (resumePath) {
                student.resume = resumePath;
            }
            if (profilePicPath) {
                student.profilePath = profilePicPath;
            }

            await student.save()

            return res.status(200).json({
                success: true,
                message: "Files updated succesfully"
            });
        }
    } catch (error) {
        console.error("Update Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const getStudentVefrification = async (req, res) => {

    const { id } = req.user

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.json({ success: false, message: "No User exists" });
        }

        return res.status(200).json({ success: true, isVerified: user.isVerified })
    } catch (error) {
        console.error("Update Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

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
        const jobs = await Job.find({}).sort({ createdAt: -1 }).select("-recruiter -roles.applicants")

        if (!jobs) {
            return res.json({ success: false, message: "No currrent openings" })
        }

        return res.json({ success: true, message: "Jobs fetched successfully!", jobs })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error" })
    }
}

const fetchJobById = async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await Job.findById(jobId).select("-roles.applicants -recruiter")
        if (!job) {
            return res.json({ success: false, message: "No job with specific id" })
        }
        return res.json({ success: true, message: "Job fetched successfully!", job })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error" })
    }
}



const applyToJob = async (req, res) => {
    try {
        const { studentId, jobId } = req.params;
        const { roles, acceptedTerms } = req.body;

        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            return res.json({ success: false, message: "Select at least one role" });
        }

        if (!acceptedTerms) {
            return res.json({ success: false, message: "You must accept terms & conditions" });
        }

        const student = await Student.findOne({ user: studentId });
        if (!student) return res.json({ success: false, message: "Student not found." });

        const job = await Job.findById(jobId);
        if (!job) return res.json({ success: false, message: "Job not found." });

        if (job.status === "Closed") {
            return res.json({ success: false, message: "Applications are closed" });
        }

        const appliedRoles = [];

        for (const selectedRole of roles) {
            const roleObj = job.roles.find(r => r.name === selectedRole);
            if (!roleObj) continue;


            const alreadyApplied = roleObj.applicants.some(
                s => s.student.equals(student._id)
            );

            if (!alreadyApplied) {
                roleObj.applicants.push({ student: student._id, acceptedTerms, appliedAt: Date.now() });
                appliedRoles.push(selectedRole);
            }
        }

        if (appliedRoles.length === 0) {
            return res.json({
                success: false,
                message: "You have already applied for all selected roles.",
            });
        }

        const exists = student.appliedJobs.some(
            entry => entry.job.toString() === jobId
        );
        if (!exists) {
            student.appliedJobs.push({ job: jobId });
        }

        await student.save();
        await job.save();

        return res.json({
            success: true,
            message: `Applied successfully for: ${appliedRoles.join(", ")}`,
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Server error while applying to job.",
        });
    }
};

const fetchAllAppliedJobs = async (req, res) => {
    const { userId } = req.params;

    try {
        const student = await Student.findOne({ user: userId }).populate("appliedJobs.job")
        if (!student) {
            return res.json({ success: false, message: "No student found" })
        }

        const appliedJobs = student.appliedJobs.map(({ job, status }) => {

            if (!job) return null;

            const appliedRoles = []
            let appliedAt = null;

            job.roles.forEach(role => {
                const applicant = role.applicants.find(a => a.student.toString() === student._id.toString())

                if (applicant) appliedRoles.push(role.name)
                if (!appliedAt || applicant.appliedAt < appliedAt) {

                    appliedAt = applicant.appliedAt
                }
            })

            return {
                name: job.companyName,
                title: job.title,
                location: job.location,
                appliedRoles,
                appliedAt,
                status
            }
        }).filter(r => r !== null)

        return res.json({ success: true, appliedJobs })
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Server error fetching applied jobs." });
    }
}


export { createStudent, getStudents, getStudent, uploadStudentFiles, getStudentVefrification, studentExist, getStudentFiles, fetchAllJobs, fetchJobById, applyToJob, fetchAllAppliedJobs }