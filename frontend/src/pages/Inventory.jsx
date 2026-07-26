import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Inventory() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "", description: ""
  });
  const [form, setForm] = useState({
    name: "", batchNumber: "", category: "",
    supplier: "", quantity: "", manufacturingDate: "",
    expiryDate: "", price: ""
  });
  const [editForm, setEditForm] = useState({
    id: "", name: "", batchNumber: "", category: "",
    supplier: "", quantity: "", manufacturingDate: "",
    expiryDate: "", price: ""
  });

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
    fetchSuppliers();
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

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/medicines", {
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price)
      });
      setMessage("Medicine added successfully!");
      setShowForm(false);
      setForm({
        name: "", batchNumber: "", category: "",
        supplier: "", quantity: "", manufacturingDate: "",
        expiryDate: "", price: ""
      });
      fetchMedicines();
    } catch (error) {
      setMessage("Failed to add medicine!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/medicines/${id}`
        );
        setMessage("Medicine deleted successfully!");
        fetchMedicines();
      } catch (error) {
        setMessage("Failed to delete!");
      }
    }
  };

  const handleUpdateStock = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/medicines/${selectedMedicine.id}/stock?quantity=${newQuantity}`
      );
      setMessage("Stock updated successfully!");
      setShowUpdateStock(false);
      setSelectedMedicine(null);
      setNewQuantity("");
      fetchMedicines();
    } catch (error) {
      setMessage("Failed to update stock!");
    }
  };

  const handleEdit = (medicine) => {
    setEditForm({
      id: medicine.id,
      name: medicine.name,
      batchNumber: medicine.batchNumber,
      category: medicine.category,
      supplier: medicine.supplier,
      quantity: medicine.quantity,
      manufacturingDate: medicine.manufacturingDate,
      expiryDate: medicine.expiryDate,
      price: medicine.price
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/medicines/${editForm.id}`,
        {
          ...editForm,
          quantity: parseInt(editForm.quantity),
          price: parseFloat(editForm.price)
        }
      );
      setMessage("Medicine updated successfully!");
      setShowEditForm(false);
      fetchMedicines();
    } catch (error) {
      setMessage("Failed to update medicine!");
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/categories",
        newCategory
      );
      setMessage("Category added successfully!");
      setShowCategoryForm(false);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      setMessage("Failed to add category!");
    }
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || m.category === filterCategory;
    const matchesStatus =
      filterStatus === "ALL" || m.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === "OUT_OF_STOCK") return "#e53e3e";
    if (status === "LOW_STOCK") return "#f6ad55";
    return "#68d391";
  };

const menuItems = role === "ADMIN" ? [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
  { icon: "👥", label: "User Management", path: "/user-management" },
] : [
  { icon: "📊", label: "Dashboard", path: "/pharmacist-dashboard" },
  { icon: "💊", label: "Inventory", path: "/inventory" },
  { icon: "🏢", label: "Suppliers", path: "/suppliers" },
  { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
  { icon: "📋", label: "Stock History", path: "/stock-history" },
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
          onClick={() => {
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
              💊 Medicine Inventory
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              Manage all medicines here
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              style={{
                padding: "12px 20px", background: "#f7fafc",
                color: "#2d3748", border: "1.5px solid #e2e8f0",
                borderRadius: "10px", cursor: "pointer",
                fontSize: "14px", fontWeight: "600"
              }}>
              📁 Categories
            </button>
            <button onClick={() => setShowForm(!showForm)}
              style={{
                padding: "12px 20px",
                background: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
                color: "white", border: "none",
                borderRadius: "10px", cursor: "pointer",
                fontSize: "14px", fontWeight: "600"
              }}>
              + Add Medicine
            </button>
          </div>
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
              }}>✕</button>
          </div>
        )}

        {/* Category Form */}
        {showCategoryForm && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <h3 style={{ color: "#1a1a2e", marginBottom: "15px" }}>
              📁 Manage Categories
            </h3>
            <div style={{
              display: "flex", gap: "15px", marginBottom: "15px"
            }}>
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({
                  ...newCategory, name: e.target.value
                })}
                style={{
                  flex: 1, padding: "10px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px", fontSize: "14px"
                }}
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({
                  ...newCategory, description: e.target.value
                })}
                style={{
                  flex: 1, padding: "10px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px", fontSize: "14px"
                }}
              />
              <button onClick={handleAddCategory}
                style={{
                  padding: "10px 20px",
                  background: "#e94560", color: "white",
                  border: "none", borderRadius: "8px",
                  cursor: "pointer", fontWeight: "600"
                }}>
                Add
              </button>
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px"
            }}>
              {categories.map((cat, index) => (
                <span key={index} style={{
                  padding: "6px 15px",
                  background: "#f0f0ff",
                  color: "#1a1a2e",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "1px solid #e0e0ff"
              }}>
              📁 {cat.name} (
              {medicines.filter(m => m.category === cat.name).length}
              )
              </span>
              ))}
              {categories.length === 0 && (
                <p style={{ color: "#a0aec0" }}>
                  No categories yet!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Update Stock Modal */}
        {showUpdateStock && selectedMedicine && (
          <div style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 1000
          }}>
            <div style={{
              background: "white", padding: "30px",
              borderRadius: "16px", width: "400px"
            }}>
              <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
                📦 Update Stock — {selectedMedicine.name}
              </h3>
              <p style={{ color: "#718096", marginBottom: "15px" }}>
                Current Quantity:{" "}
                <strong>{selectedMedicine.quantity}</strong>
              </p>
              <label style={{
                display: "block", color: "#2d3748",
                fontSize: "13px", fontWeight: "600",
                marginBottom: "8px"
              }}>
                NEW QUANTITY
              </label>
              <input
                type="number"
                placeholder="Enter new quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                style={{
                  width: "100%", padding: "12px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px", fontSize: "14px",
                  boxSizing: "border-box", marginBottom: "20px"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleUpdateStock}
                  style={{
                    flex: 1, padding: "12px",
                    background: "linear-gradient(135deg, #1a1a2e, #e94560)",
                    color: "white", border: "none",
                    borderRadius: "8px", cursor: "pointer",
                    fontWeight: "600"
                  }}>
                  Update Stock
                </button>
                <button onClick={() => {
                  setShowUpdateStock(false);
                  setSelectedMedicine(null);
                  setNewQuantity("");
                }}
                  style={{
                    flex: 1, padding: "12px",
                    background: "#f7fafc", color: "#718096",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px", cursor: "pointer"
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Medicine Modal */}
        {showEditForm && (
          <div style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 1000
          }}>
            <div style={{
              background: "white", padding: "30px",
              borderRadius: "16px", width: "600px",
              maxHeight: "80vh", overflowY: "auto"
            }}>
              <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
                ✏️ Edit Medicine — {editForm.name}
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px"
              }}>
                {[
                  { label: "MEDICINE NAME", key: "name", type: "text" },
                  { label: "BATCH NUMBER", key: "batchNumber", type: "text" },
                  { label: "QUANTITY", key: "quantity", type: "number" },
                  { label: "PRICE", key: "price", type: "number" },
                  { label: "MANUFACTURING DATE", key: "manufacturingDate", type: "date" },
                  { label: "EXPIRY DATE", key: "expiryDate", type: "date" },
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
                      value={editForm[field.key] || ""}
                      onChange={(e) => setEditForm({
                        ...editForm, [field.key]: e.target.value
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
                ))}
                <div>
                  <label style={{
                    display: "block", color: "#2d3748",
                    fontSize: "13px", fontWeight: "600",
                    marginBottom: "6px"
                  }}>
                    CATEGORY
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({
                      ...editForm, category: e.target.value
                    })}
                    style={{
                      width: "100%", padding: "10px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    display: "block", color: "#2d3748",
                    fontSize: "13px", fontWeight: "600",
                    marginBottom: "6px"
                  }}>
                    SUPPLIER
                  </label>
                  <select
                    value={editForm.supplier}
                    onChange={(e) => setEditForm({
                      ...editForm, supplier: e.target.value
                    })}
                    style={{
                      width: "100%", padding: "10px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px",
                      boxSizing: "border-box",
                      background: "#f8fafc"
                    }}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((sup, index) => (
                      <option key={index} value={sup.name}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{
                marginTop: "20px", display: "flex", gap: "10px"
              }}>
                <button onClick={handleEditSubmit}
                  style={{
                    padding: "12px 25px",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
                    color: "white", border: "none",
                    borderRadius: "8px", cursor: "pointer",
                    fontWeight: "600"
                  }}>
                  Save Changes
                </button>
                <button onClick={() => setShowEditForm(false)}
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
          </div>
        )}

        {/* Add Medicine Form */}
        {showForm && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <h3 style={{ color: "#1a1a2e", marginBottom: "20px" }}>
              Add New Medicine
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
                  MEDICINE NAME
                </label>
                <input type="text"
                  placeholder="Enter medicine name"
                  value={form.name}
                  onChange={(e) => setForm({
                    ...form, name: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  BATCH NUMBER
                </label>
                <input type="text"
                  placeholder="Enter batch number"
                  value={form.batchNumber}
                  onChange={(e) => setForm({
                    ...form, batchNumber: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  CATEGORY
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({
                    ...form, category: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  SUPPLIER
                </label>
                <select
                  value={form.supplier}
                  onChange={(e) => setForm({
                    ...form, supplier: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup, index) => (
                    <option key={index} value={sup.name}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  QUANTITY
                </label>
                <input type="number"
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
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  PRICE (₹)
                </label>
                <input type="number"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={(e) => setForm({
                    ...form, price: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  MANUFACTURING DATE
                </label>
                <input type="date"
                  value={form.manufacturingDate}
                  onChange={(e) => setForm({
                    ...form, manufacturingDate: e.target.value
                  })}
                  style={{
                    width: "100%", padding: "10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                    boxSizing: "border-box", background: "#f8fafc"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", color: "#2d3748",
                  fontSize: "13px", fontWeight: "600",
                  marginBottom: "6px"
                }}>
                  EXPIRY DATE
                </label>
                <input type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({
                    ...form, expiryDate: e.target.value
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
                Save Medicine
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

        {/* Search and Filter */}
        <div style={{
          display: "flex", gap: "15px", marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="🔍 Search by name, category, supplier..."
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
            <option value="ALL">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        {/* Medicine Table */}
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
                {["Name", "Batch", "Category", "Supplier",
                  "Qty", "Expiry", "Price",
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
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{
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
                   <td style={{ padding: "12px 15px" }}>
  <div style={{
    display: "flex", gap: "5px", flexWrap: "wrap"
  }}>
    {/* Edit — Admin and Pharmacist */}
    <button onClick={() => handleEdit(medicine)}
      style={{
        padding: "5px 8px", background: "#f0f0ff",
        color: "#1a1a2e", border: "1px solid #e0e0ff",
        borderRadius: "6px", cursor: "pointer",
        fontSize: "11px", fontWeight: "600"
      }}>
      ✏️ Edit
    </button>

    {/* Stock Update — Admin and Pharmacist */}
    <button onClick={() => {
      setSelectedMedicine(medicine);
      setShowUpdateStock(true);
    }}
      style={{
        padding: "5px 8px", background: "#f0fff4",
        color: "#276749", border: "1px solid #9ae6b4",
        borderRadius: "6px", cursor: "pointer",
        fontSize: "11px", fontWeight: "600"
      }}>
      📦 Stock
    </button>

    {/* Delete — Admin ONLY */}
    {role === "ADMIN" && (
      <button onClick={() => handleDelete(medicine.id)}
        style={{
          padding: "5px 8px", background: "#fff5f5",
          color: "#e53e3e", border: "1px solid #fed7d7",
          borderRadius: "6px", cursor: "pointer",
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

export default Inventory;