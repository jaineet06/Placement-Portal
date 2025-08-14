import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

//Base url
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [verified, setVerified] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/get-profile");

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const getStudentVerification = async () => {
    try {
      const { data } = await axios.get("/api/student/is-verifed");
      setVerified(data.success && data.isVerified);
    } catch (error) {
      toast.error(error.message);
      setVerified(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const values = {
    user,
    axios,
    isLoggedIn,
    setIsLoggedIn,
    showUserLogin,
    setShowUserLogin,
    getStudentVerification,
    verified,
  };

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
