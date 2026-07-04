import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import {
    Trash2,
    User,
    MapPin,
    GraduationCap,
    ChevronLeft,
    Mail,
    Phone,
    Calendar,
    Hash,
    FileText,
    BookOpen,
    Key // Added the Key icon for the reset button
} from "lucide-react";

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios } = useAdminContext();
    const [student, setStudent] = useState({});
    const [address, setAddress] = useState({ permanent: {}, current: {} });
    const [education, setEducation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [sendingReset, setSendingReset] = useState(false); // New state for reset link
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
                if (eduData.success) setEducation(eduData.education);
            }
        } catch (error) {
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get(`/api/admin/address/${id}`);
            if (data.success) setAddress(data.address);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudent();
        fetchAddresses();
    }, []);

    const deleteStudent = async () => {
        if (
            !window.confirm("Permanently delete this student and all related data?")
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
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    const sendResetLink = async () => {
        if (!student.user?.email) {
            return toast.error("Student email not found.");
        }

        setSendingReset(true);
        try {
            const { data } = await axios.post(`/api/admin/reset-pass/${userId}`);

            if (data.success) {
                toast.success(`Reset link sent to ${student.user.email}`);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to send reset link."
            );
        } finally {
            setSendingReset(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center h-screen items-center">
                <Spinner />
            </div>
        );

    const LabelVal = ({ icon: Icon, label, value, isLink }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                {Icon && <Icon size={12} />} {label}
            </p>
            {isLink ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-primary hover:underline truncate block"
                >
                    View Document
                </a>
            ) : (
                <p className="text-sm font-bold text-slate-700 break-words">
                    {value || "—"}
                </p>
            )}
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-all w-fit"
                >
                    <ChevronLeft size={20} /> Back to Directory
                </button>

                {/* Action Buttons Container */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={sendResetLink}
                        disabled={sendingReset || !student.user?.email}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 rounded-xl cursor-pointer font-bold border border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm disabled:opacity-50"
                    >
                        {sendingReset ? (
                            "Sending..."
                        ) : (
                            <>
                                <Key size={18} /> Send Reset Link
                            </>
                        )}
                    </button>

                    <button
                        onClick={deleteStudent}
                        disabled={deleting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                        {deleting ? (
                            "Deleting..."
                        ) : (
                            <>
                                <Trash2 size={18} /> Delete Record
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Profile & Contact */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-slate-100/50" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200 mb-4">
                                <img
                                    src={student.profilePath?.url || "/avatar.jpg"}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {student.fullName}
                            </h2>
                            <p className="text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full mt-2 inline-block">
                                {student.user?.enrollNumber}
                            </p>
                            <p className="text-slate-500 font-medium text-xs mt-2">
                                {student.branch}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <User size={20} className="text-primary" /> Personal Info
                        </h3>
                        <div className="grid grid-cols-1 gap-5">
                            <LabelVal
                                icon={Mail}
                                label="Email Address"
                                value={student.user?.email}
                            />
                            <LabelVal
                                icon={Phone}
                                label="Student Mobile"
                                value={student.mobile}
                            />
                            <LabelVal
                                icon={Calendar}
                                label="Date of Birth"
                                value={new Date(student.birthDate).toLocaleDateString()}
                            />
                            <LabelVal icon={Hash} label="Category" value={student.category} />
                            <LabelVal
                                icon={User}
                                label="Parent Name"
                                value={student.parentName}
                            />
                            <LabelVal
                                icon={Phone}
                                label="Parent Mobile"
                                value={student.parentMobile}
                            />
                            <LabelVal
                                icon={FileText}
                                label="Resume"
                                value={student.resume?.url}
                                isLink
                            />
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN: Address */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm h-full">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                            <MapPin size={20} className="text-primary" /> Address Details
                        </h3>

                        <div className="space-y-8">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Permanent Address
                                </p>
                                {address.permanent?.address ? (
                                    <div className="text-sm font-bold text-slate-700 leading-relaxed">
                                        <p>{address.permanent.address}</p>
                                        <p>
                                            {address.permanent.city}, {address.permanent.state}
                                        </p>
                                        <p>
                                            {address.permanent.pincode}, {address.permanent.country}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Not Provided</p>
                                )}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Current Address
                                </p>
                                {address.current?.address ? (
                                    <div className="text-sm font-bold text-slate-700 leading-relaxed">
                                        <p>{address.current.address}</p>
                                        <p>
                                            {address.current.city}, {address.current.state}
                                        </p>
                                        <p>
                                            {address.current.pincode}, {address.current.country}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Not Provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Education */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm h-full">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                            <GraduationCap size={20} className="text-primary" /> Academic
                            Record
                        </h3>

                        {education ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary/5 p-4 rounded-2xl text-center border border-primary/10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            CPI
                                        </p>
                                        <p className="text-2xl font-black text-primary">
                                            {education.cpi || "—"}
                                        </p>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-2xl text-center border border-primary/10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            CGPA
                                        </p>
                                        <p className="text-2xl font-black text-primary">
                                            {education.cgpa || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-black text-slate-500 uppercase">
                      SSC (10th)
                    </span>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-800">
                                                {education.ssc?.percentage}%
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {education.ssc?.passoutYear}
                                            </p>
                                        </div>
                                    </div>

                                    {education.hsc && (
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-slate-500 uppercase">
                        HSC (12th)
                      </span>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {education.hsc?.percentage}%
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    {education.hsc?.passoutYear}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {education.diploma && (
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-slate-500 uppercase">
                        Diploma
                      </span>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {education.diploma?.percentage}%
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    {education.diploma?.passoutYear}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                        <BookOpen size={12} /> Semester SPI
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {education.spi?.length > 0 ? (
                                            education.spi.map((score, i) => (
                                                <div
                                                    key={i}
                                                    className="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
                                                >
                                                    <span className="text-slate-400 mr-1">S{i + 1}:</span>
                                                    {score}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No Data</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400 text-sm font-medium italic">
                                Education details not yet updated.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;