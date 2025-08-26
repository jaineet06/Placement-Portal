import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentNavBar from "../components/StudentNavBar";
import StudentSideBar from "../components/StudentSideBar";

const StudentLayout = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentNavBar />
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 bottom-0">
          <StudentSideBar expanded={expanded} setExpanded={setExpanded} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth bg-[#F8FAFC]
          ${expanded ? "ml-64" : "ml-16"}`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default StudentLayout;
