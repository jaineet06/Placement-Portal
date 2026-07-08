
import jwt from "jsonwebtoken";
import sendMail from "#configs/nodemailer.js";
import { getSignupTemplate, getVerificationTemplate } from "#utils/mail-templates.js";
import {
    registerUserService,
    loginUserService,
    getUserProfileService,
    getAllUsersService,
    verifyUserService,
    deleteUnverifyUserService, resetPasswordService,
} from "../services/user.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = async (req, res, next) => {
  try {
    const user = await registerUserService(req.validatedData);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY,
       { expiresIn: "7d",}
    );
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      user: { email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.validatedData;
  try {
    const user = await loginUserService(email, password);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await verifyUserService(id);

    await sendMail({
      to: user.email,
      subject: "Portal Access Granted - You are Verified!",
      body: getVerificationTemplate(user.name),
    });

    res.status(200).json({ success: true, message: "User verified successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUnverifyUser = async (req, res, next) => {
  const { id } = req.validatedParams;
  try {
    await deleteUnverifyUserService(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
    const {password} = req.validatedData
    const {token, userId} = req.body
    try{
        await resetPasswordService(userId, token, password);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    }catch (e) {
        next(e);
    }
}

export { loginUser, logoutUser, registerUser, getUserProfile, getAllUsers, verifyUser, deleteUnverifyUser, resetPassword };