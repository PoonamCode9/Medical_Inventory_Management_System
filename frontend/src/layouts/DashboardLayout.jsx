import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

function DashboardLayout() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <div className="h-full">
                <Sidebar />
            </div>
            
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div>
                    <Navbar />
                </div>
            
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />       {/* placeholder */}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout;