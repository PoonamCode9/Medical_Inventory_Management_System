import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/authService";

import {
    FaUsers,
    FaPills,
    FaTruck,
    FaBoxes,
    FaExclamationTriangle,
    FaCalendarAlt
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {

const [dashboardData, setDashboardData] = useState({
    users: 0,
    medicines: 0,
    suppliers: 0,
    inventory: 0,
    lowStock: 0,
    expiryAlerts: 1
});
    useEffect(() => {

    const loadDashboard = async () => {

        try{

            const token = localStorage.getItem("token");

            const response = await getDashboardData(token);

            setDashboardData(response.data);

        }catch(error){

            console.log(error);

        }

    };

    loadDashboard();

},[]);

    return (

        <div className="admin-container">

            <Sidebar role="admin"/>

            <div className="main-content">

               <Navbar userName={localStorage.getItem("fullName")} />

                <div className="cards">

                    <DashboardCard
                        title="Users"
                        value={dashboardData.users}
                        icon={<FaUsers />}
                    />

                    <DashboardCard
                        title="Medicines"
                        value={dashboardData.medicines}
                        icon={<FaPills />}
                    />

                    <DashboardCard
                        title="Suppliers"
                        value={dashboardData.suppliers}
                        icon={<FaTruck />}
                    />

                    <DashboardCard
                        title="Inventory"
                        value={dashboardData.inventory}
                        icon={<FaBoxes />}
                    />

                    <DashboardCard
                        title="Low Stock"
                        value={dashboardData.lowStock}
                        icon={<FaExclamationTriangle />}
                    />

                    <DashboardCard
                        title="Expiry Alerts"
                        value={1}
                        icon={<FaCalendarAlt />}
                    />

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;