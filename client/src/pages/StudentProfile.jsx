import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import AddressForm from "../components/AddressForm";
import EducationForm from "../components/EducationForm";
import UploadFiles from "../components/UploadFiles";

const StudentProfile = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const { getStudentVerification, verified } = useAppContext();

  useEffect(() => {
    getStudentVerification();
  }, []);

  if (loading && verified === null) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Checking verification...</p>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-normal">
          Sorry, You are not verified. Contact admin.
        </h1>
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "address", label: "Address Details" },
    { id: "education", label: "Education Details" },
    { id: "uploads", label: "Uploads" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-semibold text-gray-700">
        Student Profile
      </h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`rounded-md px-5 py-2 text-sm font-medium transition cursor-pointer
              ${
                activeTab === id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === "personal" && <PersonalDetailsForm />}
          {activeTab === "address" && <AddressForm />}
          {activeTab === "education" && <EducationForm />}
          {activeTab === "uploads" && <UploadFiles />}
        </>
      )}
    </div>
  );
};

export default StudentProfile;
