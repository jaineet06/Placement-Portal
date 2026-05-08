
import {
  createJobService,
  deleteJobService,
  exportRoleApplicantsToCSVService,
  getAllJobServices,
  getApplicationsForJobByIdService,
  getJobByIdService
} from "../services/job.service.js";

export const createJob = async (req, res, next) => {
  try {
    await createJobService(req.validatedData);
    res.status(201).json({ success: true, message: "Job and roles created successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    await deleteJobService(jobId);
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    await changeJobStatusService(jobId, req.validatedData.status);
    res.status(200).json({
      success: true,
      message: `Job status updated to ${req.validatedData.status}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const job = await getJobByIdService(jobId);
    const applications = await getApplicationsForJobByIdService(jobId);
    res.status(200).json({ success: true, job, applications });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await getAllJobServices();
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

export const exportRoleApplicantsToCSV = async (req, res, next) => {
  const { roleId } = req.params;
  try {
    const { csv, companyName, roleName } = await exportRoleApplicantsToCSVService(roleId);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${companyName}-${roleName}-applicants.csv`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};