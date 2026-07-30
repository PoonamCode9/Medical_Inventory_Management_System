import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";



import {
  FaBoxes,
  FaTruck,
  FaShoppingCart,
  FaClipboardList
} from "react-icons/fa";

import { getDashboardData } from "../../services/authService";

import "./StaffDashboard.css";

function StaffDashboard() {

  const [dashboardData, setDashboardData] = useState({
    inventory: 0,
    suppliers: 0,
    purchaseOrders: 0,
    stockLogs: 0
  });

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const token = localStorage.getItem("token");
     

        const response = await getDashboardData(token);
       
        setDashboardData(response.data);

      } catch (error) {

        console.error("Failed to load dashboard data:", error);

      }

    };

    fetchDashboardData();

  }, []);

  return (

    <div className="staff-container">

      <Sidebar role="staff" />

      <div className="main-content">

        <Navbar userName={localStorage.getItem("fullName")} />

        <div className="cards">

          <DashboardCard
            title="Inventory"
            value={dashboardData.inventory}
            icon={<FaBoxes />}
          />

          <DashboardCard
            title="Suppliers"
            value={dashboardData.suppliers}
            icon={<FaTruck />}
          />

          <DashboardCard
            title="Purchase Orders"
            value={dashboardData.purchaseOrders}
            icon={<FaShoppingCart />}
          />

          <DashboardCard
            title="Stock Logs"
            value={dashboardData.stockLogs}
            icon={<FaClipboardList />}
          />

        </div>

      </div>

    </div>

  );

}

export default StaffDashboard;