import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";

const JobDetails = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const { axios } = useAdminContext();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  //  Fetch single job details
  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/get/${jobId}`);
      if (data.success) {
        setJob(data.job);
      } else {
        toast.error(data.message || "Job not found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  //  DELETE JOB FUNCTION
  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/delete-job/${jobId}`);
      if (data.success) {
        toast.success("Job deleted successfully!");
        navigate("/jobs"); // Redirect to job listing page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl font-medium">Job not found</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
          onClick={() => navigate("/jobs")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full border border-gray-200">
      <Title text1="Job" text2="Details" />

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-medium">Title:</h2>
          <p className="mt-1">{job.title}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Description:</h2>
          <p className="mt-1">{job.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Location:</h2>
          <p className="mt-1">{job.location || "Not specified"}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Last Date:</h2>
          <p className="mt-1">{new Date(job.lastDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Created At:</h2>
          <p className="mt-1">{new Date(job.createdAt).toLocaleString()}</p>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back to Jobs
        </button>

        {/*  DELETE BUTTON  */}
        <button
          className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
          onClick={handleDeleteJob}
        >
          Delete Job
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
