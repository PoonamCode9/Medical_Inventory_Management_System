import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffMedicines() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/medicines"
      );
      setMedicines(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            💊 Medicine List
          </h1>
          <p style={{
            color: "#718096", margin: "5px 0 0 0",
            fontSize: "14px"
          }}>
            View all medicines — Read Only
          </p>
        </div>

        {/* Stats */}
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
              label: "In Stock",
              value: medicines.filter(
                m => m.status === "IN_STOCK"
              ).length,
              icon: "✅", color: "#68d391"
            },
            {
              label: "Categories",
              value: categories.length,
              icon: "📁", color: "#63b3ed"
            },
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
            placeholder="🔍 Search by name or supplier..."
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "12px 15px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px", fontSize: "14px",
              background: "white", color: "#2d3748"
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Medicine Table */}
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "15px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ color: "#1a1a2e", margin: 0 }}>
              Medicine List
            </h3>
            <span style={{
              background: "#f0fff4", color: "#276749",
              padding: "4px 12px", borderRadius: "20px",
              fontSize: "12px", fontWeight: "600"
            }}>
              👁️ View Only
            </span>
          </div>
          <table style={{
            width: "100%", borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                {["Name", "Batch", "Category",
                  "Supplier", "Quantity",
                  "Expiry Date", "Price", "Status"].map((h, i) => (
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
                  <td colSpan="8" style={{
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
                      {medicine.name}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {medicine.batchNumber}
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
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {medicine.quantity}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {medicine.expiryDate}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      ₹{medicine.price}
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

export default StaffMedicines;