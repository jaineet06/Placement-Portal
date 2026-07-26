import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Download,
  Trash2,
  ChevronLeft,
  Mail,
  Phone,
  User,
  Briefcase,
  GitMerge,
  ExternalLink,
  Search,
} from "lucide-react";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { axios } = useAdminContext();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [exportStatus, setExportStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/job/get/${jobId}`);
      if (data.success) {
        setJob(data.job);
        setApplications(data.applications ?? []);
        if (data.job?.roles?.length > 0 && data.job.roles[0].id?._id) {
          setSelectedRoleId(data.job.roles[0].id._id);
        } else {
          setSelectedRoleId("");
        }
      } else {
        toast.error(data.message || "Job not found");
      }
    } catch (error) {
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, roleId, newStatus) => {
    try {
      const { data } = await axios.post(`/api/admin/job/change-status`, {
        userId,
        jobId,
        roleId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Status updated successfully");
        setApplications((prev) =>
          prev.map((item) =>
            String(item.user?._id) === String(userId) &&
            String(item.role?._id) === String(roleId)
              ? { ...item, status: newStatus }
              : item,
          ),
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleExportCSV = async () => {
    if (!selectedRoleId) return toast.error("Please select a role");
    try {
      const { data } = await axios.get(`/api/job/export/${selectedRoleId}`, {
        params: {
          status: exportStatus,
        },
        responseType: "blob",
      });
      const selectedRole = job?.roles?.find(
        (r) => String(r.id?._id) === String(selectedRoleId),
      );
      const roleName = selectedRole?.id?.roleName ?? "applicants";
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${job.companyName}-${roleName}-${exportStatus}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      try {
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          const err = JSON.parse(text);
          toast.error(err.message || "Failed to export CSV");
        } else {
          toast.error(error.response?.data?.message || "Failed to export CSV");
        }
      } catch {
        toast.error("Failed to export CSV");
      }
    }
  };

  const filteredApplicants = applications.filter((app) => {
    const matchesRole =
      !selectedRoleId || String(app.role?._id) === String(selectedRoleId);

    const matchesStatus = exportStatus === "all" || app.status === exportStatus;

    const term = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      app.student?.fullName?.toLowerCase().includes(term) ||
      app.user?.enrollNumber?.toLowerCase().includes(term);

    return matchesRole && matchesStatus && matchesSearch;
  });
  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const { data } = await axios.delete(`/api/job/delete/${jobId}`);
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

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Spinner />
      </div>
    );
  if (!job)
    return (
      <div className="text-center p-20 font-bold text-slate-400">
        Job not found
      </div>
    );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-all w-fit"
        >
          <ChevronLeft size={20} /> Back to Openings
        </button>
        <button
          onClick={handleDeleteJob}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
        >
          <Trash2 size={18} /> Delete Opening
        </button>
      </div>

      {/* Main Job Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Building2 size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  <p className="text-primary font-bold italic">
                    {job.companyName}
                  </p>
                </div>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  job.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} /> Location
                </p>
                <p className="font-bold text-slate-700">{job.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase size={12} /> Type
                </p>
                <p className="font-bold text-slate-700">{job.jobType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} /> Deadline
                </p>
                <p className="font-bold text-slate-700">
                  {new Date(job.lastDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">
                Job Description
              </p>
              <div
                className="bg-slate-50 p-6 rounded-2xl text-slate-600 prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <GitMerge size={16} className="text-primary" /> Recruitment Path
              </h3>
              <div className="flex flex-wrap gap-3">
                {job.rounds.map((round, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 border border-slate-200"
                  >
                    {i + 1}. {round}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recruiter Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16" />
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
              <User size={20} className="text-primary" /> Recruiter Info
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    HR Manager
                  </p>
                  <p className="font-bold">{job.recruiter.hrName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="font-bold break-all">{job.recruiter.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Contact Number
                  </p>
                  <p className="font-bold">{job.recruiter.contact}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Applicants
            </p>
            <h4 className="text-5xl font-black text-slate-900">
              {applications.length}
            </h4>
          </div>
        </div>
      </div>

      {/* Applicant Management Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users size={24} className="text-primary" /> Application{" "}
            <span className="text-primary italic">Console</span>
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name or enroll..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm text-slate-600 cursor-pointer"
            >
              {job.roles?.map((r) => (
                <option key={r.id?._id} value={r.id?._id ?? ""}>
                  {r.id?.roleName ?? "—"}
                </option>
              ))}
            </select>
            <select
              value={exportStatus}
              onChange={(e) => setExportStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm text-slate-600 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="In Consideration">In Consideration</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Enrollment & Student
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Branch
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Update Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApplicants.map((item) => (
                <tr
                  key={`${item.user?._id}-${item.role?._id}`}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-400 text-sm tracking-tighter mb-1">
                      {item.user?.enrollNumber ?? "—"}
                    </p>
                    <p className="font-bold text-slate-800">
                      {item.student?.fullName ?? "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {item.student?.branch ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {item.appliedAt
                      ? new Date(item.appliedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select
                        value={item.status ?? "In Consideration"}
                        onChange={(e) =>
                          handleStatusUpdate(
                            item.user._id,
                            item.role._id,
                            e.target.value,
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border outline-none cursor-pointer transition-all ${
                          item.status === "Selected"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : item.status === "Rejected"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        <option value="In Consideration">
                          In Consideration
                        </option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/students/${item.user?.enrollNumber}`)
                      }
                      className="p-2 hover:bg-primary/10 text-slate-300 hover:text-primary rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplicants.length === 0 && (
            <div className="p-20 text-center font-medium text-slate-400 italic">
              No applicants found for this criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
