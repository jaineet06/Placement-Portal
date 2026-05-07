import Address from "../models/address.model.js";
import Education from "../models/education.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { updateApplicationStatusService } from "./job.service.js";

export const getStudentByEnrollmentService = async (enrollNumber) => {
  const user = await User.findOne({ enrollNumber });
  if (!user) return null;

  const student = await Student.findOne({ user: user._id }).populate(
    "user",
    "name email phone enrollNumber"
  );

  if (!student) return null;

  return student;
};


export const getAddressByEnrollmentService = async (enrollNumber) => {
  const user = await User.findOne({ enrollNumber });
  if (!user) return null;

  const addresses = await Address.find({ user: user._id });
  if (!addresses || addresses.length === 0) return null;

  const formatted = { permanent: {}, current: {} };

  for (let add of addresses) {
    if (add.type === "permanent") formatted.permanent = add;
    if (add.type === "current") formatted.current = add;
  }

  return formatted;
};


export const getEducationService = async (userId) => {
  const education = await Education.findOne({ user: userId });
  if (!education) return null;

  return education;
};


export const deleteStudentService = async (userId) => {
  const student = await Student.findOne({ user: userId });

  if (student) {
    if (student.profilePath?.public_id) {
      await deleteFromCloudinary(student.profilePath.public_id, "image");
    }

    if (student.resume?.public_id) {
      await deleteFromCloudinary(student.resume.public_id, "raw");
    }
  }

  await User.findByIdAndDelete(userId);
  await Student.findOneAndDelete({ user: userId });
  await Address.deleteMany({ user: userId });
  await Education.findOneAndDelete({ user: userId });

  return true;
};


export const changeApplicationStatusAdminService = async (data) => {
  const { status, jobId, userId, roleId } = data;

  const application = await updateApplicationStatusService(
    userId,
    jobId,
    roleId,
    status
  );

  return application;
};