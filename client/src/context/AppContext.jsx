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
  const [showUserLogin, setShowUserLogin] = useState(true);
  const [verified, setVerified] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/get-profile");

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        setShowUserLogin(false);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const getStudentVerification = async () => {
    try {
      const { data } = await axios.get("/api/student/is-verifed");
      if (!data.success) {
        setShowUserLogin(true);
      } else {
        setVerified(data.isVerified);
      }
    } catch (error) {
      toast.error(error.message);
      setVerified(false);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!user?._id) return;
    setAppliedJobsLoading(true);
    try {
      const { data } = await axios.get(`/api/student/job/apply/get-all/${user._id}`);
      if (data.success) {
        setAppliedJobs(data.appliedJobs ?? []);
      } else {
        setAppliedJobs([]);
      }
    } catch {
      setAppliedJobs([]);
    } finally {
      setAppliedJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    getStudentVerification();
  }, []);

  useEffect(() => {
    if (verified && user?._id) {
      fetchAppliedJobs();
    } else {
      setAppliedJobs([]);
    }
  }, [verified, user]);

  const values = {
    user,
    axios,
    isLoggedIn,
    setIsLoggedIn,
    showUserLogin,
    setShowUserLogin,
    getStudentVerification,
    verified,
    appliedJobs,
    appliedJobsLoading,
    fetchAppliedJobs,
  };

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
