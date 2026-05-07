import jwt from 'jsonwebtoken'
import sendMail from "#configs/nodemailer.js";
import { getSignupTemplate, getVerificationTemplate } from "#utils/mail-templates.js";

import {
    registerUserService,
    loginUserService,
    getUserProfileService,
    getAllUsersService,
    verifyUserService,
    deleteUnverifyUserService
} from "../services/user.service.js";


const registerUser = async (req, res) => {

    try {

        const data = req.validatedData;

        const user = await registerUserService(data);

        if (user?.error) {
            return res.status(409).json({
                success: false,
                message: user.error
            });
        }

        await sendMail({
            to: data.email,
            subject: "Registration Successful - Pending Verification",
            body: getSignupTemplate(data.name, data.email)
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('token', token, options)

        return res.status(201).json({
            success: true,
            message: "Registerd Succesfully!",
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified
            }
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const loginUser = async (req, res) => {

    const { email, password } = req.validatedData;

    try {
        const user = await loginUserService(email, password);

        if (user?.error) {
            return res.status(401).json({
                success: false,
                message: user.error
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login Sucessfully",
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.clearCookie("token", options);

        return res.status(200).json({ success: true, message: "Logout Succesfully!" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user

        const user = await getUserProfileService(id);

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();

        return res.status(200).json({ success: true, users })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const verifyUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await verifyUserService(id);

        if (user?.error) {
            return res.status(400).json({ success: false, message: user.error })
        }

        await sendMail({
            to: user.email,
            subject: "Portal Access Granted - You are Verified!",
            body: getVerificationTemplate(user.name)
        });

        return res.json({ success: true, message: "User verified succesfully" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}


const deleteUnverifyUser = async (req, res) => {
    const { id } = req.validatedParams;

    try {
        await deleteUnverifyUserService(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export {
    loginUser,
    logoutUser,
    registerUser,
    getUserProfile,
    getAllUsers,
    verifyUser,
    deleteUnverifyUser
};