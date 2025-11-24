import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, isLoggedIn, setIsLoggedIn, showUserLogin, setShowUserLogin } =
    useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollNumber , setEnrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/${state}`, {
        name,
        email,
        password,
        enrollNumber,
      });
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setShowUserLogin(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Student</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Your Name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

      {state === "register" && (
       <div className="w-full">
        <p>Enrollment Number</p>
         <input
           onChange={(e) => {
           const value = e.target.value;
           setEnrollNumber(value);  

         }}
            value={enrollNumber}
            placeholder="Enter your 12-digit Enrollment Number"
            maxLength={12}  
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="text"
            required
         />
      </div>
    )}

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter Your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter Password here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button
          disabled={loading}
          className="flex items-center justify-center bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
          ) : state === "register" ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
