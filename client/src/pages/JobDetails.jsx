import { use, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { axios, user } = useAppContext();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [applying, setApplying] = useState(false);

  const handleInput = (name) => {
    setSelectedRole((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/student/job/${id}`);
      if (data.success) setJob(data.job);
      else toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load job details");
    }
    setLoading(false);
  };

  const handleApplyjob = async () => {
    if (selectedRole.length === 0) {
      return toast.error("Select atleast one role");
    }

    if (!acceptedTerms) {
      return toast.error("Accept terms & conditions");
    }

    console.log(user);
    const studentId = user._id;
    const jobId = id;

    setApplying(true);

    try {
      const { data } = await axios.post(
        `/api/student/job/apply/${studentId}/${jobId}`,
        {
          roles: selectedRole,
          acceptedTerms,
        }
      );

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setSelectedRole([]);
        setAcceptedTerms(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Internal server error");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  if (loading || !job) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Fetching job...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
        <p className="text-lg text-gray-600 mt-1">{job.companyName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Location</p>
          <p className="font-medium mt-1">{job.location}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Last Date</p>
          <p className="font-medium mt-1">
            {new Date(job.lastDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Status</p>
          <p
            className={`font-medium mt-1 ${
              job.status === "Open" ? "text-green-600" : "text-red-600"
            }`}
          >
            {job.status}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-5 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Job Description
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div className="bg-white shadow rounded p-5 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Available Roles
        </h3>

        {job.roles?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {job.roles.map((role, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-primary-dull text-sm cursor-pointer transition ${
                  selectedRole.includes(role.name)
                    ? "bg-primary/50 border-none text-white"
                    : ""
                }`}
                onClick={() => handleInput(role.name)}
              >
                {role.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No roles listed for this job.</p>
        )}
      </div>

      <div className="bg-white shadow rounded p-5 flex flex-col gap-4">
        <label className="flex items-center gap-3 text-gray-700 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="w-4 h-4"
          />
          I agree to the terms & conditions for applying to this job.
        </label>

        <button
          onClick={handleApplyjob}
          disabled={!acceptedTerms || selectedRole.length === 0}
          className={`w-full py-3 rounded text-white font-medium transition cursor-pointer ${
            acceptedTerms && selectedRole.length > 0
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {applying ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
