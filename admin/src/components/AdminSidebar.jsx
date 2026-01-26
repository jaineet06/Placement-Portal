import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  GraduationCap,
  ListChecks,
  Briefcase,
  FilePlus,
  Newspaper,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Students", path: "/students", icon: GraduationCap },
  { name: "Verify Users", path: "/verify-user", icon: ListChecks },
  { name: "Create Job", path: "/create-job", icon: FilePlus },
  { name: "Job Listings", path: "/jobs", icon: Briefcase },
  { name: "News", path: "/news", icon: Newspaper },
];

const AdminSidebar = ({ expanded, setExpanded }) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900 transition-all duration-300 z-50
        ${
          expanded ? "w-64" : "w-20"
        } flex flex-col shadow-2xl border-r border-slate-800`}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-8 bg-primary text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-all z-50 cursor-pointer border-2 border-slate-900"
      >
        <ChevronLeft
          size={14}
          className={`transition-transform duration-500 ${
            !expanded && "rotate-180"
          }`}
        />
      </button>

      {/* Navigation Links */}
      <div className="mt-8 flex flex-col gap-2 px-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
            title={!expanded ? link.name : ""}
          >
            {/* Icon - Always centered in collapsed mode */}
            <div
              className={`flex items-center justify-center shrink-0 ${
                !expanded && "w-full"
              }`}
            >
              <link.icon
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
            </div>

            {/* Label - Animated expansion */}
            <span
              className={`font-medium text-md whitespace-nowrap transition-all duration-300 overflow-hidden
              ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
            >
              {link.name}
            </span>

            {/* Active Indicator Dot (Collapsed Mode) */}
            {!expanded && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
