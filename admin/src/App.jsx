import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAdminContext } from "./context/AdminContext";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./pages/AdminLayout.jsx";
import ListOfStudents from "./pages/ListOfStudents.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import VerifyUsers from "./pages/VerifyUsers.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import JobListing from "./pages/JobListing.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import News from "./pages/News.jsx";

const App = () => {
  const { isAdmin, user } = useAdminContext();

  return (
    <div>
      <Toaster />
      {!user && <Login />}
      {isAdmin && (
        <Routes>
          <Route path="/*" element={<AdminLayout />}>
            <Route path="students" index element={<ListOfStudents />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="verify-user" element={<VerifyUsers />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="jobs" element={<JobListing />} />
            <Route path="job/get/:jobId" element={<JobDetails />} />
            <Route path="news" element={<News />} />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
