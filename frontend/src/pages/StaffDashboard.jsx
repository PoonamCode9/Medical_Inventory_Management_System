import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    outOfStock: 0,
    expiring: 0
  });
  const [recentMedicines, setRecentMedicines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/medicines`
      );
      const allMedicines = response.data;
      const today = new Date();

      const expiring = allMedicines.filter(m => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 30;
      });

      setStats({
        totalMedicines: allMedicines.length,
        lowStock: allMedicines.filter(
          m => m.status === "LOW_STOCK"
        ).length,
        outOfStock: allMedicines.filter(
          m => m.status === "OUT_OF_STOCK"
        ).length,
        expiring: expiring.length
      });

      setRecentMedicines(allMedicines.slice(0, 5));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/staff-dashboard" },
    { icon: "💊", label: "Medicine List", path: "/staff-medicines" },
    { icon: "📦", label: "Stock Levels", path: "/staff-stock-levels" },
    { icon: "⏰", label: "Expiry List", path: "/staff-expiry" },
  ];

  const getStatusColor = (status) => {
    if (status === "OUT_OF_STOCK") return "#e53e3e";
    if (status === "LOW_STOCK") return "#f6ad55";
    return "#68d391";
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f7fafc"
    }}>

      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white", padding: "25px 15px",
        display: "flex", flexDirection: "column"
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
            Staff Panel
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
            background: "#68d391", borderRadius: "50%",
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
            {name || "Staff"}
          </p>
          <span style={{
            background: "#276749", color: "white",
            padding: "2px 10px", borderRadius: "20px",
            fontSize: "11px"
          }}>
            STAFF
          </span>
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <div key={index}
              onClick={() => navigate(item.path)}
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
              Welcome, {name}! 👤
            </h1>
            <p style={{ color: "#718096", margin: 0, fontSize: "14px" }}>
              Staff Dashboard — View Only Access
            </p>
          </div>
          <div style={{
            background: "white", padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            color: "#718096", fontSize: "13px"
          }}>
            📅 {new Date().toDateString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px", marginBottom: "30px"
        }}>
          {[
            {
              label: "Total Medicines",
              value: stats.totalMedicines,
              icon: "💊", color: "#e94560"
            },
            {
              label: "Low Stock",
              value: stats.lowStock,
              icon: "⚠️", color: "#f6ad55"
            },
            {
              label: "Out of Stock",
              value: stats.outOfStock,
              icon: "❌", color: "#e53e3e"
            },
            {
              label: "Expiring Soon",
              value: stats.expiring,
              icon: "⏰", color: "#fc8181"
            },
          ].map((stat, index) => (
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
              <p style={{
                color: "#718096", fontSize: "13px", margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#1a1a2e", marginBottom: "15px" }}>
            Quick Navigation
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            {[
              {
                label: "View Medicines",
                icon: "💊",
                path: "/staff-medicines",
                color: "#e94560"
              },
              {
                label: "Check Stock Levels",
                icon: "📦",
                path: "/staff-stock-levels",
                color: "#f6ad55"
              },
              {
                label: "View Expiry List",
                icon: "⏰",
                path: "/staff-expiry",
                color: "#fc8181"
              },
            ].map((action, index) => (
              <button key={index}
                onClick={() => navigate(action.path)}
                style={{
                  flex: 1, padding: "20px",
                  background: action.color + "10",
                  border: `1.5px solid ${action.color}30`,
                  borderRadius: "12px", cursor: "pointer",
                  fontSize: "14px", color: "#2d3748",
                  fontWeight: "600",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "8px"
                }}>
                <span style={{ fontSize: "25px" }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Medicines */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "15px"
          }}>
            <h3 style={{ color: "#1a1a2e", margin: 0 }}>
              Recent Medicines
            </h3>
            <button
              onClick={() => navigate("/staff-medicines")}
              style={{
                padding: "6px 15px",
                background: "#f7fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px", cursor: "pointer",
                fontSize: "13px", color: "#718096"
              }}>
              View All →
            </button>
          </div>
          <table style={{
            width: "100%", borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#f7fafc" }}>
                {["Name", "Category", "Quantity", "Status"].map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 15px", color: "#718096",
                    fontSize: "13px", textAlign: "left",
                    fontWeight: "600"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentMedicines.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{
                    textAlign: "center", padding: "30px",
                    color: "#a0aec0"
                  }}>
                    No medicines found!
                  </td>
                </tr>
              ) : (
                recentMedicines.map((medicine, index) => (
                  <tr key={medicine.id} style={{
                    borderBottom: "1px solid #f0f0f0"
                  }}>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      💊 {medicine.name}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {medicine.category}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {medicine.quantity}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600",
                        background: getStatusColor(medicine.status) + "20",
                        color: getStatusColor(medicine.status)
                      }}>
                        {medicine.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;