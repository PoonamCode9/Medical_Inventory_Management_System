import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#F4F6F8"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <Navbar />

                <main
                    style={{
                        padding: "30px",
                        flex: 1
                    }}
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;