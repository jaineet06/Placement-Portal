
import Education from "../models/education.model.js";
import Student from "../models/student.model.js";
import AppError from "../utils/AppError.js";

export const addOrUpdateEducationService = async (userId, data) => {
  const { ssc, hsc, diploma, spi, cpi, cgpa } = data;

  const student = await Student.findOne({ user: userId });
  if (!student) throw new AppError("No student found for this user", 404);

  let education = await Education.findOne({ user: userId });

  if (!education) {
    education = await Education.create({ user: userId, ssc, hsc, diploma, spi, cpi, cgpa });
    return { created: true, education };
  }

  if (ssc !== undefined) education.ssc = ssc;
  if (hsc !== undefined) education.hsc = hsc;
  if (diploma !== undefined) education.diploma = diploma;
  if (spi) education.spi = spi;
  if (cpi !== undefined) education.cpi = cpi;
  if (cgpa !== undefined) education.cgpa = cgpa;

  await education.save();
  return { created: false, education };
};

export const getEducationService = async (userId) => {
  const education = await Education.findOne({ user: userId });
  if (!education) throw new AppError("No education record found for this user", 404);
  return education;
};