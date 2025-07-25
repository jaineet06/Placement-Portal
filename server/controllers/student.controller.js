import Student from "../models/student.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

//To create a Student
const createStudent = async (req, res) => {
    const { id } = req.user;
    const { enrollmentNo, fullName, parentName, branch, birthDate, category, mobile, alternateMobile, parentMobile } = req.body

    try {

        const isExist = await Student.findOne({ enrollmentNo })
        if (isExist) {
            return res.status(400).json({ success: false, message: "Student with this enrollment number already exists." })
        }

        let resumePath = "";
        let profilePicPath = "";

        if (req.files) {
            if (req.files.resume && req.files.resume[0]) {
                const resume = req.files.resume[0]

                if (resume.mimetype != "application/pdf") {
                    return res.status(400).json({ success: false, message: "Resume must be a PDF." });
                }

                if (resume.size > 2 * 1024 * 1024) {
                    return res.status(400).json({ success: false, message: "Resume must be under 2MB." });
                }

                resumePath = await uploadToCloudinary(
                    resume.path,
                    "students/resumes",
                    `${enrollmentNo}-resume`,
                    "raw"
                )
            }

            if (req.files.profilePath && req.files.profilePath[0]) {
                const profile = req.files.profilePath[0]
                const validTypes = ["image/jpeg", "image/png", "image/jpg"]
                if (!validTypes.includes(profile.mimetype)) {
                    return res.status(400).json({ success: false, message: "Profile image must be JPG, PNG, or JPEG." });
                }

                if (profile.size > 1 * 1024 * 1024) {
                    return res.status(400).json({ success: false, message: "Profile image must be under 1MB." });
                }

                profilePicPath = await uploadToCloudinary(
                    profile.path,
                    "students/profilePics",
                    `${enrollmentNo}-profile`,
                    "image"
                );
            }
        }

        const newStudent = new Student({
            user: id,
            enrollmentNo,
            fullName,
            parentName,
            parentMobile,
            branch,
            birthDate,
            category,
            mobile,
            alternateMobile,
            parentMobile,
            resume: resumePath,
            profilePath: profilePicPath
        })

        await newStudent.save()

        return res.status(201).json({ success: true, message: "Student created successfully", student: newStudent });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }

}

//Get list of all students
const getStudents = async (req, res) => {

}

//Get single student
const getStudent = async (req, res) => {

}

//update student field
const updateStudent = async (req, res) => {

}

export { createStudent, getStudents, getStudent, updateStudent }