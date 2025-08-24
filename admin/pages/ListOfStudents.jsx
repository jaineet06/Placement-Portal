import { useEffect, useState } from "react";
import Spinner from "../src/components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../src/context/AdminContext";
import Title from "../src/components/Title";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListOfStudents = () => {
  const { axios } = useAdminContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/student/get-all");
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
      <p className="text-sm mt-2 font-normal">Fetching students...</p>
    </div>
  ) : (
    <>
      <Title text1={"All"} text2={"Students"} />
      <div className="max-w-full mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary text-left text-white">
              <th className="p-2 font-medium pl-5">Enrollment</th>
              <th className="p-2 font-medium">Name</th>
              <th className="p-2 font-medium">Branch</th>
              <th className="p-2 font-medium">Mobile</th>
              <th className="p-2 font-medium">Resume</th>
            </tr>
          </thead>
          <tbody>
            {students.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 cursor-pointer"
                onClick={() => navigate(`/students/${item.enrollmentNo}`)}
              >
                <td className="p-2 pl-5">{item.enrollmentNo}</td>
                <td className="p-2">{item.fullName}</td>
                <td className="p-2">{item.branch}</td>
                <td className="p-2">{item.mobile}</td>
                <td className="p-2">
                  {item.resume ? (
                    <a
                      href={item.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 active:scale-95 transition bg-gray-500/15 border border-blue-500 rounded text-blue-500 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download size={20} />
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No Resume
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListOfStudents;
