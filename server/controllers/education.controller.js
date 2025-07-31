import Education from "../models/education.model.js"
import Student from "../models/student.model.js"

//To add new education
const addNewEducation = async (req, res) => {
    const { id } = req.user
    const { ssc, hsc, diploma, spi, cpi, cgpa } = req.body

    try {
        const student = await Student.findOne({ user: id })
        if (!student) {
            return res.status(404).json({ success: false, message: "No student found for this user" });
        }

        const existingEducation = await Education.findOne({ user: id })
        if (existingEducation) {
            return res.status(400).json({ success: false, message: "Education details already exist. Use update API." });
        }

        const education = new Education({
            user: id,
            ssc,
            hsc,
            diploma,
            spi,
            cpi,
            cgpa
        });

        await education.save();

        return res.status(201).json({ success: true, message: "Education details added successfully" });
    } catch (error) {
        console.error("Add Education Error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}

//Update user education
const updateEducation = async (req, res) => {
    const { id } = req.user
    const updates = req.body

    try {

        const education = await Education.findOne({ user: id });
        if (!education) {
            return res.status(404).json({ success: false, message: "Education details not found. Please add them first." });
        }
        if (updates.spi) {
            if (!Array.isArray(updates.spi) || updates.spi.length === 0) {
                return res.status(400).json({ success: false, message: "SPI must be a non-empty array" });
            }
            education.spi = updates.spi;
        }

        if (updates.cpi !== undefined) {
            education.cpi = updates.cpi;
        }

        if (updates.cgpa !== undefined) {
            education.cgpa = updates.cgpa;
        }

        await education.save();

        return res.status(200).json({ success: true, message: "Education details updated successfully" });
    } catch (error) {
        console.error("Update Education Error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}

export { addNewEducation, updateEducation }