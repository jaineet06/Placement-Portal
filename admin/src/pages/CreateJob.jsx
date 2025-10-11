import { useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Title from "../components/Title";
import Spinner from "../components/Spinner";

const CreateJob = () => {
  const { axios } = useAdminContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !lastDate) {
      toast.error("Title, Description, and Last Date are required!");
      return;
    }

    setLoading(true);

    try {
      // Make backend API call
      const { data } = await axios.post("/api/admin/create", {
        title,
        description,
        location,
        lastDate,
      });

      if (data.success) {
        toast.success("Job created successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setLastDate("");
      } else {
        toast.error(data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Server error while creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full border border-gray-200">
      <Title text1="Create" text2="Job" />

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job Title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job Description"
            rows={4}
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-55 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Location (Optional)"
          />
        </div>

        {/* Last Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Date</label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="mt-1 block w-55 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-40 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white bg-primary hover:bg-primary-dull transition cursor-pointer ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : (
            "Create Job"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
