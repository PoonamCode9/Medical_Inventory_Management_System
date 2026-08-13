import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PHARMACIST"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill all fields!");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/users`,
        form
      );
      setMessage("User added successfully!");
      setShowForm(false);
      setForm({
        name: "", email: "",
        password: "", role: "PHARMACIST"
      });
      fetchUsers();
    } catch (error) {
      setMessage("Failed to add user!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(
      "Are you sure you want to delete this user?"
    )) {
      try {
        await axios.delete(
          `${API_URL}/api/users/${id}`
        );
        setMessage("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        setMessage("Failed to delete user!");
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(
        `${API_URL}/api/users/${id}/role?role=${newRole}`
      );
      setMessage("Role updated successfully!");
      fetchUsers();
    } catch (error) {
      setMessage("Failed to update role!");
    }
  };

  const getRoleColor = (role) => {
    if (role === "ADMIN") return "#e94560";
    if (role === "PHARMACIST") return "#63b3ed";
    if (role === "STAFF") return "#68d391";
    return "#a0aec0";
  };

  const getRoleIcon = (role) => {
    if (role === "ADMIN") return "👑";
    if (role === "PHARMACIST") return "👨‍⚕️";
    if (role === "STAFF") return "👤";
    return "👤";
  };

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
            Admin Panel
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
            👑
          </div>
          <p style={{
            color: "white", fontWeight: "600",
            fontSize: "14px", margin: "0 0 3px 0"
          }}>
            {localStorage.getItem("name") || "Admin"}
          </p>
          <span style={{
            background: "#e94560", color: "white",
            padding: "2px 10px", borderRadius: "20px",
            fontSize: "11px"
          }}>
            ADMIN
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
              👥 User Management
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              Admin only — Manage all system users
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
            + Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          {[
            {
              label: "Total Users",
              value: users.length,
              icon: "👥", color: "#e94560"
            },
            {
              label: "Admins",
              value: users.filter(
                u => u.role === "ADMIN"
              ).length,
              icon: "👑", color: "#e94560"
            },
            {
              label: "Pharmacists",
              value: users.filter(
                u => u.role === "PHARMACIST"
              ).length,
              icon: "👨‍⚕️", color: "#63b3ed"
            },
            {
              label: "Staff",
              value: users.filter(
                u => u.role === "STAFF"
              ).length,
              icon: "👤", color: "#68d391"
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

        {/* Add User Form */}
        {showForm && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
              👥 Add New User
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px"
            }}>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => setForm({
                    ...form, name: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => setForm({
                    ...form, email: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  PASSWORD *
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({
                    ...form, password: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  SELECT ROLE *
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({
                    ...form, role: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc"
                  }}
                >
                  <option value="PHARMACIST">
                    👨‍⚕️ Pharmacist
                  </option>
                  <option value="STAFF">
                    👤 Staff
                  </option>
                  <option value="ADMIN">
                    👑 Admin
                  </option>
                </select>
              </div>
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
                Add User
              </button>
              <button onClick={() => setShowForm(false)}
                style={{
                  padding: "12px 25px",
                  background: "#f7fafc", color: "#718096",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px", cursor: "pointer"
                }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
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
              All Users
            </h3>
            <span style={{
              background: "#fff5f5", color: "#e94560",
              padding: "4px 12px", borderRadius: "20px",
              fontSize: "12px", fontWeight: "600",
              border: "1px solid #fed7d7"
            }}>
              🔒 Admin Only
            </span>
          </div>
          <table style={{
            width: "100%", borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                {["#", "Name", "Email",
                  "Role", "Change Role", "Actions"].map((h, i) => (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{
                    textAlign: "center", padding: "40px",
                    color: "#a0aec0"
                  }}>
                    No users found!
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: index % 2 === 0
                      ? "white" : "#fafafa"
                  }}>
                    <td style={{
                      padding: "12px 15px",
                      color: "#718096", fontSize: "13px"
                    }}>
                      {index + 1}
                    </td>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      {getRoleIcon(user.role)} {user.name}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600",
                        background: getRoleColor(user.role) + "20",
                        color: getRoleColor(user.role)
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(
                          user.id, e.target.value
                        )}
                        style={{
                          padding: "6px 10px",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "12px",
                          background: "white",
                          cursor: "pointer"
                        }}
                      >
                        <option value="ADMIN">👑 Admin</option>
                        <option value="PHARMACIST">
                          👨‍⚕️ Pharmacist
                        </option>
                        <option value="STAFF">👤 Staff</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <button
                        onClick={() => handleDelete(user.id)}
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

export default UserManagement;