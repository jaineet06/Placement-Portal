import { useState, useRef, useEffect } from "react";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";

import {
  Trash2 as DeleteIcon,
  Plus,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  PlusCircle,
  Info,
  Layers,
  RotateCcw,
} from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const CreateJob = () => {
  const { axios } = useAdminContext();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [jobType, setJobType] = useState("");

  const [recruiter, setRecruiter] = useState({
    hrName: "",
    email: "",
    contact: "",
  });

  const [roles, setRoles] = useState([]);
  const [addRole, setAddRole] = useState("");
  const [rounds, setRounds] = useState([]);
  const [addRound, setAddRound] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  const handleRoleAdd = () => {
    if (!addRole.trim() || roles.includes(addRole.trim())) return;
    setRoles([...roles, addRole.trim()]);
    setAddRole("");
  };

  const handleRoundAdd = () => {
    if (!addRound.trim() || rounds.includes(addRound.trim())) return;
    setRounds([...rounds, addRound.trim()]);
    setAddRound("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;

    if (
      !name ||
      !title ||
      !description ||
      !lastDate ||
      !jobType ||
      !recruiter.hrName ||
      !recruiter.email ||
      !recruiter.contact
    ) {
      return toast.error(
        "Please fill all required fields including Recruiter details!"
      );
    }
    if (roles.length === 0 || rounds.length === 0) {
      return toast.error("Please add at least one Role and one Round!");
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/job/create", {
        companyName: name,
        title,
        description,
        location,
        lastDate,
        jobType,
        rounds,
        roles,
        recruiter,
      });

      if (data.success) {
        toast.success("Job created successfully!");

        setName("");
        setTitle("");
        setLocation("");
        setLastDate("");
        setJobType("");
        setRecruiter({ hrName: "", email: "", contact: "" });
        setRoles([]);
        setRounds([]);
        quillRef.current.root.innerHTML = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium";
  const labelStyles = "block text-sm font-bold text-slate-700 ml-1";

  return (
    <div className="p-4 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <PlusCircle size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create <span className="text-primary italic">Opening</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Post new career opportunities for students
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" /> Basic Information
            </h3>
          </div>

          <div>
            <label className={labelStyles}>Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputStyles}
              placeholder="e.g. Google"
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputStyles}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className={inputStyles}
              required
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="Internship + FTE">Internship + FTE</option>
            </select>
          </div>

          <div>
            <label className={labelStyles}>Application Deadline</label>
            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className={inputStyles}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelStyles}>Work Location</label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${inputStyles} pl-12`}
                placeholder="e.g. Remote, Vadodara, Noida"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <UserCircle size={20} className="text-primary" /> Recruiter
              Details
            </h3>
          </div>

          <div>
            <label className={labelStyles}>HR Name</label>
            <input
              type="text"
              value={recruiter.hrName}
              onChange={(e) =>
                setRecruiter({ ...recruiter, hrName: e.target.value })
              }
              className={inputStyles}
              placeholder="Contact Person"
              required
            />
          </div>

          <div>
            <label className={labelStyles}>HR Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={recruiter.email}
                onChange={(e) =>
                  setRecruiter({ ...recruiter, email: e.target.value })
                }
                className={`${inputStyles} pl-12`}
                placeholder="hr@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelStyles}>Contact No.</label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={recruiter.contact}
                onChange={(e) =>
                  setRecruiter({ ...recruiter, contact: e.target.value })
                }
                className={`${inputStyles} pl-12`}
                placeholder="+91 ..."
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Info size={20} className="text-primary" /> Job Description
          </h3>
          <div className="mt-4">
            <div
              ref={editorRef}
              className="bg-slate-50 border-slate-200"
              style={{ minHeight: "200px" }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Target Roles
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                className={inputStyles}
                placeholder="e.g. Java Dev"
              />
              <button
                type="button"
                onClick={handleRoleAdd}
                className="bg-slate-900 text-white px-4 rounded-xl hover:bg-black transition-all cursor-pointer"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((r, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black flex items-center gap-2"
                >
                  {r}{" "}
                  <DeleteIcon
                    size={14}
                    className="cursor-pointer text-red-500"
                    onClick={() => setRoles(roles.filter((x) => x !== r))}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <RotateCcw size={20} className="text-primary" /> Interview Rounds
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={addRound}
                onChange={(e) => setAddRound(e.target.value)}
                className={inputStyles}
                placeholder="e.g. Technical Round"
              />
              <button
                type="button"
                onClick={handleRoundAdd}
                className="bg-slate-900 text-white px-4 rounded-xl hover:bg-black transition-all cursor-pointer"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {rounds.map((r, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black flex items-center gap-2 border border-blue-100"
                >
                  {r}{" "}
                  <DeleteIcon
                    size={14}
                    className="cursor-pointer text-red-500"
                    onClick={() => setRounds(rounds.filter((x) => x !== r))}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-primary text-white font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Official Opening"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
