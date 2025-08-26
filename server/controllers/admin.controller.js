import Address from "../models/address.model.js";
import Education from "../models/education.model.js";
import Student from "../models/student.model.js"
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";


const getStudentByEnrollment = async (req, res) => {
    const { id } = req.params
    try {

        const isStudent = await Student.findOne({ enrollmentNo: id }).populate("user", "email");
        if (!isStudent) {
            return res.json({ success: false, message: "No Student found" })
        }

        return res.json({ success: true, message: "Student fetched succesfully", student: isStudent })
    } catch (error) {
        console.error("Create Student Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }
}

const getAddressByEnrollment = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findOne({ enrollmentNo: id });
        const userId = student.user;
        const addresses = await Address.find({ user: userId });
        if (!addresses) {
            return res.json({ success: false, message: "No Address found" })
        }
        const formatted = {
            permanent: {},
            current: {},
        };

        for (let add of addresses) {
            if (add.type === "permanent") formatted.permanent = add;
            if (add.type === "current") formatted.current = add;
        }

        return res.json({ success: true, address: formatted })
    } catch (error) {
        console.error("Address Fetch Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }
}

const getEducation = async (req, res) => {
    const { userId } = req.params;
    try {
        const education = await Education.findOne({ user: userId });
        if (!education) {
            return res.json({ success: false, message: "No education data found" })
        }
        return res.json({ success: true, education })
    } catch (error) {
        console.error("Education Fetch Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }
}

const deleteStudent = async (req, res) => {
    const { userId } = req.params
    try {
        const student = await Student.findOne({ user: userId })
        if (student) {
            if (student.profilePath?.public_id) {
                await deleteFromCloudinary(student.profilePath.public_id, "image")
            }

            if (student.resume?.public_id) {
                await deleteFromCloudinary(student.resume.public_id, "raw");
            }
        }

        await User.findByIdAndDelete(userId)
        await Student.findOneAndDelete({ user: userId })
        await Address.deleteMany({ user: userId })
        await Education.findOneAndDelete({ user: userId })
        return res.json({ success: true, message: "Student and related data deleted successfully" });
    } catch (error) {
        console.error("Student Fetch Error:", error.message);
        return res.json({ success: false, message: "Server Error" });
    }
}

export { getStudentByEnrollment, getAddressByEnrollment, getEducation, deleteStudent }