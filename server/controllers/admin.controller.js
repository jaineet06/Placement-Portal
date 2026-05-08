
import {
  getStudentByEnrollmentService,
  getAddressByEnrollmentService,
  getEducationService,
  deleteStudentService,
  changeApplicationStatusAdminService
} from "../services/admin.service.js";

import sendMail from "#configs/nodemailer.js";
import { getStatusUpdateTemplate } from "#utils/mail-templates.js";

const getStudentByEnrollment = async (req, res, next) => {
  const { id } = req.validatedParams;
  try {
    const student = await getStudentByEnrollmentService(id);
    res.status(200).json({ success: true, message: "Student fetched successfully", student });
  } catch (error) {
    next(error);
  }
};

const getAddressByEnrollment = async (req, res, next) => {
  const { id } = req.validatedParams;
  try {
    const address = await getAddressByEnrollmentService(id);
    res.status(200).json({ success: true, address });
  } catch (error) {
    next(error);
  }
};

const getEducation = async (req, res, next) => {
  const { userId } = req.validatedParams;
  try {
    const education = await getEducationService(userId);
    res.status(200).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  const { userId } = req.validatedParams;
  try {
    await deleteStudentService(userId);
    res.status(200).json({ success: true, message: "Student and related data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const changeApplicationStatus = async (req, res, next) => {
  const { status } = req.validatedData;
  try {
    const application = await changeApplicationStatusAdminService(req.validatedData);

    const { email, name } = application.user;
    const { companyName } = application.job;

    await sendMail({
      to: email,
      subject: "Your Application Status Has Been Updated",
      body: getStatusUpdateTemplate(name, companyName, application.role.roleName, status),
    });

    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getStudentByEnrollment,
  getAddressByEnrollment,
  getEducation,
  deleteStudent,
  changeApplicationStatus
};