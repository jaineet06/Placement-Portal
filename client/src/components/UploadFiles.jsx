import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import { FileText, Camera, Upload, Eye, X, CheckCircle2 } from "lucide-react";

const UploadFiles = () => {
  const [resume, setResume] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { axios, verified } = useAppContext();

  const handleFileDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file, type);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    processFile(file, type);
  };

  const processFile = (file, type) => {
    if (!file) return;
    if (type === "resume") {
      setResume(file);
      setResumePreview(file.name);
    }
    if (type === "profile") {
      setProfile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!resume && !profile)
      return toast.error("Please select at least one file");
    setUploading(true);

    try {
      const formData = new FormData();
      if (resume) formData.append("resume", resume);
      if (profile) formData.append("profilePath", profile);

      const { data } = await axios.post("/api/student/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Assets synchronized successfully");
        loadData();
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      toast.error(
        error.response?.data?.message || error.message || "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/student/get-files");
      if (data.success) {
        if (data.files.resume) setResumePreview(data.files.resume);
        if (data.files.profilePath) setProfilePreview(data.files.profilePath);
      }
    } catch (error) {
      toast.error("Failed to sync remote assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadData();
  }, [verified]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Retrieving encrypted documents...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Upload size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Professional Assets
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
            Resume (PDF)
          </label>
          <div
            onDrop={(e) => handleFileDrop(e, "resume")}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("resumeInput").click()}
            className={`h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer
              ${
                resumePreview
                  ? "border-green-200 bg-green-50/30"
                  : "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-primary/5"
              }`}
          >
            <input
              type="file"
              id="resumeInput"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "resume")}
            />

            {resumePreview ? (
              <div className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">
                  {resumePreview.startsWith("http")
                    ? "Official_Resume.pdf"
                    : resumePreview}
                </p>
                {resumePreview.startsWith("http") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(resumePreview, "_blank");
                    }}
                    className="mt-2 text-[10px] font-black text-primary uppercase flex items-center gap-1 mx-auto hover:underline"
                  >
                    <Eye size={12} /> View Document
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <FileText
                  className="mx-auto text-slate-300 group-hover:text-primary transition-colors mb-2"
                  size={32}
                />
                <p className="text-xs font-bold text-slate-400">
                  Drag PDF or Click
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="group relative">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
            Identity Photo
          </label>
          <div
            onDrop={(e) => handleFileDrop(e, "profile")}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("profileInput").click()}
            className={`h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden
              ${
                profilePreview
                  ? "border-primary/20 bg-white"
                  : "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-primary/5"
              }`}
          >
            <input
              type="file"
              id="profileInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "profile")}
            />

            {profilePreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={profilePreview}
                  alt="Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[10px] font-black text-white uppercase">
                    Change Photo
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileModal(true);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-white rounded-xl shadow-lg text-slate-600 hover:text-primary transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Camera
                  className="mx-auto text-slate-300 group-hover:text-primary transition-colors mb-2"
                  size={32}
                />
                <p className="text-xs font-bold text-slate-400">
                  Drop Image or Click
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-dull hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-dull/25 border-t-white" />{" "}
            Syncing Cloud...
          </>
        ) : (
          <>
            <Upload size={18} /> Update Assets
          </>
        )}
      </button>

      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img
              src={profilePreview}
              alt="Full Identity"
              className="w-full h-auto max-h-[70vh] object-contain bg-slate-50"
            />
            <div className="p-6 text-center">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
                Profile Preview
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
