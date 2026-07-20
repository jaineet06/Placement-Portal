import e from "express"
import { authorizeRoles, authUser } from "../middlewares/auth.js"
import { changeStatus, createJob, deleteJob, exportRoleApplicantsToCSV, getAllJobs, getJobById } from "#controllers/job.controller.js"
import { validate } from "#middlewares/validate.js"
import { changeJobStatusSchema, createJobSchema } from "#validations/job.validation.js"

const jobRouter = e.Router()

jobRouter.post("/create", authUser, authorizeRoles("admin"), validate(createJobSchema), createJob)
jobRouter.delete("/delete/:jobId", authUser, authorizeRoles("admin"), deleteJob)
jobRouter.put("/change-status/:jobId", authUser, authorizeRoles("admin"), validate(changeJobStatusSchema), changeStatus)
jobRouter.get("/get/:jobId", authUser, authorizeRoles("admin"), getJobById)
jobRouter.get("/get-all", authUser, authorizeRoles("admin"), getAllJobs)
jobRouter.get("/export/:roleId", authUser, authorizeRoles("admin"), exportRoleApplicantsToCSV)

export default jobRouter