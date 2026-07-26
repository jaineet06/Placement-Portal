import e from "express";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import {
  deleteStudent,
  getAddressByEnrollment,
  getEducation,
  getStudentByEnrollment,
  changeApplicationStatus,
  sendResetPasswordLink,
  updateStudentStatus,
} from "../controllers/admin.controller.js";

import { validate } from "../middlewares/validate.js";
import { validateParams } from "../middlewares/validateParams.js";

import {
  enrollmentParamSchema,
  userIdParamSchema,
  changeApplicationStatusSchema,
  updateStudentStatusSchema,
} from "../validations/admin.validation.js";
import { studentIdParamSchema } from "#validations/student.validation.js";

const adminRouter = e.Router();

// ✅ params validation
adminRouter.get(
  "/student/:id",
  authUser,
  authorizeRoles("admin"),
  validateParams(enrollmentParamSchema),
  getStudentByEnrollment,
);

adminRouter.get(
  "/address/:id",
  authUser,
  authorizeRoles("admin"),
  validateParams(enrollmentParamSchema),
  getAddressByEnrollment,
);

adminRouter.get(
  "/education/:userId",
  authUser,
  authorizeRoles("admin"),
  validateParams(userIdParamSchema),
  getEducation,
);

adminRouter.delete(
  "/delete/:userId",
  authUser,
  authorizeRoles("admin"),
  validateParams(userIdParamSchema),
  deleteStudent,
);

adminRouter.post(
  "/reset-pass/:userId",
  authUser,
  authorizeRoles("admin"),
  validateParams(userIdParamSchema),
  sendResetPasswordLink,
);

// ✅ body validation
adminRouter.post(
  "/job/change-status",
  authUser,
  authorizeRoles("admin"),
  validate(changeApplicationStatusSchema),
  changeApplicationStatus,
);

adminRouter.patch(
  "/student/:id/status",
  authUser,
  authorizeRoles("admin"),
  validateParams(studentIdParamSchema),
  validate(updateStudentStatusSchema),
  updateStudentStatus,
);

export default adminRouter;
