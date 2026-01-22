import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Info,
  ShieldCheck,
} from "lucide-react";

const JobDetails = () => {
  const { axios, user } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [applying, setApplying] = useState(false);

  const handleInput = (name) => {
    setSelectedRole((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/student/job/${id}`);
      if (data.success) setJob(data.job);
      else toast.error(data.message);
    } catch (err) {
      toast.error("Failed to load job details");
    }
    setLoading(false);
  };

  const handleApplyjob = async () => {
    if (selectedRole.length === 0)
      return toast.error("Select at least one role");
    if (!acceptedTerms) return toast.error("Accept terms & conditions");

    setApplying(true);
    try {
      const { data } = await axios.post(
        `/api/student/job/apply/${user._id}/${id}`,
        { roles: selectedRole, acceptedTerms },
      );

      if (data.success) {
        toast.success("Application submitted successfully!");
        setSelectedRole([]);
        setAcceptedTerms(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  if (loading || !job) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Spinner />
        <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
          Loading job specifications...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors mb-4"
      >
        <ArrowLeft size={18} /> Back to Listings
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
              <Building2 className="text-primary" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {job.title}
              </h2>
              <p className="text-xl text-primary font-bold italic mt-1">
                {job.companyName}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
              job.status === "Open"
                ? "bg-green-50 border-green-100 text-green-600"
                : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            Status: {job.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <MapPin />, label: "Location", value: job.location },
          {
            icon: <Calendar />,
            label: "Apply Before",
            value: new Date(job.lastDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
          {
            icon: <Briefcase />,
            label: "Job Type",
            value: "Full-Time / Campus",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4"
          >
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-slate-900 font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Info className="text-primary" size={20} />
              <div className="rich-text"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(job.description),
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <CheckCircle2 className="text-primary" size={20} />
              <h3 className="text-xl font-black uppercase tracking-tight">
                Select Your Preferred Role
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {job.roles?.map((role, index) => (
                <button
                  key={index}
                  onClick={() => handleInput(role.name)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${
                    selectedRole.includes(role.name)
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-primary/50"
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white sticky top-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Ready to Apply?
            </h3>

            <div className="space-y-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-700 rounded-md checked:bg-primary checked:border-primary transition-all"
                  />
                  <CheckCircle2
                    size={12}
                    className="absolute top-1 left-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                  />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors leading-snug font-medium">
                  I hereby confirm that I meet the eligibility criteria and
                  agree to the T&P Cell guidelines.
                </span>
              </label>

              <button
                onClick={handleApplyjob}
                disabled={
                  !acceptedTerms || selectedRole.length === 0 || applying
                }
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  acceptedTerms && selectedRole.length > 0 && !applying
                    ? "bg-primary text-white hover:bg-primary-dull shadow-xl shadow-primary/20 active:scale-95"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {applying ? (
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit Application"
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 uppercase font-black tracking-widest">
                GEC Bharuch Placement Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
