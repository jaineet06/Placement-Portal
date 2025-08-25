import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { getStudentByEnrollment } from "../controllers/admin.controller.js";

const adminRouter = e.Router()

adminRouter.get('/student/:id', authUser, authorizeRoles('admin'), getStudentByEnrollment)

export default adminRouter