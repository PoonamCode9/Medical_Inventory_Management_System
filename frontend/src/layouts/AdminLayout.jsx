import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-layout-main">
                <AdminNavbar />

                <main className="admin-layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;