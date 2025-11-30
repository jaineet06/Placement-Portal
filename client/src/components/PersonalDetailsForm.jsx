import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Spinner from "./Spinner";

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
      const studentRes = await axios.get("/api/student/get");
      const student = studentRes.data.student || {};

      // to fetch userschema data 
      const userRes = await axios.get("/api/user/me");
      const user = userRes.data.user || {};


      setPersonalFormData({
        fullName: student.fullName || "",
        parentName: student.parentName || "",
        enrollmentNo: user.enrollmentNo || "", // fetched from user schema
        branch: student.branch || "",
        birthDate: student.birthDate?.split("T")[0] || "",
        category: student.category || "",
        mobile: student.mobile || "",
        alternateMobile: student.alternateMobile || "",
        parentMobile: student.parentMobile || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  const getIsStudent = async () => {
    try {
      const { data } = await axios.get("/api/student/is-student");
      if (data.isStudent) {
        setIsStudent(true);
      } else {
        setIsStudent(false);
      }
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
    setPersonalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitPersonal = async (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "Once submitted, these details will be stored permanently and cannot be updated.\nDo you want to proceed?"
    );

    if (!confirmation) {
      return;
    }

    setSaving(true);
    try {
      // Remove enrollmentNo before sending
    const { enrollmentNo, ...studentData } = personalFormData;

      await axios.post("/api/student/create", studentData); // chnaged from personalFormData to studentData
      toast.success("Personal details saved successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh]">
      <Spinner />
      <p className="mt-2 text-sm font-normal">Fetching details...</p>
    </div>
  ) : (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries({
          fullName: "Full Name",
          parentName: "Parent Name",
         enrollmentNo: "Enrollment No",
          branch: "Branch",
          birthDate: "Birth Date",
          category: "Category",
          mobile: "Mobile",
          alternateMobile: "Alternate Mobile",
          parentMobile: "Parent Mobile",
        }).map(([field, label]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            {field === "branch" ? (
              <select
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent}
                className="w-full rounded-lg border-gray-300 text-sm px-3 py-2 border focus:border-blue-500 focus:ring focus:ring-blue-100 disabled:bg-gray-100"
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
                className="w-full rounded-lg border-gray-300 border text-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100 disabled:bg-gray-100"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Other">Other</option>
              </select>
            ) : field === "birthDate" ? (
              <input
                type="date"
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent}
                className="w-full rounded-lg border-gray-300 border text-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100 disabled:bg-gray-100"
              />
            ) : field === "enrollmentNo" ? ( // added condition to disable enrollmentNo input
                <input
                type="text"
                value={personalFormData[field]}
                disabled={true}
                className="w-full rounded-lg border-gray-300 border text-sm px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
            )
             :(
              <input
                type="text"
                value={personalFormData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isStudent}
                className="w-full rounded-lg border-gray-300 border text-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100 disabled:bg-gray-100"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmitPersonal}
          disabled={saving || isStudent}
          className={`px-5 py-2 rounded-lg text-white text-sm font-medium shadow-md transition 
          ${
            isStudent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {saving ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
