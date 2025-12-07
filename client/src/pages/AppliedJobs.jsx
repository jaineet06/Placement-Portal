import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Title from "../components/Title";
import Spinner from "../components/Spinner";

const AppliedJobs = () => {
  const { axios, user } = useAppContext();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/student/job/apply/get-all/${user._id}`
      );
      if (data.success) {
        setAppliedJobs(data.appliedJobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchJobs();
  }, [user]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Spinner />
        <p className="text-sm mt-2 font-normal">Fetching job...</p>
      </div>
    );

  return (
    <>
      <Title text1={"Applied"} text2={"Jobs"} />

      {appliedJobs.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl font-medium">
            You haven't applied for any jobs yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse rounded-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-left text-white">
                <th className="p-2 pl-5">Company</th>
                <th className="p-2 pl-5">Title</th>
                <th className="p-2 pl-5">Location</th>
                <th className="p-2 pl-5">Roles</th>
                <th className="p-2">Applied Date</th>
              </tr>
            </thead>

            <tbody>
              {appliedJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
                  onClick={() => navigate(`/company/${job._id}`)}
                >
                  <td className="p-2 pl-5">{job.name}</td>
                  <td className="p-2 pl-5">{job.title}</td>
                  <td className="p-2 pl-5">{job.location}</td>

                  {/* FIXED → show roles */}
                  <td className="p-2 pl-5">
                    {job.appliedRoles?.length > 0
                      ? job.appliedRoles.join(", ")
                      : "—"}
                  </td>

                  <td className="p-2 pl-5">
                    {job.appliedAt
                      ? new Date(job.appliedAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AppliedJobs;
