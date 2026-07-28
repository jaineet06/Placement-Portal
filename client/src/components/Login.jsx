import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";

const Login = () => {
  const { axios, setIsLoggedIn, setShowUserLogin, verified } = useAppContext();
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
      if (state === "register" && enrollNumber.length != 12) {
        setLoading(false);
        return toast.error("Enter Valid Enrollment No.");
      }
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
        if (!data.user?.isVerified) {
          toast.success(
            "Registration successful! Please contact admin to approve your account before logging in."
          );
          setLoading(false);
          return;
        }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 -skew-y-3 origin-top-left -z-10" />

      <div className="w-full max-w-[1100px] h-full md:h-[700px] flex flex-col md:flex-row bg-white rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative">
        <div className="w-full md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap size={28} />
              </div>
              <span className="text-2xl font-black">Placement Portal</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Unlock Your <br />
              <span className="text-primary italic">Future Career</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm">
              Connecting GEC Bharuch talent with world-class opportunities.
            </p>
          </div>

          <div className="relative z-10 hidden md:block">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-sm text-slate-300 italic">
                "Building India's Technical Future since 2004."
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white overflow-y-auto">
          <form onSubmit={onSubmitHandler} className="w-full space-y-6">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">
                {state === "login" ? "Sign In" : "Create Account"}
              </h3>
              <p className="text-slate-500 font-medium text-sm">
                {state === "login"
                  ? "Enter your credentials to continue"
                  : "Fill in the details to join the placement cell"}
              </p>
            </div>

            <div className="space-y-4">
              {state === "register" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 tracking-wider">
                      NAME
                    </label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 tracking-wider">
                      ENROLLMENT
                    </label>
                    <input
                      onChange={(e) => setEnrollNumber(e.target.value)}
                      value={enrollNumber}
                      maxLength={12}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      type="text"
                      placeholder="12-digit NO."
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 tracking-wider">
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {state === "register" && (
                  <ul className="mt-4 grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {passwordCriteria.map((item, index) => {
                      const isMet = item.test(password);
                      return (
                        <li
                          key={index}
                          className={`text-[11px] flex items-center gap-2 font-bold ${
                            password.length === 0
                              ? "text-slate-400"
                              : isMet
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isMet ? "bg-green-500" : "bg-slate-300"
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
              className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mx-auto" />
              ) : state === "register" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-slate-500 text-sm font-medium">
              {state === "register" ? "Already a member?" : "New student?"}{" "}
              <span
                onClick={() => {
                  setState(state === "login" ? "register" : "login");
                  setPassword("");
                }}
                className="text-primary cursor-pointer hover:underline font-bold"
              >
                {state === "register" ? "Login here" : "Sign up here"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
