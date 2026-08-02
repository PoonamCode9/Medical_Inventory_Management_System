import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const [medicineOpen, setMedicineOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <ul>

        {/* Dashboard */}
        <li onClick={() => navigate("/admin-dashboard")}>
          🏠 Dashboard
        </li>

        {/* Medicines */}
        <li onClick={() => setMedicineOpen(!medicineOpen)}>
          💊 Medicines {medicineOpen ? "▲" : "▼"}
        </li>

        {medicineOpen && (
          <ul>
            <li onClick={() => navigate("/add-medicine")}>
              ➕ Add Medicine
            </li>

            <li onClick={() => navigate("/medicines")}>
              📋 View Medicines
            </li>
          </ul>
        )}

        {/* Suppliers */}
        <li onClick={() => setSupplierOpen(!supplierOpen)}>
          🚚 Suppliers {supplierOpen ? "▲" : "▼"}
        </li>

        {supplierOpen && (
          <ul>
            <li onClick={() => navigate("/add-supplier")}>
              ➕ Add Supplier
            </li>

            <li onClick={() => navigate("/view-suppliers")}>
              📋 View Suppliers
            </li>
          </ul>
        )}

        {/* Stock */}
        <li onClick={() => setStockOpen(!stockOpen)}>
          📦 Stock {stockOpen ? "▲" : "▼"}
        </li>

        {stockOpen && (
          <ul>
            <li onClick={() => navigate("/stock")}>
              📦 Stock Management
            </li>

            <li onClick={() => navigate("/stock-history")}>
              📊 Stock History
            </li>
          </ul>
        )}

        {/* Purchase Orders */}
        <li onClick={() => setPurchaseOrderOpen(!purchaseOrderOpen)}>
          🛒 Purchase Orders {purchaseOrderOpen ? "▲" : "▼"}
        </li>

        {purchaseOrderOpen && (
          <ul>
            <li onClick={() => navigate("/add-purchase-order")}>
              ➕ Add Purchase Order
            </li>

            <li onClick={() => navigate("/view-purchase-orders")}>
              📋 View Purchase Orders
            </li>
          </ul>
        )}

        {/* Users */}
        <li onClick={() => navigate("/users")}>
          👥 Users
        </li>

        {/* Profile */}
        <li onClick={() => navigate("/admin-profile")}>
          👤 Profile
        </li>

        {/* Logout */}
        <li
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          🚪 Logout
        </li>

      </ul>
    </div>
  );
}

export default AdminSidebar;