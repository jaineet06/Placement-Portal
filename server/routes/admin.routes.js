import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { deleteStudent, getAddressByEnrollment, getEducation, getStudentByEnrollment } from "../controllers/admin.controller.js";

const adminRouter = e.Router()

adminRouter.get('/student/:id', authUser, authorizeRoles('admin'), getStudentByEnrollment)
adminRouter.get('/address/:id', authUser, authorizeRoles('admin'), getAddressByEnrollment)
adminRouter.get('/education/:userId', authUser, authorizeRoles('admin'), getEducation)
adminRouter.delete('/delete/:userId', authUser, authorizeRoles('admin'), deleteStudent)

export default adminRouter