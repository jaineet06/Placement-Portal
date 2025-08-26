import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

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
    if (type === "resume") {
      setResume(file);
      setResumePreview(file.name);
    }
    if (type === "profile") {
      setProfile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
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

      console.log(formData);

      const { data } = await axios.post("/api/student/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Files uploaded successfully");
        loadData();
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/student/get-files");
      if (data.success) {
        if (data.files.resume) {
          setResumePreview(data.files.resume); // Cloudinary URL
        }
        if (data.files.profilePath) {
          setProfilePreview(data.files.profilePath); // Cloudinary URL
        }
      }
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadData();
  }, [verified]);

  const dropZoneClass =
    "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition hover:bg-gray-50";

  return loading ? (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh]">
      <Spinner />
      <p className="mt-2 text-sm font-normal">Fetching details...</p>
    </div>
  ) : (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">Upload Files</h2>

      {/* Resume Upload */}
      <div
        onDrop={(e) => handleFileDrop(e, "resume")}
        onDragOver={(e) => e.preventDefault()}
        className={dropZoneClass}
        onClick={() => document.getElementById("resumeInput").click()}
      >
        <input
          type="file"
          id="resumeInput"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "resume")}
        />

        {resumePreview ? (
          <a
            href={resumePreview}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span>📄</span>
            <span>
              {resumePreview.startsWith("http")
                ? resumePreview.split("/").pop()
                : resumePreview}
            </span>
          </a>
        ) : (
          <p className="text-gray-500">
            Drag & drop your Resume here or click to select (.pdf)
          </p>
        )}
      </div>

      {/* Profile Upload */}
      <div
        onDrop={(e) => handleFileDrop(e, "profile")}
        onDragOver={(e) => e.preventDefault()}
        className={dropZoneClass}
        onClick={() => document.getElementById("profileInput").click()}
      >
        <input
          type="file"
          id="profileInput"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "profile")}
        />
        {profilePreview ? (
          <img
            src={profilePreview}
            alt="Profile Preview"
            className="w-24 h-24 object-cover rounded-full border mt-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileModal(true);
            }}
          />
        ) : (
          <p className="text-gray-500">
            Drag & drop your Profile Photo here or click to select (Image)
          </p>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={profilePreview}
              alt="Full Profile"
              className="w-full h-auto rounded"
            />
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
