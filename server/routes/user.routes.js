import express from "express";
import {
    deleteUnverifyUser,
    getAllUsers,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    verifyUser
} from "../controllers/user.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { userSchema, loginSchema, idParamSchema, resetPasswordSchema } from "#validations/user.validation.js";
import { validateParams } from "../middlewares/validateParams.js";
import { loginRateLimiter } from "#middlewares/rateLimiter.js";


const userRouter = express.Router()

userRouter.post('/register', validate(userSchema), registerUser)

userRouter.post('/login', loginRateLimiter, validate(loginSchema), loginUser)
userRouter.get('/logout', logoutUser)
userRouter.get('/get-profile', authUser, getUserProfile)
userRouter.get('/get-all', authUser, authorizeRoles("admin"), getAllUsers)
userRouter.post('/verify-user', authUser, authorizeRoles("admin"), verifyUser)
userRouter.post('/reset-pass', loginRateLimiter, validate(resetPasswordSchema), resetPassword)
userRouter.get("/me", authUser, getUserProfile);

userRouter.delete('/verify/delete/:id', validateParams(idParamSchema), authUser, authorizeRoles("admin"), deleteUnverifyUser)


export default userRouter