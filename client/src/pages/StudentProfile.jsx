import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import AddressForm from "../components/AddressForm";
import EducationForm from "../components/EducationForm";
import UploadFiles from "../components/UploadFiles";
import {
  User,
  MapPin,
  GraduationCap,
  FileUp,
  ShieldAlert,
  Lock,
} from "lucide-react";
import PendingVerification from "../components/PendingVerification";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { verified, isLoggedIn } = useAppContext();

  if (verified === null) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Spinner />
        <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
          Validating credentials...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="p-4 bg-amber-50 rounded-full text-amber-600">
          <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Access Restricted
        </h1>
        <p className="text-slate-500 font-medium">
          Please login to access your student profile.
        </p>
      </div>
    );
  }

  if (!verified) {
    return <PendingVerification />;
  }

  const tabs = [
    { id: "personal", label: "Personal", icon: <User size={18} /> },
    { id: "address", label: "Address", icon: <MapPin size={18} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
    { id: "uploads", label: "Uploads", icon: <FileUp size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Account <span className="text-primary italic">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your student profile and academic documents
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">
            Verified Student
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
       
        <aside className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
          
          <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>

          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap
        ${
          activeTab === id
            ? "bg-primary text-white shadow-lg shadow-primary/25 lg:translate-x-2"
            : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 lg:border-transparent hover:border-slate-200"
        }`}
            >
              <span
                className={activeTab === id ? "text-white" : "text-primary"}
              >
                {icon}
              </span>
              {label}
            </button>
          ))}
        </aside>

        
        <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10 min-h-[500px]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === "personal" && <PersonalDetailsForm />}
            {activeTab === "address" && <AddressForm />}
            {activeTab === "education" && <EducationForm />}
            {activeTab === "uploads" && <UploadFiles />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
