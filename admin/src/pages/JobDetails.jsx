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
  const [role, setRole] = useState(null);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/get/${jobId}`);
      if (data.success) {
        setJob(data.job);
        setRole(data.job.roles[0].name);
      } else toast.error(data.message || "Job not found");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    const selectedRole = job.roles.find((r) => r.name === role);
    if (!selectedRole) {
      return toast.error("No role found in job");
    }
    setAppliedStudents(selectedRole.applicants || []);
    console.log(selectedRole.applicants);
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/delete-job/${jobId}`);
      if (data.success) {
        toast.success("Job deleted successfully!");
        navigate("/jobs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job");
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
      link.setAttribute("download", `${job.companyName}-applicants.csv`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export CSV");
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    if (!role) return;
    handleRoleChange(role);
  }, [role]);

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

  const isExpired = new Date(job.lastDate) < new Date();

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-md w-full border border-gray-200">
        <Title text1="Job" text2="Details" />

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Company:</h2>
            <p className="mt-1">{job.companyName}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Title:</h2>
            <p className="mt-1">{job.title}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Description:</h2>
            <p className="mt-1 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Location:</h2>
            <p className="mt-1">{job.location || "Not specified"}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Last Date:</h2>
            <p
              className={`mt-1 font-medium ${isExpired ? "text-red-600" : ""}`}
            >
              {new Date(job.lastDate).toLocaleDateString()}
              {isExpired && " (Expired)"}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Roles:</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.roles.length === 0 ? (
                <span className="text-gray-500">No roles added</span>
              ) : (
                job.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 rounded-full bg-primary/20 text-primary text-sm font-medium"
                  >
                    {role.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
          onClick={handleDeleteJob}
        >
          Delete Job
        </button>
      </div>

      <div className="p-6 w-full bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <Title text1="Applied" text2="Students" />

          <div className="inline-flex items-center gap-2">
            <p>Select role :</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-1 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>
                Select a role
              </option>
              {job.roles.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead>
              <tr className="bg-primary text-left text-white">
                <th className="p-2 font-medium pl-5">Enrollment No.</th>
                <th className="p-2 font-medium">Name</th>
                <th className="p-2 font-medium">Branch</th>
                <th className="p-2 font-medium">Accepted Terms</th>
                <th className="p-2 font-medium">Applied At</th>
              </tr>
            </thead>

            <tbody>
              {appliedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No students applied for this role.
                  </td>
                </tr>
              ) : (
                appliedStudents.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
                    onClick={() =>
                      navigate(`/students/${item.student.user.enrollNumber}`)
                    }
                  >
                    <td className="p-2 pl-5">
                      {item.student.user.enrollNumber}
                    </td>
                    <td className="p-2">{item.student.fullName}</td>
                    <td className="p-2">{item.student.branch}</td>

                    <td className="p-2">{item.acceptedTerms ? "Yes" : "No"}</td>
                    <td className="p-2">
                      {new Date(item.appliedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button
            onClick={handleExportCSV}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
