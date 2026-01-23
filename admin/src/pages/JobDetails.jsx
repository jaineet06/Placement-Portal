import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { axios } = useAdminContext();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [role, setRole] = useState("");

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/get/${jobId}`);
      if (data.success) {
        setJob(data.job);
        if (data.job.roles && data.job.roles.length > 0) {
          setRole(data.job.roles[0].name);
        }
      } else {
        toast.error(data.message || "Job not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (studentUserId, newStatus) => {
    try {
      const { data } = await axios.post(`/api/admin/job/change-status`, {
        id: studentUserId,
        jobId,
        status: newStatus,
      });

      if (data.success) {
        toast.success("Status updated successfully");
        setAppliedStudents((prev) =>
          prev.map((item) =>
            item.student.user._id === studentUserId
              ? { ...item, currentStatus: newStatus }
              : item
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = (selectedRoleName) => {
    if (!job) return;
    const selectedRole = job.roles.find((r) => r.name === selectedRoleName);
    if (selectedRole) {
      const processedApplicants = selectedRole.applicants.map((app) => {
        const matchingJob = app.student.appliedJobs.find(
          (aj) => aj.job === jobId
        );
        return {
          ...app,
          currentStatus: matchingJob ? matchingJob.status : "In Consideration",
        };
      });
      setAppliedStudents(processedApplicants);
    }
  };

  const handleExportCSV = async () => {
    if (!role) return toast.error("Please select a role");
    try {
      const { data } = await axios.get(`/api/admin/export/${jobId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${job.companyName}-${role}-applicants.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/delete-job/${jobId}`);
      if (data.success) {
        toast.success("Job deleted");
        navigate("/jobs");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    if (role) handleRoleChange(role);
  }, [role, job]);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Spinner />
      </div>
    );
  if (!job) return <div className="text-center mt-10">Job not found</div>;

  const isExpired = new Date(job.lastDate) < new Date();

  return (
    <div className="flex flex-col w-full gap-6 p-4">
      
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <Title text1="Job" text2="Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-medium text-lg">{job.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-medium text-lg">{job.title}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p>{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Deadline</p>
            <p className={isExpired ? "text-red-500 font-bold" : ""}>
              {new Date(job.lastDate).toLocaleDateString()}{" "}
              {isExpired && "(Expired)"}
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteJob}
          className="mt-6 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-600 hover:text-white transition-all"
        >
          Delete Job
        </button>
      </div>

      
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <Title text1="Applied" text2="Students" />
          <div className="flex gap-4 items-center">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-all"
            >
              Export CSV
            </button>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded-md bg-gray-50 shadow-sm outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {job.roles.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 pl-5">Enrollment No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    No applicants found.
                  </td>
                </tr>
              ) : (
                appliedStudents.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/students/${item.student.user.enrollNumber}`)
                    }
                  >
                    <td className="p-3 pl-5 font-medium">
                      {item.student.user.enrollNumber}
                    </td>
                    <td className="p-3">{item.student.fullName}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {item.student.branch}
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(item.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.currentStatus}
                        onChange={(e) =>
                          handleStatusUpdate(
                            item.student.user._id,
                            e.target.value
                          )
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer outline-none ${
                          item.currentStatus === "Selected"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : item.currentStatus === "Rejected"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-blue-100 text-blue-700 border-blue-300"
                        }`}
                      >
                        <option value="In Consideration">
                          In Consideration
                        </option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
