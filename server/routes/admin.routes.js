import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { deleteStudent, getAddressByEnrollment, getEducation, getStudentByEnrollment, createJob, getAllJobs, getJobById, deleteJob, changeStatus } from "../controllers/admin.controller.js";

const adminRouter = e.Router()

adminRouter.get('/student/:id', authUser, authorizeRoles('admin'), getStudentByEnrollment)
adminRouter.get('/address/:id', authUser, authorizeRoles('admin'), getAddressByEnrollment)
adminRouter.get('/education/:userId', authUser, authorizeRoles('admin'), getEducation)
adminRouter.delete('/delete/:userId', authUser, authorizeRoles('admin'), deleteStudent)

//Create Job
adminRouter.post("/create", authUser, authorizeRoles("admin"), createJob);
// All jobs
adminRouter.get("/get-all", authUser, authorizeRoles("admin"), getAllJobs);
// Single Job
adminRouter.get("/get/:jobId", authUser, authorizeRoles("admin"), getJobById);
//Delete job by id
adminRouter.delete("/delete-job/:jobId", authUser, authorizeRoles("admin"), deleteJob);
// Update job status
adminRouter.post("/update-status/:jobId", authUser, authorizeRoles("admin"), changeStatus)


export default adminRouter