import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffStockLevels() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [medicines, setMedicines] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/medicines`
      );
      setMedicines(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const inStock = medicines.filter(
    m => m.status === "IN_STOCK"
  );
  const lowStock = medicines.filter(
    m => m.status === "LOW_STOCK"
  );
  const outOfStock = medicines.filter(
    m => m.status === "OUT_OF_STOCK"
  );

  const filteredMedicines = filterStatus === "ALL"
    ? medicines
    : medicines.filter(m => m.status === filterStatus);

  const getStatusColor = (status) => {
    if (status === "OUT_OF_STOCK") return "#e53e3e";
    if (status === "LOW_STOCK") return "#f6ad55";
    return "#68d391";
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/staff-dashboard" },
    { icon: "💊", label: "Medicine List", path: "/staff-medicines" },
    { icon: "📦", label: "Stock Levels", path: "/staff-stock-levels" },
    { icon: "⏰", label: "Expiry List", path: "/staff-expiry" },
  ];

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

        <button onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
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
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{
            color: "#1a1a2e", fontSize: "26px",
            fontWeight: "700", margin: 0
          }}>
            📦 Stock Levels
          </h1>
          <p style={{
            color: "#718096", margin: "5px 0 0 0",
            fontSize: "14px"
          }}>
            View current stock levels — Read Only
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            borderTop: "4px solid #68d391",
            cursor: "pointer"
          }}
            onClick={() => setFilterStatus("IN_STOCK")}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>
              ✅
            </div>
            <h2 style={{
              color: "#68d391", fontSize: "32px",
              fontWeight: "700", margin: "0 0 5px 0"
            }}>
              {inStock.length}
            </h2>
            <p style={{
              color: "#718096", fontSize: "13px", margin: 0
            }}>
              In Stock
            </p>
          </div>

          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            borderTop: "4px solid #f6ad55",
            cursor: "pointer"
          }}
            onClick={() => setFilterStatus("LOW_STOCK")}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>
              ⚠️
            </div>
            <h2 style={{
              color: "#f6ad55", fontSize: "32px",
              fontWeight: "700", margin: "0 0 5px 0"
            }}>
              {lowStock.length}
            </h2>
            <p style={{
              color: "#718096", fontSize: "13px", margin: 0
            }}>
              Low Stock
            </p>
          </div>

          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            borderTop: "4px solid #e53e3e",
            cursor: "pointer"
          }}
            onClick={() => setFilterStatus("OUT_OF_STOCK")}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>
              ❌
            </div>
            <h2 style={{
              color: "#e53e3e", fontSize: "32px",
              fontWeight: "700", margin: "0 0 5px 0"
            }}>
              {outOfStock.length}
            </h2>
            <p style={{
              color: "#718096", fontSize: "13px", margin: 0
            }}>
              Out of Stock
            </p>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: "20px" }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "12px 15px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px", fontSize: "14px",
              background: "white", color: "#2d3748"
            }}
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        {/* Stock Table */}
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
                {["Medicine Name", "Category",
                  "Supplier", "Quantity", "Status"].map((h, i) => (
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
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{
                    textAlign: "center", padding: "40px",
                    color: "#a0aec0"
                  }}>
                    No medicines found!
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine, index) => (
                  <tr key={medicine.id} style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: index % 2 === 0
                      ? "white" : "#fafafa"
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
                      {medicine.supplier}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        fontWeight: "700", fontSize: "16px",
                        color: getStatusColor(medicine.status)
                      }}>
                        {medicine.quantity}
                      </span>
                      <span style={{
                        color: "#718096", fontSize: "12px",
                        marginLeft: "4px"
                      }}>
                        units
                      </span>
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        padding: "4px 12px",
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

export default StaffStockLevels;