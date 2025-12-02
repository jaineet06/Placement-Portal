import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
   // enrollmentNo: { type: Number, unique: true, required: true },
    fullName: { type: String, required: true },
    parentName: { type: String, required: true },
    branch: { type: String, required: true },
    birthDate: { type: Date, required: true },
    category: { type: String, required: true },
    mobile: { type: String, required: true },
    alternateMobile: { type: String },
    parentMobile: { type: String, required: true },
    resume: {
        url: { type: String , default: "" },
        public_id: { type: String , default: "" }
    },
    profilePath: {
        url: { type: String , default: "" },
        public_id: { type: String , default: ""}
    },
}, { timestamps: true })

const Student = mongoose.model("student", studentSchema)

export default Student