import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
import StaffNavbar from "../components/StaffNavbar";
import "../styles/AdminLayout.css";

function StaffLayout() {
    return (
        <div className="admin-layout">
            <StaffSidebar />

            <div className="admin-layout-main">
                <StaffNavbar />

                <main className="admin-layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default StaffLayout;