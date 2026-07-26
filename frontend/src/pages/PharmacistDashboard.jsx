import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PharmacistDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    expiring: 0,
    totalSuppliers: 0
  });
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const medicines = await axios.get(
        "http://localhost:8080/api/medicines"
      );
      const suppliers = await axios.get(
        "http://localhost:8080/api/suppliers"
      );
      const lowStock = await axios.get(
        "http://localhost:8080/api/medicines/low-stock"
      );
      const expiring = await axios.get(
        "http://localhost:8080/api/medicines/expiring"
      );
      setStats({
        totalMedicines: medicines.data.length,
        lowStock: lowStock.data.length,
        expiring: expiring.data.length,
        totalSuppliers: suppliers.data.length
      });
      setLowStockMedicines(lowStock.data);
      setExpiringMedicines(expiring.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
  { icon: "📊", label: "Dashboard", path: "/pharmacist-dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
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
          <p style={{ color: "#a0aec0", fontSize: "11px", margin: "3px 0 0 0" }}>
            Pharmacist Panel
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
            👨‍⚕️
          </div>
          <p style={{
            color: "white", fontWeight: "600",
            fontSize: "14px", margin: "0 0 3px 0"
          }}>
            {name || "Pharmacist"}
          </p>
          <span style={{
            background: "#0f3460", color: "white",
            padding: "2px 10px", borderRadius: "20px",
            fontSize: "11px"
          }}>
            PHARMACIST
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
              Welcome, {name}! 👨‍⚕️
            </h1>
            <p style={{ color: "#718096", margin: 0, fontSize: "14px" }}>
              Pharmacist Dashboard — Manage medicines and suppliers
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
            { label: "Total Medicines", value: stats.totalMedicines, icon: "💊", color: "#e94560" },
            { label: "Low Stock", value: stats.lowStock, icon: "⚠️", color: "#f6ad55" },
            { label: "Expiring Soon", value: stats.expiring, icon: "⏰", color: "#fc8181" },
            { label: "Total Suppliers", value: stats.totalSuppliers, icon: "🏢", color: "#68d391" },
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
              <p style={{ color: "#718096", fontSize: "13px", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Low Stock Medicines */}
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{
              color: "#1a1a2e", marginBottom: "15px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              ⚠️ Low Stock Medicines
            </h3>
            {lowStockMedicines.length === 0 ? (
              <p style={{ color: "#a0aec0", textAlign: "center", padding: "20px" }}>
                No low stock medicines! ✅
              </p>
            ) : (
              lowStockMedicines.map((medicine, index) => (
                <div key={index} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  background: index % 2 === 0 ? "white" : "#fafafa"
                }}>
                  <div>
                    <p style={{
                      margin: 0, fontWeight: "600",
                      color: "#2d3748", fontSize: "14px"
                    }}>
                      {medicine.name}
                    </p>
                    <p style={{
                      margin: 0, color: "#718096",
                      fontSize: "12px"
                    }}>
                      {medicine.category}
                    </p>
                  </div>
                  <span style={{
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: "600",
                    background: "#fff5f5", color: "#e53e3e"
                  }}>
                    Qty: {medicine.quantity}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Expiring Medicines */}
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{
              color: "#1a1a2e", marginBottom: "15px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              ⏰ Expiring Soon
            </h3>
            {expiringMedicines.length === 0 ? (
              <p style={{ color: "#a0aec0", textAlign: "center", padding: "20px" }}>
                No medicines expiring soon! ✅
              </p>
            ) : (
              expiringMedicines.map((medicine, index) => (
                <div key={index} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  background: index % 2 === 0 ? "white" : "#fafafa"
                }}>
                  <div>
                    <p style={{
                      margin: 0, fontWeight: "600",
                      color: "#2d3748", fontSize: "14px"
                    }}>
                      {medicine.name}
                    </p>
                    <p style={{
                      margin: 0, color: "#718096",
                      fontSize: "12px"
                    }}>
                      Batch: {medicine.batchNumber}
                    </p>
                  </div>
                  <span style={{
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: "600",
                    background: "#fffaf0", color: "#c05621"
                  }}>
                    {medicine.expiryDate}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginTop: "20px"
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
      </div>
    </div>
  );
}

export default PharmacistDashboard;