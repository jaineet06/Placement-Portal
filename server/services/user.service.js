import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

export const registerUserService = async (data) => {
  const userExists = await User.findOne({ enrollNumber: data.enrollNumber, email: data.email });
  if (userExists) throw new AppError("User already exists with this email or enrollment number", 409);

  const user = await User.create({ ...data, role: "student" });
  return user;
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  return user;
};

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const getAllUsersService = async () => {
  const users = await User.find({ isVerified: false }).select("-password");
  return users;
};

export const verifyUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified) throw new AppError("User is already verified", 400);

  user.isVerified = true;
  await user.save();
  return user;
};

export const deleteUnverifyUserService = async (userId) => {
  await User.findByIdAndDelete(userId);
};

export const resetPasswordService = async (userId, token, password) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.resetPasswordToken !== token) {
    throw new AppError("Invalid Token", 400);
  }

  if (user.resetPasswordExpiresIn < new Date()) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresIn = undefined
    await user.save()
    throw new AppError("Token Expired", 400);
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpiresIn = undefined

  await user.save();

}