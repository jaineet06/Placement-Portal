import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { deleteStudent, getAddressByEnrollment, getEducation, getStudentByEnrollment,createJob ,getAllJobs,getJobById,deleteJob } from "../controllers/admin.controller.js";

const adminRouter = e.Router()

adminRouter.get('/student/:id', authUser, authorizeRoles('admin'), getStudentByEnrollment)
adminRouter.get('/address/:id', authUser, authorizeRoles('admin'), getAddressByEnrollment)
adminRouter.get('/education/:userId', authUser, authorizeRoles('admin'), getEducation)
adminRouter.delete('/delete/:userId', authUser, authorizeRoles('admin'), deleteStudent)

//  Admin Creates Job
adminRouter.post("/create", authUser, authorizeRoles("admin"), createJob);
// Admin can view all jobs
adminRouter.get("/get-all", authUser, authorizeRoles("admin"), getAllJobs);
//  Admin Can View Single Job
adminRouter.get("/get/:jobId", authUser, authorizeRoles("admin"), getJobById);
//Admin can delete single-job by id:
adminRouter.delete("/delete-job/:jobId", authUser, authorizeRoles("admin"), deleteJob);


export default adminRouter