import { Outlet } from "react-router-dom";
import StudentNavBar from "../components/StudentNavBar";
import StudentSideBar from "../components/StudentSideBar";

const StudentLayout = () => {
  return (
    <>
      <StudentNavBar />
      <div className="flex">
        <StudentSideBar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default StudentLayout;
