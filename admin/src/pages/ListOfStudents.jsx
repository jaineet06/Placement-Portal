import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";
import {
  ChevronDown,
  Download,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Filter,
  Lock, LockOpen 
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleBlockStatus = async (student) => {
    try {
      const endpoint = student.isBlocked
        ? `/api/admin/unblock/${student.user._id}`
        : `/api/admin/block/${student.user._id}`;

      const { data } = await axios.patch(endpoint);

      

        if (data.success) {
          toast.success(data.message);
          fetchStudent();
        }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/student/get-all?page=${page}&limit=${limit}&search=${searchQuery}`,
      );
      if (data.success) {
        setStudents(data.students);
        setTotalPages(data.total);
      }
    } catch (error) {
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

  return (
    <div className="p-4 space-y-8 max-w-8xl mx-auto min-h-screen bg-slate-50/50">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-primary shadow-sm">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Student <span className="text-primary italic">Directory</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              View and manage registered students
            </p>
          </div>
        </div>

        {/* Controls (Search + Filter) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar - Unified Design */}
          <div className="relative group w-full md:w-80">
            <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all overflow-hidden">
              <div className="pl-4 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="w-full px-3 py-3 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                placeholder="Search enrollment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchStudent()}
              />
              <button
                onClick={fetchStudent}
                className="bg-slate-900 text-white px-5 py-3 text-sm font-bold hover:bg-black transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Rows Selector */}
          <div className="relative min-w-[140px]">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm shadow-sm hover:bg-slate-50 transition-all"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                {limit} Rows
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                {[10, 25, 50, 100].map((number) => (
                  <button
                    key={number}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                      limit === number
                        ? "bg-primary/5 text-primary"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => handleSelect(number)}
                  >
                    {number} Entries
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spinner />
            <p className="text-slate-500 text-sm mt-4 font-medium animate-pulse">
              Syncing student records...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Enrollment
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Student Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Resume
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <UserCircle size={48} className="mb-4 text-slate-200" />
                        <p className="font-bold">
                          No students found matching your search.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        navigate(`/students/${item.user.enrollNumber}`)
                      }
                      className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-sm group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                          {item.user.enrollNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
                            {item.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">
                              {item.fullName}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">
                              {item.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                          {item.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 text-sm">
                        {item.mobile}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.resume && item.resume.url ? (
                          <a
                            href={item.resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-primary hover:text-white transition-all border border-slate-200 hover:border-primary shadow-sm"
                          >
                            <Download size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              PDF
                            </span>
                          </a>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
  onClick={(e) => {
    e.stopPropagation();
    toggleBlockStatus(item);
  }}
  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200
    ${
      item.isBlocked
        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
    }`}
>
  {item.isBlocked ? <LockOpen size={14} /> : <Lock size={14} />}
  {item.isBlocked ? "Unblock" : "Block"}
</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- PAGINATION SECTION --- */}
      {!loading && students.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-xs font-bold text-slate-400">
            Page <span className="text-slate-800">{page}</span> of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfStudents;
