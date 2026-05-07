import {
  getStudentByEnrollmentService,
  getAddressByEnrollmentService,
  getEducationService,
  deleteStudentService,
  changeApplicationStatusAdminService
} from "../services/admin.service.js";

import sendMail from "#configs/nodemailer.js";
import { getStatusUpdateTemplate } from "#utils/mail-templates.js";


const getStudentByEnrollment = async (req, res) => {

  const { id } = req.validatedParams;

  try {
    const student = await getStudentByEnrollmentService(id);

    if (!student) {
      return res.json({ success: false, message: "No Student found" });
    }

    return res.json({
      success: true,
      message: "Student fetched successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};


const getAddressByEnrollment = async (req, res) => {

  const { id } = req.validatedParams;

  try {
    const address = await getAddressByEnrollmentService(id);

    if (!address) {
      return res.json({ success: false, message: "No Address found" });
    }

    return res.json({ success: true, address });
  } catch (error) {
    console.error("Address Fetch Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};


const getEducation = async (req, res) => {

  const { userId } = req.validatedParams;

  try {
    const education = await getEducationService(userId);

    if (!education) {
      return res.json({ success: false, message: "No education data found" });
    }

    return res.json({ success: true, education });
  } catch (error) {
    console.error("Education Fetch Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};


const deleteStudent = async (req, res) => {

  const { userId } = req.validatedParams;

  try {
    await deleteStudentService(userId);

    return res.json({
      success: true,
      message: "Student and related data deleted successfully",
    });
  } catch (error) {
    console.error("Student Delete Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};


const changeApplicationStatus = async (req, res) => {

  const { status, jobId, userId, roleId } = req.validatedData;

  try {
    const application = await changeApplicationStatusAdminService(req.validatedData);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const email = application.user.email;
    const name = application.user.name;
    const companyName = application.job.companyName;

    await sendMail({
      to: email,
      subject: "Your Application Status Has Been Updated",
      body: getStatusUpdateTemplate(name, companyName, application.role.roleName, status),
    });

    return res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export {
  getStudentByEnrollment,
  getAddressByEnrollment,
  getEducation,
  deleteStudent,
  changeApplicationStatus
};