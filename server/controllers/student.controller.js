import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

//To create a Student
const createStudent = async (req, res) => {
    const { id } = req.user;
    const {  fullName, parentName, branch, birthDate, category, mobile, alternateMobile, parentMobile } = req.body

    try {

        // const isExist = await Student.findOne({ enrollmentNo })
        // if (isExist) {
        //     return res.status(400).json({ success: false, message: "Student with this enrollment number already exists." })
        // }

        // let resumePath = "";
        // let profilePicPath = "";

        // if (req.files) {
        //     if (req.files.resume && req.files.resume[0]) {
        //         const resume = req.files.resume[0]

        //         if (resume.mimetype != "application/pdf") {
        //             return res.status(400).json({ success: false, message: "Resume must be a PDF." });
        //         }

        //         if (resume.size > 2 * 1024 * 1024) {
        //             return res.status(400).json({ success: false, message: "Resume must be under 2MB." });
        //         }

        //         const resumeResult = await uploadToCloudinary(
        //             resume.path,
        //             "students/resumes",
        //             `${enrollmentNo}-resume`,
        //             "raw"
        //         )

        //         resumePath = {
        //             url: resumeResult.secure_url,
        //             public_id: resumeResult.public_id
        //         }
        //     }

        //     if (req.files.profilePath && req.files.profilePath[0]) {
        //         const profile = req.files.profilePath[0]
        //         const validTypes = ["image/jpeg", "image/png", "image/jpg"]
        //         if (!validTypes.includes(profile.mimetype)) {
        //             return res.status(400).json({ success: false, message: "Profile image must be JPG, PNG, or JPEG." });
        //         }

        //         if (profile.size > 1 * 1024 * 1024) {
        //             return res.status(400).json({ success: false, message: "Profile image must be under 1MB." });
        //         }

        //         const profileResult = await uploadToCloudinary(
        //             profile.path,
        //             "students/profilePics",
        //             `${enrollmentNo}-profile`,
        //             "image"
        //         );
        //         profilePicPath = {
        //             url: profileResult.secure_url,
        //             public_id: profileResult.public_id
        //         }
        //     }
        // }

        const newStudent = new Student({
            user: id,
           // enrollmentNo,
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

//Get list of all students (Admin)
const getStudents = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const students = await Student.find({}).skip(skip).limit(limit)

        const total = await Student.countDocuments()

        res.json({ success: true, message: "Students fetched Succesfully", students, total: Math.ceil(total / limit) });
    } catch (error) {
        return res.json({ success: false, message: "Server Error" });
    }
}

//Get single student
const getStudent = async (req, res) => {
    const { id } = req.user;
    try {
        const student = await Student.findOne({ user: id })
    //     res.json({ success: true, message: "Students fetched Succesfully", student });

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

//update student files
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

//To check is student verified
const getStudentVefrification = async (req, res) => {

    const { id } = req.user

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ success: false, message: "No User exists" });
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

export { createStudent, getStudents, getStudent, uploadStudentFiles, getStudentVefrification, studentExist, getStudentFiles }