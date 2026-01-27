import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import MyTasksSidebar from "./MyTasksSidebar";
import ProjectSidebar from "./ProjectsSidebar";
import WorkspaceDropdown from "./WorkspaceDropdown";
import {
  FolderOpenIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { name: "Projects", href: "/projects", icon: FolderOpenIcon },
    { name: "Team", href: "/team", icon: UsersIcon },
  ];

  const sidebarRef = useRef(null);

  // Close on click outside (mobile only)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen, isMobile]);

  // Dynamic Classes
  const containerClasses = isMobile
    ? "w-72 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl"
    : "w-64 h-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-2xl shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800";

  return (
    <div
      ref={sidebarRef}
      className={`flex flex-col transition-all duration-300 ${containerClasses}`}
    >
      {/* Header / Workspace Selector */}
      <div className="p-2">
        <WorkspaceDropdown />
      </div>

      <div className="px-4 mb-2">
        <hr className="border-zinc-200 dark:border-zinc-800/50" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 px-3 py-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Platform
          </p>
          {menuItems.map((item) => (
            <NavLink
              to={item.href}
              key={item.name}
              className={({ isActive }) => `
                                group flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                                ${
                                  isActive
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 translate-x-1"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                }
                            `}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <p className="truncate">{item.name}</p>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Dynamic Sub-sections */}
        <div>
          <MyTasksSidebar />
        </div>
        <div>
          <ProjectSidebar />
        </div>
      </div>

      {/* Footer / Settings */}
      <div className="p-3 mt-auto">
        <button className="flex w-full items-center gap-3 py-2.5 px-3 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
          <SettingsIcon
            size={18}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
          <p className="text-sm font-medium">Settings</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
