
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { axios } = useAppContext();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/get/${id}`);
      if (data.success) setJob(data.job);
      else toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load job details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  if (loading || !job) return <Spinner />;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">{job.title}</h2>

      <p className="text-lg mt-2">
        <strong>Company:</strong> {job.companyName}
      </p>

      <p className="text-lg">
        <strong>Location:</strong> {job.location}
      </p>

      <p className="text-lg">
        <strong>Last Date:</strong>{" "}
        {new Date(job.lastDate).toLocaleDateString()}
      </p>

      <p className="text-lg mt-4 whitespace-pre-line">
        <strong>Description:</strong> {job.description}
      </p>

      <button className="mt-6 bg-primary text-white px-4 py-2 rounded">
        Apply
      </button>
    </div>
  );
};

export default JobDetails;
