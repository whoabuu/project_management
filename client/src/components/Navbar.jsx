import {
  SearchIcon,
  PanelLeft,
  MoonIcon,
  SunIcon,
  BellIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { assets } from "../assets/assets";
import { UserButton } from "@clerk/clerk-react";

const Navbar = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className="sticky top-0 z-30 w-full px-4 py-3">
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-sm rounded-xl px-4 py-2.5 transition-all">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4 flex-1">
            {/* Sidebar Trigger (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="sm:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <PanelLeft size={20} />
            </button>

            {/* Search Input (Dynamic) */}
            <div className="relative flex-1 max-w-md group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors size-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-zinc-100/50 dark:bg-black/20 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500/30 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 pl-4">
            {/* Notifications (New Addition for 'Dynamic' feel) */}
            <button className="p-2 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
              <BellIcon size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-yellow-400 hover:bg-amber-50 dark:hover:bg-yellow-900/20 rounded-full transition-all"
            >
              {theme === "light" ? (
                <MoonIcon size={18} />
              ) : (
                <SunIcon size={18} />
              )}
            </button>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

            {/* User Profile */}
            <UserButton/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
