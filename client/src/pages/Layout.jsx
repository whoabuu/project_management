import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTheme } from "../features/themeSlice";
import { Loader2Icon } from "lucide-react";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();
  const {user, isLoaded} = useUser();

  useEffect(() => {
    dispatch(loadTheme());
  }, []);

  if(!user){
    return(
        <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
            <SignIn />

        </div>
    )
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-black">
        <Loader2Icon className="size-7 text-blue-600 animate-spin" />
      </div>
    );

  return (
    // Added background pattern for dynamic feel
    <div className="flex h-screen bg-zinc-50 dark:bg-black overflow-hidden relative">
      {/* Background Grid Pattern (Optional decoration) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(#a1a1aa 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Floating Sidebar Container */}
      <div className="hidden sm:flex z-20 p-3 h-full">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sm:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={true}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
