import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import Title from "../components/Title";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListOfStudents = () => {
  const { axios } = useAdminContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/student/get-all?page=${page}&limit=${limit}`
      );
      if (data.success) {
        setStudents(data.students);
        setTotalPages(data.total);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (number) => {
    setLimit(number);
    setIsOpen(false);
    setPage(1);
  };

  useEffect(() => {
    fetchStudent();
  }, [page, limit]);

  return loading ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Spinner />
      <p className="text-sm mt-2 font-normal">Fetching students...</p>
    </div>
  ) : (
    <>
      <div className="flex justify-between z-0">
        <Title text1={"All"} text2={"Students"} />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700 font-medium">Select Entries</span>
          <div className="relative w-22">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <span>{limit}</span>
              <ChevronDown
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
                size={15}
              />
            </button>

            {isOpen && (
              <ul className="absolute left-0 top-full z-50 w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                {[10, 25, 50].map((number) => (
                  <li
                    key={number}
                    className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                    onClick={() => handleSelect(number)}
                  >
                    {number}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
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
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 hover:bg-primary-dull/20 cursor-pointer"
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
                      className="px-2 py-2 active:scale-95 transition bg-gray-500/15 border border-blue-500 rounded text-blue-500 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer"
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
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded bg-primary text-white font-medium transition active:scale-95 disabled:opacity-50`}
        >
          Previous
        </button>
        <span className="flex items-center font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded bg-primary text-white font-medium transition active:scale-95 disabled:opacity-50`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ListOfStudents;
