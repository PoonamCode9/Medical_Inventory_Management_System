import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StockHistory() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

const menuItems = role === "ADMIN" ? [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
  { icon: "👥", label: "User Management", path: "/user-management" },
  { icon: "📈", label: "Analytics", path: "/analytics" },
  { icon: "📄", label: "Reports", path: "/reports" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
] : [
  { icon: "📊", label: "Dashboard", path: "/pharmacist-dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
  { icon: "📈", label: "Analytics", path: "/analytics" },
  { icon: "📄", label: "Reports", path: "/reports" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
];
  const [logs, setLogs] = useState([]);
  const [filterAction, setFilterAction] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
 /* const [message, setMessage] = useState("");*/

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/stock-logs`
      );
      setLogs(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction =
      filterAction === "ALL" || log.actionType === filterAction;
    const matchesSearch =
      log.medicineName.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
    return matchesAction && matchesSearch;
  });

  const getActionColor = (action) => {
    if (action === "ADDED") return "#68d391";
    if (action === "UPDATED") return "#f6ad55";
    if (action === "DELETED") return "#e53e3e";
    if (action === "RESTOCKED") return "#63b3ed";
    return "#a0aec0";
  };

  const getActionIcon = (action) => {
    if (action === "ADDED") return "➕";
    if (action === "UPDATED") return "✏️";
    if (action === "DELETED") return "🗑️";
    if (action === "RESTOCKED") return "📦";
    return "📋";
  };

  const totalLogs = logs.length;
  const addedCount = logs.filter(l => l.actionType === "ADDED").length;
  const updatedCount = logs.filter(l => l.actionType === "UPDATED").length;
  const restockedCount = logs.filter(l => l.actionType === "RESTOCKED").length;


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
        </div>
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
        <button
          onClick={() => { localStorage.clear(); navigate("/login"); }}
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
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{
            color: "#1a1a2e", fontSize: "26px",
            fontWeight: "700", margin: 0
          }}>
            📋 Stock History
          </h1>
          <p style={{
            color: "#718096", margin: "5px 0 0 0",
            fontSize: "14px"
          }}>
            Complete history of all stock movements
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          {[
            { label: "Total Actions", value: totalLogs, icon: "📋", color: "#e94560" },
            { label: "Added", value: addedCount, icon: "➕", color: "#68d391" },
            { label: "Updated", value: updatedCount, icon: "✏️", color: "#f6ad55" },
            { label: "Restocked", value: restockedCount, icon: "📦", color: "#63b3ed" },
          ].map((stat, index) => (
            <div key={index} style={{
              background: "white", padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${stat.color}`
            }}>
              <div style={{ fontSize: "25px", marginBottom: "8px" }}>
                {stat.icon}
              </div>
              <h2 style={{
                color: stat.color, fontSize: "28px",
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

        {/* Search and Filter */}
        <div style={{
          display: "flex", gap: "15px", marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="🔍 Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1, padding: "12px 15px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px", fontSize: "14px",
              background: "white"
            }}
          />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{
              padding: "12px 15px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px", fontSize: "14px",
              background: "white", color: "#2d3748"
            }}
          >
            <option value="ALL">All Actions</option>
            <option value="ADDED">Added</option>
            <option value="UPDATED">Updated</option>
            <option value="DELETED">Deleted</option>
            <option value="RESTOCKED">Restocked</option>
          </select>
        </div>

        {/* Stock History Table */}
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}>
          <table style={{
            width: "100%", borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                {["#", "Medicine Name", "Action",
                  "Previous Qty", "Change",
                  "New Qty", "Performed By", "Date & Time"].map((h, i) => (
                  <th key={i} style={{
                    padding: "15px", color: "white",
                    fontSize: "13px", textAlign: "left",
                    fontWeight: "600"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{
                    textAlign: "center", padding: "40px",
                    color: "#a0aec0"
                  }}>
                    No stock history found!
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: index % 2 === 0
                      ? "white" : "#fafafa"
                  }}>
                    <td style={{
                      padding: "12px 15px",
                      color: "#718096", fontSize: "13px"
                    }}>
                      {log.id}
                    </td>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      💊 {log.medicineName}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600",
                        background: getActionColor(log.actionType) + "20",
                        color: getActionColor(log.actionType)
                      }}>
                        {getActionIcon(log.actionType)} {log.actionType}
                      </span>
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {log.previousQuantity}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        color: log.quantityChanged >= 0
                          ? "#68d391" : "#e53e3e",
                        fontWeight: "600"
                      }}>
                        {log.quantityChanged >= 0 ? "+" : ""}
                        {log.quantityChanged}
                      </span>
                    </td>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      {log.newQuantity}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {log.performedBy}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096",
                      fontSize: "12px"
                    }}>
                      {log.createdAt ?
                        new Date(log.createdAt).toLocaleString()
                        : "N/A"}
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

export default StockHistory;