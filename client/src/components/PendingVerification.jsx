import { ShieldAlert } from "lucide-react";
const PendingVerification = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] space-y-4 px-6 text-center">
      <div className="p-4 bg-red-50 rounded-full text-red-600 animate-bounce">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">
        Verification Pending
      </h1>
      <p className="text-slate-500 font-medium max-w-md">
        Your account is not yet verified by the Placement Cell. Please contact
        the department admin for approval.
      </p>
    </div>
  );
};

export default PendingVerification;
