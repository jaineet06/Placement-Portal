import { useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import { toast } from "react-hot-toast";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const { axios, fetchUser } = useAdminContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        toast.success("Welcome back, Administrator");
        fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-slate-50">
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -ml-48 -mb-48" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 p-10 md:p-12">
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Admin<span className="text-primary italic pl-1">Console</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              Secure Gateway
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Admin Credentials
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-700"
                  type="email"
                  placeholder="admin@gecbharuch.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-700"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="group relative w-full flex items-center justify-center py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 cursor-pointer disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Authorize Entry"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              GEC Bharuch Placement Portal © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
