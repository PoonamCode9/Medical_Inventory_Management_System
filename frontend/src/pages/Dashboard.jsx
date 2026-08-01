import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Dashboard.css";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [analytics, setAnalytics] = useState({
    totalMedicines: 0,
    suppliers: 0,
    notifications: 0,
    reports: 0,
  });

  const [notifications, setNotifications] = useState([]);

  const [expired, setExpired] = useState(0);
  const [nearExpiry, setNearExpiry] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    loadDashboard();

  }, [navigate]);

  const loadDashboard = async () => {

  try {

    const medicinesResponse = await API.get("/medicines");
    const suppliersResponse = await API.get("/suppliers");

    setAnalytics({
      totalMedicines: medicinesResponse.data.length,
      suppliers: suppliersResponse.data.length,
      notifications: 0,
      reports: 0
    });

    try {
      const notificationResponse = await API.get("/notifications");
      setNotifications(notificationResponse.data);
    } catch {
      setNotifications([]);
    }

    try {
      const expiredResponse = await API.get("/medicines/expired");
      setExpired(expiredResponse.data);
    } catch {
      setExpired(0);
    }

    try {
      const nearExpiryResponse = await API.get("/medicines/nearexpiry");
      setNearExpiry(nearExpiryResponse.data);
    } catch {
      setNearExpiry(0);
    }

    try {
      const lowStockResponse = await API.get("/medicines/lowstock");
      setLowStock(lowStockResponse.data);
    } catch {
      setLowStock(0);
    }

  } catch (error) {

    console.log(error);

  }

};

  const logout = () => {

    localStorage.clear();
    navigate("/");

  };

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12)
    greeting = "Good Morning";
  else if (hour < 17)
    greeting = "Good Afternoon";

  const chartData = {

    labels: [
      "Medicines",
      "Suppliers",
      "Notifications",
      "Reports",
    ],

    datasets: [
      {
        label: "Analytics",
        data: [
          analytics.totalMedicines,
          analytics.suppliers,
          analytics.notifications,
          analytics.reports,
        ],
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
        ],
        borderRadius: 10,
      },
    ],
  };

  return (

    <>

      <Sidebar role={role} logout={logout} />

      <Navbar />

      <div className="dashboard-content">

        <div className="container mt-4">

          {/* HERO */}

          <div className="hero-section">

            <div>

              <h1 className="hero-title">
                {greeting}, {name} 👋
              </h1>

              <p className="hero-subtitle">
                Manage medicines, inventory and suppliers from one place.
              </p>

              <span className="badge role-badge">
                {role}
              </span>

            </div>

            <div className="hero-date">

              <h3>{new Date().toLocaleDateString()}</h3>

              <p>Today's Overview</p>

            </div>

          </div>

          {/* ANALYTICS */}

          <div className="analytics-grid">

            <div className="analytics-card blue">

              <div>

                <p>Total Medicines</p>

                <h2>{analytics.totalMedicines}</h2>

                <span>Available Medicines</span>

              </div>

              <div className="card-icon">💊</div>

            </div>

            <div className="analytics-card green">

              <div>

                <p>Suppliers</p>

                <h2>{analytics.suppliers}</h2>

                <span>Registered Suppliers</span>

              </div>

              <div className="card-icon">🏢</div>

            </div>

            <div className="analytics-card orange">

              <div>

                <p>Notifications</p>

                <h2>{lowStock + expired + nearExpiry}</h2>

                <span>Recent Alerts</span>

              </div>

              <div className="card-icon">🔔</div>

            </div>

            <div className="analytics-card purple">

              <div>

                <p>Reports</p>

                <h2>{analytics.reports}</h2>

                <span>Generated Reports</span>

              </div>

              <div className="card-icon">📊</div>

            </div>

            <div className="analytics-card red">

              <div>

                <p>Expired</p>

                <h2>{expired}</h2>

                <span>Expired Medicines</span>

              </div>

              <div className="card-icon">❌</div>

            </div>

            <div className="analytics-card yellow">

              <div>

                <p>Near Expiry</p>

                <h2>{nearExpiry}</h2>

                <span>Expiring Soon</span>

              </div>

              <div className="card-icon">⏰</div>

            </div>

          </div>
                    {/* Latest Notifications & Quick Access */}

          <div className="row mb-4">

            <div className="col-md-8">

              <div className="card shadow border-0 rounded-4 h-100">

                <div className="card-body">

                  <h4 className="mb-4">
                    Latest Notifications
                  </h4>

                  {notifications.length === 0 ? (

                    <p>No Notifications</p>

                  ) : (

                    notifications.slice(0, 5).map((notification) => (

                      <div
                        key={notification.id}
                        className="notification-item"
                      >

                        <h6>{notification.title}</h6>

                        <small>{notification.message}</small>

                        <p>{notification.date}</p>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card shadow border-0 rounded-4 h-100">

                <div className="card-body">

                  <h4 className="mb-4">

                    Quick Access

                  </h4>

                  <Link
                    to="/medicines"
                    className="action-btn blue mb-3"
                  >
                    💊 Add Medicine
                  </Link>

                  <Link
                    to="/inventory"
                    className="action-btn green mb-3"
                  >
                    📦 Inventory
                  </Link>

                  <Link
                    to="/notifications"
                    className="action-btn orange mb-3"
                  >
                    🔔 Notifications
                  </Link>

                  <Link
                    to="/reports"
                    className="action-btn purple"
                  >
                    📊 Reports
                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* System Notifications */}

          <div className="card shadow border-0 rounded-4 mb-4">

            <div className="card-body">

              <h4 className="mb-4">

                🔔 System Notifications

              </h4>

              {lowStock > 0 && (

                <div className="alert alert-warning">

                  ⚠ {lowStock} medicines are running Low Stock.

                </div>

              )}

              {nearExpiry > 0 && (

                <div className="alert alert-info">

                  ⏰ {nearExpiry} medicines are Near Expiry.

                </div>

              )}

              {expired > 0 && (

                <div className="alert alert-danger">

                  ❌ {expired} medicines have Expired.

                </div>

              )}

              {lowStock === 0 &&
                nearExpiry === 0 &&
                expired === 0 && (

                  <div className="alert alert-success">

                    ✅ No Notifications.

                  </div>

              )}

            </div>

          </div>

          {/* Inventory Chart */}

          <div className="card shadow border-0 rounded-4 mb-4">

            <div className="card-body">

              <h4 className="mb-4">

                Inventory Overview

              </h4>

              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />

            </div>

          </div>

          {/* Dashboard Menu */}

          <div className="row">

            {(role === "ADMIN" || role === "PHARMACIST") && (

              <div className="col-md-4 mb-3">

                <Link
                  to="/medicines"
                  className="text-decoration-none"
                >

                  <div className="dashboard-menu-card">

                    <div className="menu-left">

                      <div className="menu-icon">

                        💊

                      </div>

                      <div>

                        <h5>Medicines</h5>

                        <p>Manage medicines</p>

                      </div>

                    </div>

                    <div className="menu-arrow">

                      →

                    </div>

                  </div>

                </Link>

              </div>

            )}

            {role === "ADMIN" && (

              <div className="col-md-4 mb-3">

                <Link
                  to="/suppliers"
                  className="text-decoration-none"
                >

                  <div className="dashboard-menu-card">

                    <div className="menu-left">

                      <div className="menu-icon">

                        🏢

                      </div>

                      <div>

                        <h5>Suppliers</h5>

                        <p>Manage suppliers</p>

                      </div>

                    </div>

                    <div className="menu-arrow">

                      →

                    </div>

                  </div>

                </Link>

              </div>

            )}

            {(role === "ADMIN" ||
              role === "PHARMACIST" ||
              role === "STAFF") && (

              <div className="col-md-4 mb-3">

                <Link
                  to="/inventory"
                  className="text-decoration-none"
                >

                  <div className="dashboard-menu-card">

                    <div className="menu-left">

                      <div className="menu-icon">

                        📦

                      </div>

                      <div>

                        <h5>Inventory</h5>

                        <p>Track Stock</p>

                      </div>

                    </div>

                    <div className="menu-arrow">

                      →

                    </div>

                  </div>

                </Link>

              </div>

            )}

            {/* Stock Logs */}
{(role === "ADMIN" || role === "STAFF") && (
  <div className="col-md-4 mb-3">
    <Link to="/stocklogs" className="text-decoration-none">
      <div className="dashboard-menu-card">
        <div className="menu-left">
          <div className="menu-icon">📝</div>
          <div>
            <h5>Stock Logs</h5>
            <p>View stock history</p>
          </div>
        </div>
        <div className="menu-arrow">→</div>
      </div>
    </Link>
  </div>
)}

{/* Purchase Orders */}
{role === "ADMIN" && (
  <div className="col-md-4 mb-3">
    <Link to="/purchaseorders" className="text-decoration-none">
      <div className="dashboard-menu-card">
        <div className="menu-left">
          <div className="menu-icon">📋</div>
          <div>
            <h5>Purchase Orders</h5>
            <p>Manage purchase orders</p>
          </div>
        </div>
        <div className="menu-arrow">→</div>
      </div>
    </Link>
  </div>
)}

{/* Expiry Tracking */}
{(role === "ADMIN" || role === "PHARMACIST") && (
  <div className="col-md-4 mb-3">
    <Link to="/expirytracking" className="text-decoration-none">
      <div className="dashboard-menu-card">
        <div className="menu-left">
          <div className="menu-icon">⏰</div>
          <div>
            <h5>Expiry Tracking</h5>
            <p>Monitor expiry dates</p>
          </div>
        </div>
        <div className="menu-arrow">→</div>
      </div>
    </Link>
  </div>
)}

{/* Notifications */}
{(role === "ADMIN" || role === "STAFF") && (
  <div className="col-md-4 mb-3">
    <Link to="/notifications" className="text-decoration-none">
      <div className="dashboard-menu-card">
        <div className="menu-left">
          <div className="menu-icon">🔔</div>
          <div>
            <h5>Notifications</h5>
            <p>Alerts & Updates</p>
          </div>
        </div>
        <div className="menu-arrow">→</div>
      </div>
    </Link>
  </div>
)}

{/* Reports */}
{role === "ADMIN" && (
  <div className="col-md-4 mb-3">
    <Link to="/reports" className="text-decoration-none">
      <div className="dashboard-menu-card">
        <div className="menu-left">
          <div className="menu-icon">📈</div>
          <div>
            <h5>Reports</h5>
            <p>Generate reports</p>
          </div>
        </div>
        <div className="menu-arrow">→</div>
      </div>
    </Link>
  </div>
)}

          </div>

        </div>

      </div>

    </>

  );

}

export default Dashboard;