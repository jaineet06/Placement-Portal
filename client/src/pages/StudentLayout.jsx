import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentNavBar from "../components/StudentNavBar";
import StudentSideBar from "../components/StudentSideBar";

const StudentLayout = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex min-h-screen ">
      <StudentSideBar expanded={expanded} setExpanded={setExpanded} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentNavBar />

        <main className="flex-1">
          <div className="max-w-8xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
