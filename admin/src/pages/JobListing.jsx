import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const JobListing = () => {
  const { axios } = useAdminContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const navigate = useNavigate();

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/get-all");
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update job status
  const handleStatusChange = async (jobId, newStatus) => {
    setStatusLoading((prev) => ({ ...prev, [jobId]: true }));
    try {
      const { data } = await axios.post(`/api/admin/update-status/${jobId}`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success("Job status updated");
        setJobs((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error while updating status");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Fetching jobs...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between z-0">
        <Title text1="Open" text2="Jobs" />
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-2xl font-medium">No jobs available</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
            onClick={() => navigate("/create-job")}
          >
            Create Job
          </button>
        </div>
      ) : (
        <div className="max-w-full mt-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead>
              <tr className="bg-primary text-left text-white">
                <th className="p-2 font-medium pl-5">Company</th>
                <th className="p-2 font-medium pl-5">Title</th>
                <th className="p-2 font-medium">Location</th>
                <th className="p-2 font-medium">Last Date</th>
                <th className="p-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  <td className="p-2 pl-5">{job.companyName}</td>
                  <td className="p-2 pl-5">{job.title}</td>
                  <td className="p-2">{job.location || "Not specified"}</td>
                  <td className="p-2">
                    {new Date(job.lastDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job._id, e.target.value)
                      }
                      disabled={statusLoading[job._id]}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-2 py-1 rounded text-sm font-medium cursor-pointer border focus:outline-none ${
                        job.status === "Open"
                          ? "bg-green-100 border-green-400 text-green-600"
                          : "bg-red-100 border-red-500 text-red-700"
                      }`}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default JobListing;
