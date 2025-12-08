import { useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Title from "../components/Title";
import Spinner from "../components/Spinner";
import { Trash2 as DeleteIcon } from "lucide-react";

const CreateJob = () => {
  const { axios } = useAdminContext();
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);
  const [addRole, setAddRole] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleAdd = () => {
    if (!addRole.trim()) return;
    setRoles((prev) => [...prev, addRole.trim()]);
    setAddRole("");
  };

  const handleRoleRemove = (role) => {
    setRoles((prev) => prev.filter((r) => r !== role));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !title || !description || !lastDate) {
      toast.error("All fields are required!");
      return;
    }
    if (roles.length === 0) {
      toast.error("Please add at least one role!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/admin/create", {
        name,
        title,
        description,
        location,
        lastDate,
        roles,
      });

      if (data.success) {
        toast.success("Job created successfully!");
        setName("");
        setTitle("");
        setDescription("");
        setLocation("");
        setLastDate("");
        setRoles([]);
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

      <form
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Company name"
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job Title"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Location (Optional)"
          />
        </div>

        {/* Last Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Date
          </label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Description (full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job Description"
            rows={4}
            required
          />
        </div>

        {/* Roles input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Roles
          </label>
          <div className="mt-1 flex gap-3">
            <input
              type="text"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add new role"
            />
            <button
              type="button"
              onClick={handleRoleAdd}
              className="bg-primary/80 text-white px-4 py-2 rounded-md hover:bg-primary cursor-pointer"
            >
              Add Role
            </button>
          </div>

          {/* Display Roles*/}
          {roles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm"
                >
                  <span>{role}</span>
                  <DeleteIcon
                    onClick={() => handleRoleRemove(role)}
                    width={15}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button (full width) */}
        <div className="md:col-span-2 flex justify-start">
          <button
            type="submit"
            className={`flex items-center gap-2 py-2 px-6 rounded-md text-white bg-primary hover:bg-primary-dull transition cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
