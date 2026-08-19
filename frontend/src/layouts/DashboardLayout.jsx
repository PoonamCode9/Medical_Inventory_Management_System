import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-900/5 backdrop-blur-xs z-40 xl:hidden transition-opacity duration-200"
        />
      )}

      <div
        className={`h-full ${
          isSidebarOpen ? "block" : "hidden xl:block"
        }`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        <div>
          <Navbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-1 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;