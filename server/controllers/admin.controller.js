import Student from "../models/student.model.js"


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

export { getStudentByEnrollment }