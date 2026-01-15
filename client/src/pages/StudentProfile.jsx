import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import AddressForm from "../components/AddressForm";
import EducationForm from "../components/EducationForm";
import UploadFiles from "../components/UploadFiles";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const { getStudentVerification, verified, isLoggedIn } = useAppContext();

  useEffect(() => {
    getStudentVerification();
  }, []);

  if (verified === null) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Checking verification...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-normal">Login first to get access</h1>
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
      <div className="mb-6 flex flex-wrap gap-5 justify-center">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`rounded-2xl px-6 py-3 text-sm font-medium transition cursor-pointer
              ${
                activeTab === id
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <>
        {activeTab === "personal" && <PersonalDetailsForm />}
        {activeTab === "address" && <AddressForm />}
        {activeTab === "education" && <EducationForm />}
        {activeTab === "uploads" && <UploadFiles />}
      </>
    </div>
  );
};

export default StudentProfile;
