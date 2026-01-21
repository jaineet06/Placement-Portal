import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Spinner from "./Spinner";
import {
  UserCircle,
  Save,
  AlertCircle,
  Phone,
  Fingerprint,
} from "lucide-react";

const defaultPersonalData = {
  fullName: "",
  parentName: "",
  enrollmentNo: "",
  branch: "",
  birthDate: "",
  category: "",
  mobile: "",
  alternateMobile: "",
  parentMobile: "",
};

const PersonalDetailsForm = () => {
  const [personalFormData, setPersonalFormData] = useState(defaultPersonalData);
  const [saving, setSaving] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { axios, verified } = useAppContext();

  const loadData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get("/api/auth/me");
      const user = userRes.data.user || {};

      let student = {};
      try {
        const studentRes = await axios.get("/api/student/get");
        if (studentRes.data.success) {
          student = studentRes.data.student;
        }
      } catch {
        student = {};
      }

      setPersonalFormData({
        fullName: student.fullName || "",
        parentName: student.parentName || "",
        enrollmentNo: user.enrollNumber || "",
        branch: student.branch || "",
        birthDate: student.birthDate?.split("T")[0] || "",
        category: student.category || "",
        mobile: student.mobile || "",
        alternateMobile: student.alternateMobile || "",
        parentMobile: student.parentMobile || "",
      });
    } catch (err) {
      toast.error("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  const getIsStudent = async () => {
    try {
      const { data } = await axios.get("/api/student/is-student");
      setIsStudent(!!data.isStudent);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (verified) {
      loadData();
      getIsStudent();
    }
  }, [verified]);

  const handleChange = (field, value) => {
    setPersonalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPersonal = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm(
      "Once submitted, these details will be stored permanently and cannot be updated. Proceed?"
    );
    if (!confirmation) return;

    setSaving(true);
    try {
      const { enrollmentNo, ...studentData } = personalFormData;
      await axios.post("/api/student/create", studentData);
      toast.success("Personal details saved successfully.");
      setIsStudent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Syncing profile data...
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <UserCircle size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Personal Information
          </h2>
        </div>

        {isStudent && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <AlertCircle size={14} /> Read-only mode
          </div>
        )}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries({
          fullName: { label: "Full Name", icon: null },
          parentName: { label: "Parent/Guardian Name", icon: null },
          enrollmentNo: {
            label: "Enrollment Number",
            icon: <Fingerprint size={14} />,
          },
          branch: { label: "Academic Branch", icon: null },
          birthDate: { label: "Date of Birth", icon: null },
          category: { label: "Category", icon: null },
          mobile: { label: "Student Mobile", icon: <Phone size={14} /> },
          alternateMobile: { label: "Alternate Mobile", icon: null },
          parentMobile: { label: "Parent Mobile", icon: null },
        }).map(([field, info]) => (
          <div key={field} className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              {info.icon} {info.label}
            </label>

            {field === "branch" ? (
              <select
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-70 disabled:bg-slate-100"
              >
                <option value="">Select Branch</option>
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
              </select>
            ) : field === "category" ? (
              <select
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-70 disabled:bg-slate-100"
              >
                <option value="">Select Category</option>
                {["General", "OBC", "SC", "ST", "EWS", "Other"].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field === "birthDate" ? "date" : "text"}
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent || field === "enrollmentNo"}
                placeholder={`Enter ${info.label.toLowerCase()}`}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all
                  ${
                    isStudent || field === "enrollmentNo"
                      ? "cursor-not-allowed bg-slate-100 opacity-70"
                      : "focus:border-primary focus:ring-4 focus:ring-primary/10"
                  }`}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2 pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium italic">
            * Ensure all details match your official college records.
          </p>
          <button
            onClick={handleSubmitPersonal}
            disabled={saving || isStudent}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg
              ${
                isStudent
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-primary text-white hover:bg-primary-dull hover:shadow-primary/20 active:scale-95 cursor-pointer"
              }`}
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} /> Save Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;
