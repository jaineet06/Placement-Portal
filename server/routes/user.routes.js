import express from "express";
import { getAllUsers, getUserProfile, loginUser, logoutUser, registerUser, verifyUser} from "../controllers/user.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.js";

const userRouter = express.Router()

//Student routes
userRouter.post('/register', registerUser)

userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUser)
userRouter.get('/get-profile', authUser, getUserProfile)
userRouter.get('/get-all', authUser, authorizeRoles("admin"), getAllUsers)
userRouter.post('/verify-user', authUser, authorizeRoles("admin"), verifyUser)

export default userRouter