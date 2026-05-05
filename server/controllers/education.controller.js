import Education from "../models/education.model.js"
import Student from "../models/student.model.js"

const addOrUpdateEducation = async (req, res) => {
    const { id } = req.user;

    // ✅ from middleware
    const { ssc, hsc, diploma, spi, cpi, cgpa } = req.validatedData;

    try {
        const student = await Student.findOne({ user: id });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student found for this user"
            });
        }

        let education = await Education.findOne({ user: id });

        if (!education) {
            education = new Education({
                user: id,
                ssc,
                hsc,
                diploma,
                spi,
                cpi,
                cgpa,
            });

            await education.save();

            return res.status(201).json({
                success: true,
                message: "Education details added successfully",
                education
            });
        } else {

            if (ssc !== undefined) education.ssc = ssc;
            if (hsc !== undefined) education.hsc = hsc;
            if (diploma !== undefined) education.diploma = diploma;

            if (spi) education.spi = spi;

            if (cpi !== undefined) education.cpi = cpi;
            if (cgpa !== undefined) education.cgpa = cgpa;

            await education.save();

            return res.status(200).json({
                success: true,
                message: "Education details updated successfully",
                education
            });
        }
    } catch (error) {
        console.error("Add or Update Education Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const getEducation = async (req, res) => {
    const { id } = req.user;
    try {
        const education = await Education.findOne({ user: id });

        return res.status(200).json({ success: true, education });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export { addOrUpdateEducation, getEducation }