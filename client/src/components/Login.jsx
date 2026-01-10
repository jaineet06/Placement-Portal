import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { axios, isLoggedIn, setIsLoggedIn, showUserLogin, setShowUserLogin } =
    useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollNumber, setEnrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordCriteria = [
    {
      label: "8-20 characters",
      test: (pw) => pw.length >= 8 && pw.length <= 20,
    },
    { label: "At least one number", test: (pw) => /\d/.test(pw) },
    { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    {
      label: "One special character",
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValidPassword = passwordCriteria.every((item) =>
        item.test(password)
      );

      if (state === "register" && !isValidPassword) {
        setLoading(false);
        return toast.error("Please meet all password requirements");
      }

      const { data } = await axios.post(`/api/auth/${state}`, {
        name,
        email,
        password,
        enrollNumber,
      });

      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0a0a0c] backdrop-blur-sm p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 w-full max-w-[440px] px-8 py-10 rounded-2xl 
                   bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {state === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm">
            {state === "login"
              ? "Enter your credentials to access your account"
              : "Create a student profile to get started"}
          </p>
        </div>

        <div className="w-full space-y-4">
          {state === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 ml-1">
                NAME
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                type="text"
                placeholder="Your name"
                required
              />
            </div>
          )}

          {state === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 ml-1">
                ENROLLMENT NUMBER
              </label>
              <input
                onChange={(e) => setEnrollNumber(e.target.value)}
                value={enrollNumber}
                maxLength={12}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                type="text"
                placeholder="12-digit number"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 ml-1">
              EMAIL ADDRESS
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              type="email"
              placeholder="Your email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 ml-1">
              PASSWORD
            </label>
            <div className="relative group">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 pr-10 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2.5} />
                ) : (
                  <Eye size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>

            {state === "register" && (
              <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
                {passwordCriteria.map((item, index) => {
                  const isMet = item.test(password);
                  return (
                    <li
                      key={index}
                      className={`text-[12px] flex items-center gap-1.5 transition-colors duration-300 ${
                        password.length === 0
                          ? "text-gray-500"
                          : isMet
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          isMet ? "bg-green-400" : "bg-current"
                        }`}
                      />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 mt-4 rounded-lg bg-primary text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto" />
          ) : state === "register" ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-gray-400 text-sm mt-2">
          {state === "register"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setState(state === "login" ? "register" : "login");
              setPassword(""); // Reset password when switching
            }}
            className="text-primary cursor-pointer hover:underline font-medium"
          >
            {state === "register" ? "Login" : "Sign up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
