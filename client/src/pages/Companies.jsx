import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Title from "../components/Title";

const Companies = () => {
  const { axios } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/student/job/get-all");
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Fetching openings...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Title text1={"Company"} text2={"Listings"} />

      {jobs.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>No job openings at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse rounded-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-left text-white">
                <th className="p-2 pl-5">Company</th>
                <th className="p-2 pl-5">Title</th>
                <th className="p-2 pl-5">Location</th>
                <th className="p-2 pl-5">Last Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
                  onClick={() => navigate(`/company/${job._id}`)}
                >
                  <td className="p-2 pl-5">{job.companyName}</td>
                  <td className="p-2 pl-5">{job.title}</td>
                  <td className="p-2 pl-5">{job.location}</td>
                  <td className="p-2 pl-5">
                    {new Date(job.lastDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-2 ${
                      job.status === "Open" ? "text-green-600" : "text-red-700"
                    }`}
                  >
                    {job.status}
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
