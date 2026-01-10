import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  Bookmark,
  Bell,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

const links = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Companies", path: "/company", icon: Bookmark },
  { name: "Applied Jobs", path: "/applied-job", icon: Bell },
];

const StudentSideBar = ({ expanded, setExpanded }) => {
  return (
    <div
      className={`bg-slate-800 border-r border-slate-700 flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        <div className={`flex items-center gap-2 ${!expanded && "mx-auto"}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dull rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {expanded && (
            <span className="font-bold text-white text-lg tracking-tight truncate">
              Placement Portal
            </span>
          )}
        </div>

        {expanded && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {!expanded && (
          <button onClick={() => setExpanded(!expanded)} className="hidden" />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                    }`
                  }
                  title={!expanded ? link.name : ""}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors duration-200`}
                  />
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                  >
                    <span className="text-md whitespace-nowrap">
                      {link.name}
                    </span>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        {expanded ? (
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">
            GEC Bharuch Placement
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex justify-center text-slate-400 hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentSideBar;
