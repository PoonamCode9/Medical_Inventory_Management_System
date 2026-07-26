import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffExpiry() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [medicines, setMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [expiredMedicines, setExpiredMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/medicines"
      );
      const allMedicines = response.data;
      const today = new Date();

      const expiring = allMedicines.filter(m => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 30;
      });

      const expired = allMedicines.filter(m => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        return expiry < today;
      });

      setMedicines(allMedicines);
      setExpiringMedicines(expiring);
      setExpiredMedicines(expired);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );
    return diffDays;
  };

  const getExpiryColor = (days) => {
    if (days < 0) return "#e53e3e";
    if (days <= 7) return "#e53e3e";
    if (days <= 15) return "#f6ad55";
    return "#ecc94b";
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
            ⏰ Expiry List
          </h1>
          <p style={{
            color: "#718096", margin: "5px 0 0 0",
            fontSize: "14px"
          }}>
            Monitor medicine expiry dates — Read Only
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          {[
            {
              label: "Total Medicines",
              value: medicines.length,
              icon: "💊", color: "#e94560"
            },
            {
              label: "Expiring in 30 Days",
              value: expiringMedicines.length,
              icon: "⚠️", color: "#f6ad55"
            },
            {
              label: "Already Expired",
              value: expiredMedicines.length,
              icon: "❌", color: "#e53e3e"
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

        {/* Expiring Soon Section */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "20px"
        }}>
          <h3 style={{
            color: "#1a1a2e", marginBottom: "15px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            ⚠️ Expiring Within 30 Days
          </h3>
          {expiringMedicines.length === 0 ? (
            <p style={{
              color: "#a0aec0", textAlign: "center",
              padding: "20px"
            }}>
              ✅ No medicines expiring soon!
            </p>
          ) : (
            <table style={{
              width: "100%", borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ background: "#fffaf0" }}>
                  {["Medicine", "Category", "Batch",
                    "Expiry Date", "Days Left"].map((h, i) => (
                    <th key={i} style={{
                      padding: "12px 15px", color: "#744210",
                      fontSize: "13px", textAlign: "left",
                      fontWeight: "600"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expiringMedicines.map((medicine, index) => {
                  const days = getDaysUntilExpiry(medicine.expiryDate);
                  return (
                    <tr key={medicine.id} style={{
                      borderBottom: "1px solid #fef3c7"
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
                        {medicine.batchNumber}
                      </td>
                      <td style={{
                        padding: "12px 15px", color: "#718096"
                      }}>
                        {medicine.expiryDate}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px", fontWeight: "600",
                          background: getExpiryColor(days) + "20",
                          color: getExpiryColor(days)
                        }}>
                          {days} days left
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Already Expired Section */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{
            color: "#1a1a2e", marginBottom: "15px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            ❌ Already Expired Medicines
          </h3>
          {expiredMedicines.length === 0 ? (
            <p style={{
              color: "#a0aec0", textAlign: "center",
              padding: "20px"
            }}>
              ✅ No expired medicines!
            </p>
          ) : (
            <table style={{
              width: "100%", borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ background: "#fff5f5" }}>
                  {["Medicine", "Category", "Batch",
                    "Expiry Date", "Days Overdue"].map((h, i) => (
                    <th key={i} style={{
                      padding: "12px 15px", color: "#742a2a",
                      fontSize: "13px", textAlign: "left",
                      fontWeight: "600"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expiredMedicines.map((medicine, index) => {
                  const days = getDaysUntilExpiry(medicine.expiryDate);
                  return (
                    <tr key={medicine.id} style={{
                      borderBottom: "1px solid #fed7d7"
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
                        {medicine.batchNumber}
                      </td>
                      <td style={{
                        padding: "12px 15px", color: "#e53e3e",
                        fontWeight: "600"
                      }}>
                        {medicine.expiryDate}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px", fontWeight: "600",
                          background: "#fff5f5",
                          color: "#e53e3e"
                        }}>
                          {Math.abs(days)} days overdue!
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffExpiry;