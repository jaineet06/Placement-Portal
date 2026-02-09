import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
            required: true,
            index: true,
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true,
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
            index: true,
        },

        acceptedTerms: {
            type: Boolean,
            required: true,
        },

        status: {
            type: String,
            enum: ["In Consideration", "Selected", "Rejected"],
            default: "In Consideration",
            index: true,
        },

        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

applicationSchema.index(
    { student: 1, job: 1, role: 1 },
    { unique: true }
);

const Application = mongoose.model("application", applicationSchema);
export default Application;
