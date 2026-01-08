import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { LogOut, UserCircle } from "lucide-react";

const StudentNavBar = () => {
  const { isLoggedIn, setIsLoggedIn, setShowUserLogin, axios } =
    useAppContext();

  const logoutUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(false);
        setShowUserLogin(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in logging out: ", error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          Government Engineering College, Bharuch
        </h2>

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 px-4 py-1.5 rounded-md text-sm font-medium transition-all border border-red-100 shadow-sm cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavBar;
