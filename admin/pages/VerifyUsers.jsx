import React, { useEffect, useState } from "react";
import Spinner from "../src/components/Spinner";
import { useAdminContext } from "../src/context/AdminContext";
import Title from "../src/components/Title";
import { SquareCheck } from "lucide-react";
import toast from "react-hot-toast";

const VerifyUsers = () => {
  const { axios } = useAdminContext();
  const [verifyUser, setVerfiyUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchNotVerifiedUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/auth/get-all");
      if (data.success) {
        setVerfiyUser(data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyUserById = async (id) => {
    setVerifying(true);
    try {
      const { data } = await axios.post("/api/auth/verify-user", { id });
      if (data.success) {
        toast.success(data.message);
        setVerfiyUser((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchNotVerifiedUsers();
  }, []);
  return loading ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Spinner />
      <p className="text-sm mt-2 font-normal">Fetching users...</p>
    </div>
  ) : (
    <>
      <Title text1={"Verfiy"} text2={"Users"} />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Email</th>
              <th className="p-2 font-medium">Verify</th>
            </tr>
          </thead>
          <tbody>
            {verifyUser.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 pl-5">{item.name}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => verifyUserById(item._id)}
                    className="px-6 py-2 active:scale-95 transition bg-gray-500/15 border border-blue-500 rounded text-blue-500 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/50 border-t-primary" />
                        <p>Verifying...</p>
                      </>
                    ) : (
                      <>
                        <SquareCheck size={15} />
                        Verify
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VerifyUsers;
