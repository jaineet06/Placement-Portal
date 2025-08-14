import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const StudentNavBar = () => {
  const { isLoggedIn, setIsLoggedIn, setShowUserLogin, axios } =
    useAppContext();

  const logoutUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("student_form_data");
        setIsLoggedIn(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in loggin out user: ", error.message);
    }
  };
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-black">
      <h1 className="text-xl font-semibold">GEC, Bharuch</h1>
      {isLoggedIn ? (
        <div
          onClick={logoutUser}
          className="flex items-center justify-center bg-primary hover:bg-primary-dull transition-all text-white py-1 px-4 rounded-full cursor-pointer"
        >
          Logout
        </div>
      ) : (
        <div
          onClick={() => setShowUserLogin(true)}
          className="flex items-center justify-center bg-primary hover:bg-primary-dull transition-all text-white py-1 px-4 rounded-full cursor-pointer"
        >
          Login
        </div>
      )}
    </div>
  );
};

export default StudentNavBar;
