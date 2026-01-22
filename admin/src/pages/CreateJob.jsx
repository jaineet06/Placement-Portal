import { useState, useRef, useEffect } from "react";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Title from "../components/Title";
import { Trash2 as DeleteIcon } from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const CreateJob = () => {
  const { axios } = useAdminContext();
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);
  const [addRole, setAddRole] = useState("");
  const [title, setTitle] = useState("");
  //const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState(""); // Missing Field 1
  const [rounds, setRounds] = useState([]); // Missing Field 2
  const [addRound, setAddRound] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleRoleAdd = () => {
    if (!addRole.trim()) return;
    setRoles((prev) => [...prev, addRole.trim()]);
    setAddRole("");
  };

  const handleRoundAdd = () => {
    if (!addRound.trim()) return;
    setRounds((prev) => [...prev, addRound.trim()]);
    setAddRound("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;

    if (!name || !title || !description || !lastDate || !jobType) {
      toast.error("All fields are required!");
      return;
    }
    if (roles.length === 0) {
      toast.error("Please add at least one role!");
      return;
    }
    if (rounds.length === 0) {
      toast.error("Please add at least one round!");
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
        jobType,
        rounds,
        roles,
      });

      if (data.success) {
        toast.success("Job created successfully!");
        setName("");
        setTitle("");
        //setDescription("");
        setLocation("");
        setLastDate("");
        setJobType("");
        setRoles([]);
        setRounds([]);
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

        {/* Job Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            required
          >
            <option value="">Select Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
            <option value="Internship + FTE">Internship + FTE</option>
          </select>
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

        {/* Location */}
        <div className="md:col-span-2">
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

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>

          <div
            ref={editorRef}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white "
            style={{ minHeight: "50px" }}
          ></div>
        </div>

        {/* Roles input */}
        <div className="md:col-span-2 mt-15">
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
          {roles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm"
                >
                  <span>{role}</span>
                  <DeleteIcon
                    onClick={() => setRoles(roles.filter((r) => r !== role))}
                    width={15}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rounds input (Missing Field 2 UI) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Interview Rounds
          </label>
          <div className="mt-1 flex gap-3">
            <input
              type="text"
              value={addRound}
              onChange={(e) => setAddRound(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Online Assessment, Technical Interview"
            />
            <button
              type="button"
              onClick={handleRoundAdd}
              className="bg-primary/80 text-white px-4 py-2 rounded-md hover:bg-primary cursor-pointer"
            >
              Add Round
            </button>
          </div>
          {rounds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-full text-sm"
                >
                  <span>{round}</span>
                  <DeleteIcon
                    onClick={() => setRounds(rounds.filter((r) => r !== round))}
                    width={15}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-start">
          <button
            type="submit"
            className={`flex items-center gap-2 py-2 px-6 rounded-md text-white bg-primary hover:bg-primary-dull transition cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
