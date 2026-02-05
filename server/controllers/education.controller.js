import Education from "../models/education.model.js"
import Student from "../models/student.model.js"

const addOrUpdateEducation = async (req, res) => {
    const { id } = req.user;
    const { ssc, hsc, diploma, spi, cpi, cgpa } = req.body;

    try {
        const student = await Student.findOne({ user: id });
        if (!student) {
            return res.status(404).json({ success: false, message: "No student found for this user" });
        }

        let education = await Education.findOne({ user: id });

       
        const hscProvided = hsc && hsc.percentage !== undefined && hsc.percentage !== null;
        const diplomaProvided = diploma && diploma.percentage !== undefined && diploma.percentage !== null;

        if (hscProvided && diplomaProvided) {
            return res.status(400).json({ success: false, message: "Provide either HSC or Diploma, not both." });
        }

        if (!hscProvided && !diplomaProvided) {
            return res.status(400).json({ success: false, message: "Either HSC or Diploma is required." });
        }

        if (!spi || !Array.isArray(spi) || spi.length === 0) {
            return res.status(400).json({ success: false, message: "Provide at least one SPI value." });
        }

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
            return res.status(201).json({ success: true, message: "Education details added successfully", education });
        } else {
            
            if (ssc !== undefined) education.ssc = ssc;
            if (hsc !== undefined) education.hsc = hsc;
            if (diploma !== undefined) education.diploma = diploma;

            if (spi) education.spi = spi;

            if (cpi !== undefined) education.cpi = cpi;
            if (cgpa !== undefined) education.cgpa = cgpa;

            await education.save();

            return res.status(200).json({ success: true, message: "Education details updated successfully", education });
        }
    } catch (error) {
        console.error("Add or Update Education Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const getEducation = async (req, res) => {
    const { id } = req.user;
    try {
        const education = await Education.findOne({ user: id });
       
        return res.status(200).json({ success: true, education });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export { addOrUpdateEducation, getEducation }