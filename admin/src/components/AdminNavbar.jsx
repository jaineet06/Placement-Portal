import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

const AdminNavbar = () => {
  const { axios, setUser, setIsAdmin } = useAdminContext();

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
    <div className="fixed top-0 left-0 w-full h-16 border-b border-black bg-white z-50 flex items-center justify-between px-6 md:px-10">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <div
        onClick={logout}
        className="flex items-center justify-center bg-primary hover:bg-primary-dull transition-all text-white py-1 px-4 rounded-full cursor-pointer"
      >
        Logout
      </div>
    </div>
  );
};

export default AdminNavbar;
