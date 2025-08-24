import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../pages/AdminLayout";
import { useAdminContext } from "./context/AdminContext";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import ListOfStudents from "../pages/ListOfStudents";
import VerifyUsers from "../pages/VerifyUsers";
import StudentDetails from "../pages/StudentDetails";

const App = () => {
  const { isAdmin, user } = useAdminContext();

  return (
    <div>
      <Toaster />
      {!user && <Login />}
      {isAdmin && (
        <Routes>
          <Route path="/*" element={<AdminLayout />}>
            <Route path="students" element={<ListOfStudents />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="verify-user" element={<VerifyUsers />} />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
