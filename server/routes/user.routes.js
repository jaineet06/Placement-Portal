import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.js";

const userRouter = express.Router()

//Student routes
userRouter.post('/register', registerUser)

userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUser)
userRouter.get('/get-profile', authUser, getUserProfile)

export default userRouter