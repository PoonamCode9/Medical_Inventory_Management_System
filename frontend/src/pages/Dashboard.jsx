import API_URL from '../config';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from '../components/NotificationBell';
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    expiring: 0,
    totalSuppliers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const medicines = await axios.get(
        `${API_URL}/api/medicines`
      );
      const suppliers = await axios.get(
        `${API_URL}/api/suppliers`
      );
      const lowStock = await axios.get(
        `${API_URL}/api/medicines/low-stock`
      );
      const expiring = await axios.get(
        `${API_URL}/api/medicines/expiring`
      );
      setStats({
        totalMedicines: medicines.data.length,
        lowStock: lowStock.data.length,
        expiring: expiring.data.length,
        totalSuppliers: suppliers.data.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const statCards = [
    {
      label: "Total Medicines",
      value: stats.totalMedicines,
      icon: "💊",
      color: "#e94560"
    },
    {
      label: "Low Stock Items",
      value: stats.lowStock,
      icon: "⚠️",
      color: "#f6ad55"
    },
    {
      label: "Expiring Soon",
      value: stats.expiring,
      icon: "⏰",
      color: "#fc8181"
    },
    {
      label: "Total Suppliers",
      value: stats.totalSuppliers,
      icon: "🏢",
      color: "#68d391"
    },
  ];



  const menuItems = [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
  { icon: "👥", label: "User Management", path: "/user-management" },
  { icon: "📈", label: "Analytics", path: "/analytics" },
  { icon: "📄", label: "Reports", path: "/reports" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
];

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f7fafc"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white",
        padding: "25px 15px",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "35px" }}>💊</div>
          <h2 style={{
            color: "#e94560", fontSize: "22px",
            fontWeight: "800", margin: "5px 0 0 0"
          }}>
            MediStock
          </h2>
          <p style={{
            color: "#a0aec0", fontSize: "11px",
            margin: "3px 0 0 0"
          }}>
            Inventory Management
          </p>
        </div>

        {/* User Info */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          borderRadius: "12px", padding: "12px",
          marginBottom: "25px", textAlign: "center"
        }}>
          <div style={{
            width: "45px", height: "45px",
            background: "#e94560", borderRadius: "50%",
            display: "flex", justifyContent: "center",
            alignItems: "center", margin: "0 auto 8px",
            fontSize: "18px"
          }}>
            👤
          </div>
          <p style={{
            color: "white", fontWeight: "600",
            fontSize: "14px", margin: "0 0 3px 0"
          }}>
            {name || "User"}
          </p>
          <span style={{
            background: "#e94560", color: "white",
            padding: "2px 10px", borderRadius: "20px",
            fontSize: "11px"
          }}>
            {role}
          </span>
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <div key={index} onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: "12px", padding: "12px 15px",
                marginBottom: "5px", borderRadius: "10px",
                cursor: "pointer",
                background: window.location.pathname === item.path
                  ? "rgba(233,69,96,0.2)" : "transparent",
                borderLeft: window.location.pathname === item.path
                  ? "3px solid #e94560" : "3px solid transparent"
              }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", color: "#e2e8f0" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{
            width: "100%", padding: "12px",
            background: "rgba(233,69,96,0.15)",
            color: "#e94560", border: "1px solid #e94560",
            borderRadius: "10px", cursor: "pointer",
            fontSize: "14px", fontWeight: "600"
          }}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "30px"
      }}>
        <div>
          <h1 style={{
            color: "#1a1a2e", fontSize: "26px",
            fontWeight: "700", margin: "0 0 5px 0"
          }}>
          Welcome back, {name || "User"}! 👋
        </h1>
        <p style={{ color: "#718096", margin: 0, fontSize: "14px" }}>
          Here is your inventory overview for today
        </p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {/* Add Bell here! */}
        <NotificationBell />
          <div style={{
            background: "white", padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            color: "#718096", fontSize: "13px"
          }}>
            📅 {new Date().toDateString()}
          </div>
        </div>
      </div>
      
        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px", marginBottom: "30px"
        }}>
          {statCards.map((stat, index) => (
            <div key={index} style={{
              background: "white", padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${stat.color}`
            }}>
              <div style={{ fontSize: "30px", marginBottom: "10px" }}>
                {stat.icon}
              </div>
              <h2 style={{
                color: stat.color, fontSize: "32px",
                fontWeight: "700", margin: "0 0 5px 0"
              }}>
                {stat.value}
              </h2>
              <p style={{ color: "#718096", fontSize: "13px", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>


        {stats.expiring > 0 && (
  <div style={{
    background: "#fffaf0",
    border: "1px solid #f6ad55",
    borderRadius: "12px",
    padding: "15px 20px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}>
    <span style={{ fontSize: "25px" }}>⚠️</span>
    <div>
      <p style={{
        margin: 0, fontWeight: "600",
        color: "#744210"
      }}>
        {stats.expiring} medicines expiring within 30 days!
      </p>
      <p style={{
        margin: 0, fontSize: "13px",
        color: "#975a16"
      }}>
        Please check and take action immediately!
      </p>
    </div>
  </div>
)}

{stats.lowStock > 0 && (
  <div style={{
    background: "#fff5f5",
    border: "1px solid #fc8181",
    borderRadius: "12px",
    padding: "15px 20px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}>
    <span style={{ fontSize: "25px" }}>🔴</span>
    <div>
      <p style={{
        margin: 0, fontWeight: "600",
        color: "#742a2a"
      }}>
        {stats.lowStock} medicines are low on stock!
      </p>
      <p style={{
        margin: 0, fontSize: "13px",
        color: "#9b2c2c"
      }}>
        Please restock immediately!
      </p>
    </div>
  </div>
)}

        {/* Quick Actions */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#1a1a2e", marginBottom: "15px" }}>
            Quick Actions
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            {[
              { label: "Add Medicine", icon: "💊", path: "/inventory" },
              { label: "Add Supplier", icon: "🏢", path: "/suppliers" },
              { label: "View Inventory", icon: "📋", path: "/inventory" },
            ].map((action, index) => (
              <button key={index} onClick={() => navigate(action.path)}
                style={{
                  padding: "12px 20px", background: "#f7fafc",
                  border: "1.5px solid #e2e8f0", borderRadius: "10px",
                  cursor: "pointer", fontSize: "14px",
                  color: "#2d3748", fontWeight: "600",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#1a1a2e", marginBottom: "15px" }}>
            System Status
          </h3>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{
              flex: 1, padding: "15px",
              background: "#f0fff4", borderRadius: "10px",
              border: "1px solid #9ae6b4"
            }}>
              <p style={{
                color: "#276749", fontWeight: "600",
                margin: "0 0 5px 0"
              }}>
                ✅ Backend Status
              </p>
              <p style={{ color: "#48bb78", margin: 0, fontSize: "13px" }}>
                Backend Connected
              </p>
            </div>
            <div style={{
              flex: 1, padding: "15px",
              background: "#f0fff4", borderRadius: "10px",
              border: "1px solid #9ae6b4"
            }}>
              <p style={{
                color: "#276749", fontWeight: "600",
                margin: "0 0 5px 0"
              }}>
                ✅ Database Status
              </p>
              <p style={{ color: "#48bb78", margin: 0, fontSize: "13px" }}>
                PostgreSQL Connected
              </p>
            </div>
            <div style={{
              flex: 1, padding: "15px",
              background: "#f0fff4", borderRadius: "10px",
              border: "1px solid #9ae6b4"
            }}>
              <p style={{
                color: "#276749", fontWeight: "600",
                margin: "0 0 5px 0"
              }}>
                ✅ Auth Status
              </p>
              <p style={{ color: "#48bb78", margin: 0, fontSize: "13px" }}>
                JWT Authentication Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;