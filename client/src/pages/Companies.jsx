import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  Search,
  ShieldAlert,
} from "lucide-react";
import PendingVerification from "../components/PendingVerification";

const Companies = () => {
  const { axios, verified } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/student/job/get-all");
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (err) {
      toast.error("Failed to load job listings");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (verified) fetchJobs();
  }, [verified]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!verified) {
    return <PendingVerification />;
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Spinner />
        <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
          Scanning for opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Current <span className="text-primary italic">Openings</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Find your next career milestone at GEC Bharuch
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <Building2 size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg">
            No openings found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/company/${job._id}`)}
              className="group relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    job.status === "Open"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                  <Building2
                    className="text-slate-400 group-hover:text-primary"
                    size={28}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-sm mt-1">
                    {job.companyName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 pt-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <MapPin size={14} className="text-primary" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Calendar size={14} className="text-primary" />
                    Deadline: {new Date(job.lastDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  View Details
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
