import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    enrollNumber:{
     type: String ,
     required: true, unique: true ,minlength : 12, maxlenght: 12,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], required: true },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        console.log(error.message);
    }
})

const User = mongoose.model('user', userSchema)
export default User