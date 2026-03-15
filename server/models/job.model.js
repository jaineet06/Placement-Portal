import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    recruiter: {
      hrName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      contact: { type: String, required: true },
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    rounds: [{
      type: String, required: true
    }],
    description: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full Time", "Internship", "Internship + FTE"],
      required: true,
    },

    roles: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }
      }
    ],

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    lastDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "Not Specified",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
