import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import {
    deleteStudent, getAddressByEnrollment, getEducation, getStudentByEnrollment, changeApplicationStatus,
    sendResetPasswordLink ,   blockStudent, unblockStudent
} from "../controllers/admin.controller.js";

import { validate } from "../middlewares/validate.js";
import { validateParams } from "../middlewares/validateParams.js";

import {enrollmentParamSchema,userIdParamSchema,changeApplicationStatusSchema} from "../validations/admin.validation.js";

const adminRouter = e.Router()

// ✅ params validation
adminRouter.get('/student/:id',authUser,authorizeRoles('admin'),validateParams(enrollmentParamSchema),getStudentByEnrollment)

adminRouter.get('/address/:id',authUser,authorizeRoles('admin'),validateParams(enrollmentParamSchema),getAddressByEnrollment)

adminRouter.get('/education/:userId',authUser,authorizeRoles('admin'),validateParams(userIdParamSchema),getEducation)

adminRouter.delete('/delete/:userId',authUser,authorizeRoles('admin'),validateParams(userIdParamSchema),deleteStudent)

adminRouter.post('/reset-pass/:userId', authUser, authorizeRoles('admin'), validateParams(userIdParamSchema), sendResetPasswordLink)

// ✅ body validation
adminRouter.post("/job/change-status",authUser,authorizeRoles("admin"),validate(changeApplicationStatusSchema),changeApplicationStatus)


adminRouter.patch(
    "/block/:userId",
    authUser,
    authorizeRoles("admin"),
    validateParams(userIdParamSchema),
    blockStudent
);

adminRouter.patch(
    "/unblock/:userId",
    authUser,
    authorizeRoles("admin"),
    validateParams(userIdParamSchema),
    unblockStudent
);

export default adminRouter