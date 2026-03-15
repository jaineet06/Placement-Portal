import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    roleName: { type: String, required: true },
}, { timestamps: true })

const Role = mongoose.model("Role", roleSchema)
export default Role