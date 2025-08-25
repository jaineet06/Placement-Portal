import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

const AdminNavbar = () => {
  const { axios, setUser } = useAdminContext();
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");

      if (data.success) {
        toast.success(data.message);
        setUser(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in loggin out user: ", error.message);
    }
  };
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-black py-4 bg-white transition-all duration-300">
      <p>Admin Panel</p>
      <div className="flex items-center gap-5 text-gray-500">
        <p>Hi! Admin</p>
        <button
          onClick={logout}
          className=" text-white cursor-pointer rounded-full text-sm px-6 py-2 bg-primary hover:bg-primary-dull"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
