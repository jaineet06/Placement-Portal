import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import { Briefcase, Building2, MapPin, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PendingVerification from "../components/PendingVerification";
import axios from "axios";
import toast from "react-hot-toast";

const AppliedJobs = () => {
  const { verified, user } = useAppContext();
  const navigate = useNavigate();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/student/job/apply/get-all/${user.userId}`
      );
      setAppliedJobs(data.appliedJobs ?? []);
    } catch (error) {
      // Don't show error if it's just an empty collection (handled in service)
      if (error.response?.status !== 404) {
        toast.error("Failed to load applications.");
      }
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if the user is verified
    if (verified) {
      fetchAppliedJobs();
    }
  }, [verified]);

  if (verified === false ) return <PendingVerification />;

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Spinner />
        <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
          Syncing your applications...
        </p>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Application <span className="text-primary italic">History</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Track and manage your professional journey
        </p>
      </div>

      {appliedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={32} className="text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-400">
            You haven't applied for any jobs yet.
          </p>
          <button
            onClick={() => navigate("/company")}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Explore current openings →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                    Company
                  </th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                    Applied Role
                  </th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                    Date Applied
                  </th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appliedJobs.map((job, index) => (
                  <tr
                    key={job.jobId + job.roleId + index}
                    onClick={() =>
                      job.jobId && navigate(`/company/${job.jobId}`)
                    }
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">
                            {job.companyName}
                          </p>
                          <p className="text-sm text-slate-500 font-medium">
                            {job.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                        <MapPin size={14} className="text-primary/60" />
                        {job.location}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                          {job.appliedRoleName}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                        <Clock size={14} className="text-primary/60" />
                        {job.appliedAt
                          ? new Date(job.appliedAt).toLocaleDateString("en-GB")
                          : "—"}
                      </div>
                    </td>

                    <td
                      className={`px-8 py-6 text-center text-sm font-semibold ${
                        job.status === "Selected"
                          ? " text-green-700"
                          : job.status === "Rejected"
                          ? " text-red-700 "
                          : " text-blue-700 "
                      }`}
                    >
                      {job.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
          <Calendar size={16} />
        </div>
        <p className="text-xs text-slate-600 font-medium">
          Note: For changes in your application or role preferences, please
          contact the{" "}
          <span className="text-primary font-bold uppercase tracking-tighter">
            Placement Coordinator
          </span>{" "}
          directly.
        </p>
      </div>
    </div>
  );
};

export default AppliedJobs;
