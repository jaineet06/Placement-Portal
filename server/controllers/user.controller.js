import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

//Student register
const registerUser = async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Enter all credentials properly!" })
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User already exists" })
        }

        const user = new User({
            name,
            email,
            password,
            role: 'student'
        })
        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        }

        res.cookie('token', token,
            options
        )

        return res.status(200).json({ success: true, message: "Registerd Succesfully!" })
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
}

//Login
const loginUser = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Enter all credentials properly!" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Wrong password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        }

        res.cookie('token', token,
            options
        )

        return res.status(200).json({ success: true, message: "Login Sucessfully", user: { email: user.email, name: user.name, role: user.role } })

    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
}

//Logout
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        return res.status(200).json({ success: true, message: "Logout Succesfully!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select("-password")

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Teacher register
const createTeacher = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Enter all credentials properly!" })
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User already exists" })
        }

        const user = new User({
            name,
            email,
            password,
            isVerified: true,
            role: 'teacher'
        })
        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
        }

        res.cookie('token', token,
            options
        )

        return res.status(200).json({ success: true, message: "Registerd Succesfully!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export { loginUser, logoutUser, registerUser, createTeacher, getUserProfile }