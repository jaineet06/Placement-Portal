import e from "express"
import { authorizeRoles, authUser } from "../middlewares/auth.js"
import { changeStatus, createJob, deleteJob, getJobById } from "#controllers/job.controller.js"

const jobRouter = e.Router()

jobRouter.post("/create", authUser, authorizeRoles("admin"), createJob)
jobRouter.delete("/delete/:jobId", authUser, authorizeRoles("admin"), deleteJob)
jobRouter.put("/change-status/:jobId", authUser, authorizeRoles("admin"), changeStatus)
jobRouter.get("/get/:jobId", authUser, authorizeRoles("admin"), getJobById)

export default jobRouter