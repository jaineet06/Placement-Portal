
import { addOrUpdateEducationService, getEducationService } from "../services/education.service.js";

const addOrUpdateEducation = async (req, res, next) => {
  const { id } = req.user;
  try {
    const { created, education } = await addOrUpdateEducationService(id, req.validatedData);
    res.status(created ? 201 : 200).json({
      success: true,
      message: created
        ? "Education details added successfully"
        : "Education details updated successfully",
      education,
    });
  } catch (error) {
    next(error);
  }
};

const getEducation = async (req, res, next) => {
  const { id } = req.user;
  try {
    const education = await getEducationService(id);
    res.status(200).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

export { addOrUpdateEducation, getEducation };