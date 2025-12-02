import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const AdminContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AdminContextProvider = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/get-profile");
      if (data.success) {
        if (data.user.role === "admin") {
          setIsAdmin(true);
          setUser(data.user);
        } else {
          toast.error("Sorry, only admin can access");
        }
      }
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, [user]);

  const values = { axios, user, isAdmin, setUser, setIsAdmin, fetchUser };
  return (
    <AdminContext.Provider value={values}>
      {props.children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};