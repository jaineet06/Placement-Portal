import e from "express"
import { authorizeRoles, authUser } from "../middlewares/auth.js"
import { changeStatus, createJob, deleteJob, exportRoleApplicantsToCSV, getAllJobs, getJobById } from "#controllers/job.controller.js"

const jobRouter = e.Router()

jobRouter.post("/create", authUser, authorizeRoles("admin"), createJob)
jobRouter.delete("/delete/:jobId", authUser, authorizeRoles("admin"), deleteJob)
jobRouter.put("/change-status/:jobId", authUser, authorizeRoles("admin"), changeStatus)
jobRouter.get("/get/:jobId", authUser, authorizeRoles("admin"), getJobById)
jobRouter.get("/get-all", authUser, authorizeRoles("admin"), getAllJobs)
jobRouter.get("/export/:roleId", authUser, authorizeRoles("admin"), exportRoleApplicantsToCSV)

export default jobRouter