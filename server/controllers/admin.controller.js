
import Address from "../models/address.model.js";
import Education from "../models/education.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import Job from "../models/job.model.js";




const getStudentByEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    // First find user by enrollNumber
    const user = await User.findOne({ enrollNumber: id });
    if (!user) {
      return res.json({ success: false, message: "No Student found" });
    }

    // Then find student by user ID
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




// Get all jobs (for Admin Job Listing)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Fetch Jobs Error:", error.message);
    res.json({ success: false, message: "Server Error" });
  }
};


//get a single job by Id:
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


//create job :
const createJob = async (req, res) => {
  try {
    const { name, roles, title, description, lastDate, location } = req.body;

    if (!name || !title || !description || !lastDate) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!roles || roles.length === 0) {
      return res.json({
        success: false,
        message: "At least one role is required",
      });
    }

    const roleObject = roles.map((item) => ({
      name: item,
      applicants: [],
    }));

    await Job.create({
      companyName: name,
      title,
      description,
      lastDate,
      location,
      roles: roleObject,
    });

    res.json({ success: true, message: "Job created successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//delete a job a ID:
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

//Change Status for the job
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
};
