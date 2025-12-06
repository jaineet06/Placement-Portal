
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Companies = () => {
  const { axios } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/get-all");
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load job listings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Company Listings</h2>

      {jobs.length === 0 ? (
        <p>No job openings at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-2">Company</th>
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Last Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="even:bg-gray-100">
                  <td className="p-2">{job.companyName}</td>
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.location}</td>
                  <td className="p-2">
                    {new Date(job.lastDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => navigate(`/company/${job._id}`)}
                      className="px-3 py-1 bg-primary text-white rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Companies;
