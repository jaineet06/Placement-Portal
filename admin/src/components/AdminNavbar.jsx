import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import { ShieldCheck, LogOut, Bell, UserCircle } from "lucide-react";

const AdminNavbar = () => {
  const { axios, setUser, setIsAdmin, user } = useAdminContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setIsAdmin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error logging out user:", error.message);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 md:px-10 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <ShieldCheck size={20} />
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">
          GEC<span className="text-primary italic pl-1">PLACEMENT</span>
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Support Labels (Hidden on Mobile) */}
        <div className="hidden lg:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
            Admin Control Center
          </p>
        </div>

        {/* Notifications & Profile */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <button
              onClick={logout}
              className="group flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200 cursor-pointer"
            >
              <LogOut
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-xs font-black uppercase tracking-widest">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
