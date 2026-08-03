import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Suppliers() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    suppliedMedicines: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/suppliers"
      );
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.contactNumber || !form.email) {
      setMessage("Please fill all required fields!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/suppliers", form
      );
      setMessage("Supplier added successfully!");
      setShowForm(false);
      setForm({
        name: "", contactNumber: "", email: "",
        address: "", suppliedMedicines: ""
      });
      fetchSuppliers();
    } catch (error) {
      setMessage("Failed to add supplier!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(
      "Are you sure you want to delete this supplier?"
    )) {
      try {
        await axios.delete(
          `http://localhost:8080/api/suppliers/${id}`
        );
        setMessage("Supplier deleted successfully!");
        fetchSuppliers();
      } catch (error) {
        setMessage("Failed to delete supplier!");
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*Dashboard path based on role
  const getDashboardPath = () => {
    if (role === "ADMIN") return "/dashboard";
    if (role === "PHARMACIST") return "/pharmacist-dashboard";
    return "/staff-dashboard";
  };*/

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
            {role === "ADMIN" ? "Admin Panel" : "Pharmacist Panel"}
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
            {role === "ADMIN" ? "👑" : "👨‍⚕️"}
          </div>
          <p style={{
            color: "white", fontWeight: "600",
            fontSize: "14px", margin: "0 0 3px 0"
          }}>
            {localStorage.getItem("name") || "User"}
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

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "25px"
        }}>
          <div>
            <h1 style={{
              color: "#1a1a2e", fontSize: "26px",
              fontWeight: "700", margin: 0
            }}>
              🏢 Supplier Management
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              {role === "ADMIN"
                ? "Full access — Add, View and Delete suppliers"
                : "Pharmacist access — Add and View suppliers only"}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{
              padding: "12px 25px",
              background: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
              color: "white", border: "none",
              borderRadius: "10px", cursor: "pointer",
              fontSize: "14px", fontWeight: "600"
            }}>
            + Add Supplier
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          {[
            {
              label: "Total Suppliers",
              value: suppliers.length,
              icon: "🏢", color: "#e94560"
            },
            {
              label: "Active Suppliers",
              value: suppliers.length,
              icon: "✅", color: "#68d391"
            },
            {
              label: "Search Results",
              value: filteredSuppliers.length,
              icon: "🔍", color: "#63b3ed"
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

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px", borderRadius: "8px",
            marginBottom: "15px",
            background: message.includes("successfully")
              ? "#f0fff4" : "#fff5f5",
            color: message.includes("successfully")
              ? "green" : "red",
            border: message.includes("successfully")
              ? "1px solid #9ae6b4" : "1px solid #fed7d7"
          }}>
            {message}
            <button onClick={() => setMessage("")}
              style={{
                float: "right", background: "none",
                border: "none", cursor: "pointer",
                fontSize: "16px"
              }}>
              ✕
            </button>
          </div>
        )}

        {/* Add Supplier Form */}
        {showForm && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
              Add New Supplier
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px"
            }}>
              {[
                { label: "SUPPLIER NAME *", key: "name", type: "text", placeholder: "Enter supplier name" },
                { label: "CONTACT NUMBER *", key: "contactNumber", type: "text", placeholder: "Enter contact number" },
                { label: "EMAIL *", key: "email", type: "email", placeholder: "Enter email address" },
                { label: "ADDRESS", key: "address", type: "text", placeholder: "Enter address" },
                { label: "SUPPLIED MEDICINES", key: "suppliedMedicines", type: "text", placeholder: "e.g. Paracetamol, Amoxicillin" },
              ].map((field, index) => (
                <div key={index}>
                  <label style={{
                    display: "block", color: "#2d3748",
                    fontSize: "13px", fontWeight: "600",
                    marginBottom: "6px"
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({
                      ...form, [field.key]: e.target.value
                    })}
                    style={{
                      width: "100%", padding: "10px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px",
                      boxSizing: "border-box", background: "#f8fafc"
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "20px", display: "flex", gap: "10px"
            }}>
              <button onClick={handleSubmit}
                style={{
                  padding: "12px 25px",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
                  color: "white", border: "none",
                  borderRadius: "8px", cursor: "pointer",
                  fontWeight: "600"
                }}>
                Save Supplier
              </button>
              <button onClick={() => setShowForm(false)}
                style={{
                  padding: "12px 25px", background: "#f7fafc",
                  color: "#718096", border: "1px solid #e2e8f0",
                  borderRadius: "8px", cursor: "pointer"
                }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Search suppliers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", padding: "12px 15px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px", fontSize: "14px",
              boxSizing: "border-box", background: "white"
            }}
          />
        </div>

        {/* Suppliers Table */}
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
                {["Name", "Contact", "Email",
                  "Address", "Medicines", "Actions"].map((h, i) => (
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
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{
                    textAlign: "center", padding: "40px",
                    color: "#a0aec0"
                  }}>
                    No suppliers found. Add your first supplier!
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier.id} style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: index % 2 === 0
                      ? "white" : "#fafafa"
                  }}>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      🏢 {supplier.name}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      📞 {supplier.contactNumber}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      ✉️ {supplier.email}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      📍 {supplier.address}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      💊 {supplier.suppliedMedicines}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      {role === "ADMIN" ? (
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          style={{
                            padding: "6px 12px",
                            background: "#fff5f5",
                            color: "#e53e3e",
                            border: "1px solid #fed7d7",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                          🗑️ Delete
                        </button>
                      ) : (
                        <span style={{
                          padding: "6px 12px",
                          background: "#f0fff4",
                          color: "#276749",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: "1px solid #9ae6b4"
                        }}>
                          👁️ View Only
                        </span>
                      )}
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

export default Suppliers;