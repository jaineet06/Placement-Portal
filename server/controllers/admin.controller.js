
import Address from "../models/address.model.js";
import Education from "../models/education.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import Job from "../models/job.model.js";
import { Parser } from "json2csv"

const getStudentByEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    
    const user = await User.findOne({ enrollNumber: id });
    if (!user) {
      return res.json({ success: false, message: "No Student found" });
    }

    
    const isStudent = await Student.findOne({ user: user._id }).populate(
      "user",
      "name email phone enrollNumber"
    );

    if (!isStudent) {
      return res.json({ success: false, message: "No Student found" });
    }

    return res.json({
      success: true,
      message: "Student fetched successfully",
      student: isStudent,
    });
  } catch (error) {
    console.error("Create Student Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};




const getAddressByEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ enrollNumber: id });
    if (!user) {
      return res.json({ success: false, message: "No Student found" });
    }

    const addresses = await Address.find({ user: user._id });

    if (!addresses || addresses.length === 0) {
      return res.json({ success: false, message: "No Address found" });
    }

    const formatted = { permanent: {}, current: {} };

    for (let add of addresses) {
      if (add.type === "permanent") formatted.permanent = add;
      if (add.type === "current") formatted.current = add;
    }

    return res.json({ success: true, address: formatted });
  } catch (error) {
    console.error("Address Fetch Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};




const getEducation = async (req, res) => {
  const { userId } = req.params;

  try {
    const education = await Education.findOne({ user: userId });

    if (!education) {
      return res.json({ success: false, message: "No education data found" });
    }

    return res.json({ success: true, education });
  } catch (error) {
    console.error("Education Fetch Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};




const deleteStudent = async (req, res) => {
  const { userId } = req.params;

  try {
    const student = await Student.findOne({ user: userId });

    if (student) {
      if (student.profilePath?.public_id) {
        await deleteFromCloudinary(student.profilePath.public_id, "image");
      }

      if (student.resume?.public_id) {
        await deleteFromCloudinary(student.resume.public_id, "raw");
      }
    }

    await User.findByIdAndDelete(userId);
    await Student.findOneAndDelete({ user: userId });
    await Address.deleteMany({ user: userId });
    await Education.findOneAndDelete({ user: userId });

    return res.json({
      success: true,
      message: "Student and related data deleted successfully",
    });
  } catch (error) {
    console.error("Student Delete Error:", error.message);
    return res.json({ success: false, message: "Server Error" });
  }
};





const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Fetch Jobs Error:", error.message);
    res.json({ success: false, message: "Server Error" });
  }
};



const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate({
        path: "roles.applicants.student",
        populate: {
          path: "user",
          model: "user",
          select: "enrollNumber",
        },
      });


    if (!job) return res.json({ success: false, message: "Job not found!" });

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};


const createJob = async (req, res) => {
  try {
    const {
      name,
      roles,
      title,
      description,
      lastDate,
      location,
      jobType,
      rounds,
      recruiter
    } = req.body;

    if (!name || !title || !description || !lastDate || !jobType) {
      return res.json({
        success: false,
        message: "Main job details are missing",
      });
    }

    if (!recruiter || !recruiter.hrName || !recruiter.email || !recruiter.contact) {
      return res.json({
        success: false,
        message: "Recruiter contact details are required",
      });
    }

    if (!roles || roles.length === 0) {
      return res.json({
        success: false,
        message: "At least one role is required",
      });
    }

    if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
      return res.json({
        success: false,
        message: "At least one round is required",
      });
    }

    const roleObject = roles.map((item) => ({
      name: item,
      applicants: [],
    }));

    const newJob = await Job.create({
      companyName: name,
      title,
      description,
      lastDate,
      location,
      jobType,
      rounds,
      roles: roleObject,
      recruiter: {
        hrName: recruiter.hrName.trim(),
        email: recruiter.email.toLowerCase().trim(),
        contact: recruiter.contact.trim(),
      }
    });

    return res.json({
      success: true,
      message: "Job created successfully!",
      jobId: newJob._id
    });

  } catch (error) {
    console.error("Create Job Error:", error.message);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const deleted = await Job.findByIdAndDelete(jobId);

    if (!deleted) {
      return res.json({ success: false, message: "Job not found!" });
    }

    await Student.updateMany({}, { $pull: { job: jobId } })

    res.json({ success: true, message: "Job deleted successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const changeStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.json({
        success: false,
        message: "Provide a status to change",
      });
    }

    await Job.findByIdAndUpdate(jobId, { status }, { runValidators: true });

    res.json({
      success: true,
      message: `Job status updated to ${status}`,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const exportAppliedStudentToCSV = async (req, res) => {
  const { jobId } = req.params

  try {

    const job = await Job.findById(jobId).populate({
      path: "roles.applicants.student",
      populate: {
        path: "user",
        select: "name email enrollNumber"
      }
    });

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    const appliedList = []

    job.roles.forEach(role => {
      role.applicants.forEach(app => {
        if (!app.student || !app.student.user) return;

        appliedList.push({
          enrollNumber: app.student.user.enrollNumber,
          name: app.student.fullName,
          email: app.student.user.email,
          branch: app.student.branch,
          resume: app.student.resume.url,
          role: role.name,
          acceptedTerm: app.acceptedTerms ? "Yes" : "No",
          appliedAt: app.appliedAt,
        })
      })
    })

    if (appliedList.length === 0) {
      return res.json({ success: false, message: "No applicants found" });
    }

    const fields = [
      { label: "Enrollment No.", value: "enrollNumber" },
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Branch", value: "branch" },
      { label: "resume", value: "resume" },
      { label: "Role", value: "role" },
      { label: "Accepted Terms", value: "acceptedTerm" },
      { label: "Applied At", value: "appliedAt" },
    ]

    const parser = new Parser({ fields })
    const csv = parser.parse(appliedList)

    res.header("Content-Type", "text/csv")
    res.attachment(`${job.companyName}-applicants.csv`)
    res.send(csv)
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to export CSV" });
  }



}



const changeApplicationStatus = async (req, res) => {

  const { status, jobId, id } = req.body
  try {

    console.log(id);
    console.log(jobId);

    const updatedStudent = await Student.findOneAndUpdate(
      {
        user: id,
        "appliedJobs.job": jobId
      },
      {
        $set: { "appliedJobs.$.status": status }
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.json({
        success: false,
        message: "Student or Job application not found."
      });
    }

    return res.json({
      success: true,
      message: "Status updated successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server Error" });
  }
}

export {
  getStudentByEnrollment,
  getAddressByEnrollment,
  getEducation,
  deleteStudent,
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  changeStatus,
  exportAppliedStudentToCSV,
  changeApplicationStatus
};
