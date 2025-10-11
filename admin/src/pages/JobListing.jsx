import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const JobListing = () => {
  const { axios } = useAdminContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  //  Fetch jobs from backend
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/get-all");
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  //  Fetch jobs when component loads
  useEffect(() => {
    fetchJobs();
  }, []);

  return loading ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Spinner />
      <p className="text-sm mt-2 font-normal">Fetching jobs...</p>
    </div>
  ) : (
    <>
      <div className="flex justify-between z-0">
        <Title text1={"Open"} text2={"Jobs"} />
      </div>

      {jobs.length === 0 ? <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl font-medium">No jobs available</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
          onClick={() => navigate("/create-job")}
        >
          Create Job
        </button>
      </div> : <div className="max-w-full mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary text-left text-white">
              <th className="p-2 font-medium pl-5">Title</th>
              <th className="p-2 font-medium">Location</th>
              <th className="p-2 font-medium">Last Date</th>
              <th className="p-2 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {(
              jobs.map((job, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
                >
                  <td
                    className="p-2 pl-5 text-blue-600  cursor-pointer"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                   {job.title }
                  </td>
                  <td className="p-2">{job.location || "Not specified"}</td>
                  <td className="p-2">
                    {new Date(job.lastDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>}
    </>
  );
};

export default JobListing;
