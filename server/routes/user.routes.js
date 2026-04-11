import express from "express";
import { deleteUnverifyUser, getAllUsers, getUserProfile, loginUser, logoutUser, registerUser, verifyUser } from "../controllers/user.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchema , loginSchema , idParamSchema} from "#validations/user.validation.js";
import { validateParams } from "../middleware/validateParams.js";


const userRouter = express.Router()

userRouter.post('/register', validate(userSchema),registerUser)

userRouter.post('/login', validate(loginSchema) , loginUser)
userRouter.get('/logout', logoutUser)
userRouter.get('/get-profile', authUser, getUserProfile)
userRouter.get('/get-all', authUser, authorizeRoles("admin"), getAllUsers)
userRouter.post('/verify-user', authUser, authorizeRoles("admin"), verifyUser)

userRouter.get("/me", authUser, getUserProfile);

userRouter.delete('/verify/delete/:id',validateParams(idParamSchema), authUser, authorizeRoles("admin"), deleteUnverifyUser)


export default userRouter