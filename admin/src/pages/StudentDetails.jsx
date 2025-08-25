import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const StudentDetails = () => {
  const { id } = useParams();
  const { axios } = useAdminContext();
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/student/${id}`);
      if (data.success) {
        setStudent(data.student);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return loading ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Spinner />
      <p className="text-sm mt-2 font-normal">Fetching student...</p>
    </div>
  ) : (
    <>
      <Title text1="Student" text2="Details" />

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-10">
        <h1 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Personal Details
        </h1>

        {/* Profile and Basic Info */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src={student.profilePath?.url || "/avatar.jpg"}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {student.fullName}
            </p>
            <p className="text-sm text-gray-500">{student.user?.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-500">Enrollment No</label>
            <p className="text-gray-800">{student.enrollmentNo}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Branch</label>
            <p className="text-gray-800">{student.branch}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Birth Date</label>
            <p className="text-gray-800">
              {new Date(student.birthDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Category</label>
            <p className="text-gray-800">{student.category}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mobile</label>
            <p className="text-gray-800">{student.mobile}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Alternate Mobile</label>
            <p className="text-gray-800">
              {student.alternateMobile || (
                <span className="italic text-gray-500">Not Provided</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Parent Name</label>
            <p className="text-gray-800">{student.parentName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Parent Mobile</label>
            <p className="text-gray-800">{student.parentMobile}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Resume</label>
            {student.resume?.url ? (
              <a
                href={student.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Resume
              </a>
            ) : (
              <p className="text-gray-500 italic">Not uploaded</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
