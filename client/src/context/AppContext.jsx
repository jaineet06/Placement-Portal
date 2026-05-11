import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(true);
  const [verified, setVerified] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/get-profile");
      setUser(data.user);
      setIsLoggedIn(true);
      setShowUserLogin(false);
      return true;
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Failed to load profile. Please refresh.");
      }
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
  };

  const getStudentVerification = async () => {
    try {
      const { data } = await axios.get("/api/student/is-verifed");
      setVerified(data.isVerified);
      if (!data.isVerified) setShowUserLogin(true);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Could not check verification status.");
      }
      setVerified(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      const loggedIn = await fetchUser();
      if (loggedIn) await getStudentVerification();
      setAuthLoading(false);
    };
    init();
  }, []);

  const values = {
    user,
    setUser,
    axios,
    isLoggedIn,
    setIsLoggedIn,
    showUserLogin,
    setShowUserLogin,
    getStudentVerification,
    verified,
    setVerified,
    authLoading,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);