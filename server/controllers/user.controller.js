import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { userSchema } from "#validations/user.validation.js";

import sendMail from "#configs/nodemailer.js";
import { getSignupTemplate, getVerificationTemplate } from "#utils/mail-templates.js";

const registerUser = async (req, res) => {

    try {

        // const validationResult = userSchema.safeParse(req.body)

        // if (!validationResult.success) {
        //     return res.status(400).json({
        //         success: false,
        //         message: validationResult.error.format()
        //     })
        // }

        const data = req.validatedData; 

        const userExists = await User.findOne({
            enrollNumber: data.enrollNumber,
            email: data.email
        });

         if( userExists){
            return res.status(409).json({
                success: false,
                message : "User already exists"
            })
         }

        const user = new User({
            ...data,
            role: 'student'
        })
        await user.save()

        await sendMail({
            to: data.email, subject: "Registration Successful - Pending Verification", body: getSignupTemplate(data.name, data.email)
        })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('token', token,
            options
        )

        return res.json({ success: true, message: "Registerd Succesfully!", user: { email: user.email, name: user.name, role: user.role, isVerified: user.isVerified } })
    }
    catch (error) {
        res.json({ message: 'Server error', error: error.message });
    }
}


const loginUser = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ success: false, message: "Enter all credentials properly!" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Wrong password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('token', token,
            options
        )

        return res.json({ success: true, message: "Login Sucessfully", user: { email: user.email, name: user.name, role: user.role, isVerified: user.isVerified } })

    } catch (error) {
        res.json({ msg: 'Server error', error: error.message });
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

        return res.json({ success: true, message: "Logout Succesfully!" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select("-password")

        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { id } = req.user
        const users = await User.find({ isVerified: false }).select("-password")

        return res.json({ success: true, users })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

const verifyUser = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findById(id);
        if (user.isVerified) {
            return res.json({ success: false, message: "User is already verified" })
        }

        user.isVerified = true
        await user.save();

        await sendMail({ to: user.email, subject: "Portal Access Granted - You are Verified!", body: getVerificationTemplate(user.name) })

        return res.json({ success: true, message: "User verified succesfully" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

const deleteUnverifyUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        await User.findByIdAndDelete(id);
        return res.json({ success: true, message: "User deleted succesfully" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Internal Server Error" })
    }
}

export { loginUser, logoutUser, registerUser, getUserProfile, getAllUsers, verifyUser, deleteUnverifyUser }