import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useAdminContext } from "../context/AdminContext";
import { UserCheck, Trash2, ShieldAlert, Mail, Hash } from "lucide-react";
import toast from "react-hot-toast";

const VerifyUsers = () => {
  const { axios } = useAdminContext();
  const [verifyUser, setVerfiyUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null); // Track specific user being verified

  const fetchNotVerifiedUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/auth/get-all");
      if (data.success) {
        setVerfiyUser(data.users);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyUserById = async (id) => {
    setVerifyingId(id);
    try {
      const { data } = await axios.post("/api/auth/verify-user", { id });
      if (data.success) {
        toast.success(data.message);
        setVerfiyUser((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const deleteUserById = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to reject and delete this registration?"
      )
    )
      return;
    try {
      const { data } = await axios.delete(`/api/auth/verify/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchNotVerifiedUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchNotVerifiedUsers();
  }, []);

  return (
    <div className="p-4 space-y-8 max-w-8xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Account <span className="text-primary italic">Verification</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Review and approve new student registrations
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 bg-white rounded-[2.5rem] border border-slate-100">
          <Spinner />
          <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
            Loading pending requests...
          </p>
        </div>
      ) : verifyUser.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="p-4 bg-green-50 text-green-500 rounded-full mb-4">
            <UserCheck size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Queue is empty!</h3>
          <p className="text-slate-500">
            All student accounts are currently verified.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    Enrollment No
                  </th>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-8 py-5 text-[13px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {verifyUser.map((item) => (
                  <tr
                    key={item._id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-primary/40" />
                        <span className="font-black text-slate-600 tracking-tighter">
                          {item.enrollNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-slate-800 text-base">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                          <Mail size={12} /> {item.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => verifyUserById(item._id)}
                          disabled={verifyingId === item._id}
                          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                        >
                          {verifyingId === item._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                              Verifying
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} />
                              Approve
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteUserById(item._id)}
                          className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Reject User"
                        >
                          <Trash2 size={20} />
                        </button>
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

export default VerifyUsers;
