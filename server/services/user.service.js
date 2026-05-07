import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUserService = async (data) => {

    const userExists = await User.findOne({
        enrollNumber: data.enrollNumber,
        email: data.email
    });

    if (userExists) {
        return { error: "User already exists" };
    }

    const user = new User({
        ...data,
        role: "student"
    });

    await user.save();

    return user;
};


export const loginUserService = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) return { error: "Invalid credentials" };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { error: "Invalid credentials" };

    return user;
};


export const getUserProfileService = async (userId) => {
    const user = await User.findById(userId).select("-password");
    return user;
};


export const getAllUsersService = async () => {
    const users = await User.find({ isVerified: false }).select("-password");
    return users;
};


export const verifyUserService = async (userId) => {

    const user = await User.findById(userId);

    if (!user) return { error: "User not found" };

    if (user.isVerified) {
        return { error: "User is already verified" };
    }

    user.isVerified = true;
    await user.save();

    return user;
};


export const deleteUnverifyUserService = async (userId) => {
    await User.findByIdAndDelete(userId);
    return true;
};