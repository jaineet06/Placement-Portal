import { addOrUpdateEducationService, getEducationService } from "../services/education.service.js";

const addOrUpdateEducation = async (req, res) => {
    const { id } = req.user;

    try {
        const result = await addOrUpdateEducationService(id, req.validatedData);

        if (result?.error) {
            return res.status(404).json({
                success: false,
                message: result.error
            });
        }

        return res.status(result.created ? 201 : 200).json({
            success: true,
            message: result.created
                ? "Education details added successfully"
                : "Education details updated successfully",
            education: result.education
        });

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
        const education = await getEducationService(id);

        return res.status(200).json({ success: true, education });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export { addOrUpdateEducation, getEducation };