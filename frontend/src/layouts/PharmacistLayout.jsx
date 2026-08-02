import { Outlet } from "react-router-dom";
import PharmacistSidebar from "../components/PharmacistSidebar";
import PharmacistNavbar from "../components/PharmacistNavbar";
import "../styles/AdminLayout.css";

function PharmacistLayout() {
    return (
        <div className="admin-layout">
            <PharmacistSidebar />

            <div className="admin-layout-main">
                <PharmacistNavbar />

                <main className="admin-layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PharmacistLayout;