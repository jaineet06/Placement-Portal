import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  Plus,
  Search,
} from "lucide-react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

const JobListing = () => {
  const { axios } = useAdminContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/job/get-all");
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    setStatusLoading((prev) => ({ ...prev, [jobId]: true }));
    try {
      const { data } = await axios.put(`/api/job/change-status/${jobId}`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success("Job status updated");
        setJobs((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return loading ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Spinner />
      <p className="text-sm mt-2 font-normal">Fetching jobs...</p>
    </div>
  ) : (
    <div className="p-8 space-y-10 max-w-6xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Briefcase size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Job <span className="text-primary italic">Inventory</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Manage and monitor current career opportunities
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/create-job")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-200 cursor-pointer"
        >
          <Plus size={18} /> Create Job
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-4 px-8 shadow-sm flex items-center group focus-within:ring-4 focus-within:ring-primary/10 transition-all">
        <Search
          className="text-slate-400 group-focus-within:text-primary transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Filter by company or designation..."
          className="w-full px-4 py-2 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <Briefcase size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-500 font-bold">
            No jobs matching your criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    Organization
                  </th>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    Role Details
                  </th>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    Deadline
                  </th>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    onClick={() => navigate(`/job/get/${job._id}`)}
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-slate-100">
                          <Building2 size={20} />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">
                          {job.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-0.5">
                        <p className="font-black text-slate-900 text-base tracking-tight">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <MapPin size={12} /> {job.location || "Not specified"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">
                      {new Date(job.lastDate).toLocaleDateString()}
                    </td>
                    <td
                      className="px-8 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center">
                        <select
                          value={job.status}
                          onChange={(e) =>
                            handleStatusChange(job._id, e.target.value)
                          }
                          disabled={statusLoading[job._id]}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all ${
                            job.status === "Open"
                              ? "bg-green-50 border-green-100 text-green-600"
                              : "bg-red-50 border-red-100 text-red-600"
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;
