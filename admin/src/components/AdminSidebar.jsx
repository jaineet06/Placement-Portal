import { NavLink } from "react-router-dom";
import {
  X as XIcon,
  Menu as MenuIcon,
  GraduationCap,
  ListChecks,
  Briefcase,
  FilePlus,
} from "lucide-react";

const links = [
  { name: "Students", path: "/students", icon: <GraduationCap size={20} /> },
  { name: "Verify Users", path: "/verify-user", icon: <ListChecks size={20} /> },
  { name: "Create Job", path: "/create-job", icon: <FilePlus size={20} /> },
  { name: "Job Listings", path: "/jobs", icon: <Briefcase size={20} /> },
];

const AdminSidebar = ({ expanded, setExpanded }) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-black bg-white transition-all duration-300 
        ${expanded ? "w-64" : "w-16"} flex flex-col shadow-sm `}
    > 
      {/* Toggle Button */}
      <div className="flex items-center justify-end px-5 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-gray-500 cursor-pointer"
        >
          {expanded ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="mt-4 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition 
              ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
            }
            title={!expanded ? link.name : ""}
          >
            {link.icon}
            {expanded && <span>{link.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
