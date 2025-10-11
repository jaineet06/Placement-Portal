import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNavbar />
      </div>

      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 bottom-0">
          <AdminSidebar expanded={expanded} setExpanded={setExpanded} />
        </div>

        {/* Content */}
        <div
          className={`flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth transition-all duration-300 
          ${expanded ? "ml-64" : "ml-16"} bg-[#F8FAFC]`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;