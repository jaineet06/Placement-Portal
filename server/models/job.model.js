import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    roles: [
      {
        name: {
          type: String,
          required: true,
        },
        applicants: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
          },
        ],
      },
    ],
    status: { type: String, required: true, default: "Open", enum: ["Open", "Closed"] },
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
