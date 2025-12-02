import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Trash2 } from "lucide-react";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAdminContext();
  const [student, setStudent] = useState({});
  const [address, setAddress] = useState({ permanent: {}, current: {} });
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/student/${id}`);
      if (data.success) {
        setStudent(data.student);
        setUserId(data.student.user._id);
        const { data: eduData } = await axios.get(
          `/api/admin/education/${data.student.user._id}`
        );
        if (eduData.success) {
          setEducation(eduData.education);
        } else {
          toast.error(eduData.message);
        }
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

  const deleteStudent = async () => {
    if (
      !window.confirm(
        "This will permanently delete student and their related data"
      )
    )
      return;

    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/admin/delete/${userId}`);
      if (data.success) {
        toast.success(data.message);
        navigate("/students");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch student details");
    } finally {
      setDeleting(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/admin/address/${id}`);
      if (data.success) {
        setAddress(data.address);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch address details");
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchAddresses();
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
            <p className="text-gray-800">{student.user?.enrollNumber}</p>
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

      {/* Address Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-10">
        <h1 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Address Details
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Permanent Address
            </h2>
            {address.permanent?.address ? (
              <div className="text-gray-800">
                <p>{address.permanent.address}</p>
                <p>
                  {address.permanent.city}, {address.permanent.state}
                </p>
                <p>
                  {address.permanent.pincode}, {address.permanent.country}
                </p>
              </div>
            ) : (
              <p className="italic text-gray-500">Not Provided</p>
            )}
          </div>

          {/* Current Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Current Address
            </h2>
            {address.current?.address ? (
              <div className="text-gray-800">
                <p>{address.current.address}</p>
                <p>
                  {address.current.city}, {address.current.state}
                </p>
                <p>
                  {address.current.pincode}, {address.current.country}
                </p>
              </div>
            ) : (
              <p className="italic text-gray-500">Not Provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Education Details Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-10">
        <h1 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Education Details
        </h1>

        {education ? (
          <>
            {/* SSC + Either HSC or Diploma */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              {/* SSC */}
              <div>
                <label className="text-sm text-gray-700 font-semibold">
                  SSC
                </label>
                <p className="text-gray-800">
                  {education.ssc?.percentage || "N/A"}%
                </p>
                <p className="text-xs text-gray-500">
                  Year: {education.ssc?.passoutYear || "N/A"}
                </p>
              </div>

              {/* HSC or Diploma */}
              {education.hsc ? (
                <div>
                  <label className="text-sm text-gray-700 font-semibold">
                    HSC
                  </label>
                  <p className="text-gray-800">
                    {education.hsc?.percentage || "N/A"}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Year: {education.hsc?.passoutYear || "N/A"}
                  </p>
                </div>
              ) : education.diploma ? (
                <div>
                  <label className="text-sm text-gray-700 font-semibold">
                    Diploma
                  </label>
                  <p className="text-gray-800">
                    {education.diploma?.percentage || "N/A"}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Year: {education.diploma?.passoutYear || "N/A"}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-sm text-gray-700 font-semibold">
                    HSC / Diploma
                  </label>
                  <p className="text-gray-500 italic">Not Provided</p>
                </div>
              )}
            </div>

            {/* CPI and CGPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm text-gray-700 font-semibold">
                  CPI
                </label>
                <p className="text-gray-800">{education.cpi || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-700 font-semibold">
                  CGPA
                </label>
                <p className="text-gray-800">{education.cgpa || "N/A"}</p>
              </div>
            </div>

            {/* SPI List */}
            <div className="mt-6">
              <label className="text-sm text-gray-700 font-semibold">SPI</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {education.spi?.length > 0 ? (
                  education.spi.map((score, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700"
                    >
                      Sem {index + 1}: {score}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No SPI data available</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">No education data available</p>
        )}
      </div>
      <button
        type="button"
        onClick={deleteStudent}
        disabled={deleting}
        className={`flex items-center mt-5 px-8 py-3 rounded text-white text-sm font-medium transition-transform active:scale-95 border border-red-700 bg-red-500 hover:bg-red-600 cursor-pointer ${
          deleting ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {deleting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/50 border-t-white" />
        ) : (
          <div className="flex items-center justify-center">
            <Trash2 className="w-4 h-4 mr-2" />
            <p className="font-normal text-sm">Delete</p>
          </div>
        )}
      </button>
    </>
  );
};

export default StudentDetails;
