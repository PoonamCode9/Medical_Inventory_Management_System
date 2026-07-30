import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/authService";


import {
  FaPills,
  FaBoxes,
  FaCalendarAlt,
  FaBell
} from "react-icons/fa";

import "./PharmacistDashboard.css";

function PharmacistDashboard() {
    const [dashboardData, setDashboardData] = useState({
        availableMedicines: 0,
        stockAvailable: 0,
        expiryAlerts: 0,
        notifications: 0
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

    <div className="pharmacist-container">

      <Sidebar role="pharmacist" />

      <div className="main-content">

        <Navbar userName={localStorage.getItem("fullName")} />

        <div className="cards">

          <DashboardCard
            title="Available Medicines"
            value={dashboardData.medicines}
            icon={<FaPills />}
          />
          

          <DashboardCard
            title="Stock Available"
            value={dashboardData.inventory}
            icon={<FaBoxes />}
          />

          <DashboardCard
            title="Expiry Alerts"
            value={1}
            icon={<FaCalendarAlt />}
          />

          <DashboardCard
            title="Notifications"
            value={dashboardData.notifications}
            icon={<FaBell />}
          />

        </div>

      </div>

    </div>

  );

}

export default PharmacistDashboard;