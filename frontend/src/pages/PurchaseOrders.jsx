import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PurchaseOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    supplierId: "",
    supplierName: "",
    medicineName: "",
    quantity: "",
    totalAmount: "",
    status: "PENDING"
  });

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchMedicines();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/purchase-orders"
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/suppliers"
      );
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const handleSubmit = async () => {
    if (!form.supplierId || !form.medicineName || !form.quantity) {
      setMessage("Please fill all required fields!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/purchase-orders",
        {
          ...form,
          quantity: parseInt(form.quantity),
          totalAmount: parseFloat(form.totalAmount)
        }
      );
      setMessage("Purchase order created successfully!");
      setShowForm(false);
      setForm({
        supplierId: "", supplierName: "",
        medicineName: "", quantity: "",
        totalAmount: "", status: "PENDING"
      });
      fetchOrders();
    } catch (error) {
      setMessage("Failed to create order!");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/purchase-orders/${id}/status?status=${newStatus}`
      );
      if (newStatus === "DELIVERED") {
        setMessage(
          "Order marked as Delivered! Stock updated automatically! ✅"
        );
      } else {
        setMessage(`Order status updated to ${newStatus}!`);
      }
      fetchOrders();
      fetchMedicines();
    } catch (error) {
      setMessage("Failed to update status!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/purchase-orders/${id}`
        );
        setMessage("Order deleted!");
        fetchOrders();
      } catch (error) {
        setMessage("Failed to delete!");
      }
    }
  };

  const filteredOrders = orders.filter(o =>
    filterStatus === "ALL" || o.status === filterStatus
  );

  const getStatusColor = (status) => {
    if (status === "DELIVERED") return "#68d391";
    if (status === "PENDING") return "#f6ad55";
    if (status === "CANCELLED") return "#e53e3e";
    return "#a0aec0";
  };

  const getStatusBg = (status) => {
    if (status === "DELIVERED") return "#f0fff4";
    if (status === "PENDING") return "#fffaf0";
    if (status === "CANCELLED") return "#fff5f5";
    return "#f7fafc";
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    o => o.status === "PENDING"
  ).length;
  const deliveredOrders = orders.filter(
    o => o.status === "DELIVERED"
  ).length;
  const cancelledOrders = orders.filter(
    o => o.status === "CANCELLED"
  ).length;

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
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "25px"
        }}>
          <div>
            <h1 style={{
              color: "#1a1a2e", fontSize: "26px",
              fontWeight: "700", margin: 0
            }}>
              🛒 Purchase Orders
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              Manage supplier purchase orders here
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
            + New Order
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px", marginBottom: "25px"
        }}>
          {[
            { label: "Total Orders", value: totalOrders, icon: "🛒", color: "#e94560" },
            { label: "Pending", value: pendingOrders, icon: "⏳", color: "#f6ad55" },
            { label: "Delivered", value: deliveredOrders, icon: "✅", color: "#68d391" },
            { label: "Cancelled", value: cancelledOrders, icon: "❌", color: "#e53e3e" },
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
            background: message.includes("successfully") ||
              message.includes("updated") ||
              message.includes("✅")
              ? "#f0fff4" : "#fff5f5",
            color: message.includes("successfully") ||
              message.includes("updated") ||
              message.includes("✅")
              ? "green" : "red",
            border: message.includes("successfully") ||
              message.includes("updated") ||
              message.includes("✅")
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

        {/* Create Order Form */}
        {showForm && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
              🛒 Create New Purchase Order
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "15px"
            }}>

              {/* Supplier Dropdown */}
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  SELECT SUPPLIER *
                </label>
                <select
                  value={form.supplierId}
                  onChange={(e) => {
                    const selected = suppliers.find(
                      s => s.id === parseInt(e.target.value)
                    );
                    setForm({
                      ...form,
                      supplierId: e.target.value,
                      supplierName: selected ? selected.name : ""
                    });
                  }}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc", color: "#2d3748"
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medicine Dropdown */}
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  SELECT MEDICINE *
                </label>
                <select
                  value={form.medicineName}
                  onChange={(e) => setForm({
                    ...form, medicineName: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box",
                    background: "#f8fafc", color: "#2d3748"
                  }}
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((med) => (
                    <option key={med.id} value={med.name}>
                      {med.name} (Current Stock: {med.quantity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  QUANTITY *
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={(e) => setForm({
                    ...form, quantity: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>

              {/* Total Amount */}
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  TOTAL AMOUNT (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter total amount"
                  value={form.totalAmount}
                  onChange={(e) => setForm({
                    ...form, totalAmount: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>
            </div>

            {/* Selected Info */}
            {form.supplierName && (
              <div style={{
                marginTop: "15px", padding: "12px",
                background: "#f0f0ff", borderRadius: "8px",
                border: "1px solid #e0e0ff"
              }}>
                <p style={{ margin: 0, color: "#1a1a2e", fontSize: "13px" }}>
                  🏢 Supplier: <strong>{form.supplierName}</strong>
                  {form.medicineName && (
                    <> | 💊 Medicine: <strong>{form.medicineName}</strong></>
                  )}
                  {form.quantity && (
                    <> | 📦 Quantity: <strong>{form.quantity}</strong></>
                  )}
                </p>
              </div>
            )}

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
                Create Order
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
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
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
                {["Order ID", "Supplier", "Medicine",
                  "Quantity", "Amount", "Order Date",
                  "Status", "Actions"].map((h, i) => (
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{
                    textAlign: "center", padding: "40px",
                    color: "#a0aec0"
                  }}>
                    No orders found. Create your first order!
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: index % 2 === 0
                      ? "white" : "#fafafa"
                  }}>
                    <td style={{
                      padding: "12px 15px",
                      fontWeight: "600", color: "#2d3748"
                    }}>
                      #PO{order.id}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      🏢 {order.supplierName}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      💊 {order.medicineName}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {order.quantity} units
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      ₹{order.totalAmount}
                    </td>
                    <td style={{
                      padding: "12px 15px", color: "#718096"
                    }}>
                      {order.orderDate}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600",
                        background: getStatusBg(order.status),
                        color: getStatusColor(order.status)
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{
                      padding: "12px 15px"
                    }}>
                      <div style={{
                        display: "flex", gap: "5px",
                        flexWrap: "wrap"
                      }}>
                        {order.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(
                                order.id, "DELIVERED"
                              )}
                              style={{
                                padding: "5px 10px",
                                background: "#f0fff4",
                                color: "#276749",
                                border: "1px solid #9ae6b4",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "11px",
                                fontWeight: "600"
                              }}>
                              ✅ Deliver
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(
                                order.id, "CANCELLED"
                              )}
                              style={{
                                padding: "5px 10px",
                                background: "#fff5f5",
                                color: "#e53e3e",
                                border: "1px solid #fed7d7",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "11px",
                                fontWeight: "600"
                              }}>
                              ❌ Cancel
                            </button>
                          </>
                        )}
                        {order.status === "DELIVERED" && (
                          <span style={{
                            color: "#68d391",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            ✅ Stock Updated!
                          </span>
                        )}
                        {order.status !== "DELIVERED" && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            style={{
                              padding: "5px 10px",
                              background: "#fff5f5",
                              color: "#e53e3e",
                              border: "1px solid #fed7d7",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}>
                            🗑️
                          </button>
                        )}
                      </div>
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

export default PurchaseOrders;