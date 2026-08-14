import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MedicineStatusChart from "../components/MedicineStatusChart";
import MedicineCategoryChart from "../components/MedicineCategoryChart";
import ExpiryStatusChart from "../components/ExpiryStatusChart";
import StockMovementChart from "../components/StockMovementChart";

import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [medicineCount, setMedicineCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const expiryResponse = await axios.get(
        "http://localhost:8080/expiry-tracking/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpiredCount(expiryResponse.data.expired);
      setExpiringSoonCount(expiryResponse.data.expiringSoon);
      setValidCount(expiryResponse.data.valid);

      const medicineResponse = await axios.get(
        "http://localhost:8080/medicines/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const supplierResponse = await axios.get(
        "http://localhost:8080/suppliers/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userResponse = await axios.get(
        "http://localhost:8080/users/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserCount(userResponse.data);

      setMedicineCount(medicineResponse.data);
      setSupplierCount(supplierResponse.data);
      setUserCount(userResponse.data);

      // Fetch all medicines to calculate total stock
      const medicinesResponse = await axios.get(
        "http://localhost:8080/medicines",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalStock = medicinesResponse.data.reduce(
        (sum, medicine) => sum + medicine.quantity,
        0
      );

      setStockCount(totalStock);

      const lowStock = medicinesResponse.data.filter(
        medicine => medicine.quantity > 0 && medicine.quantity <= 50
      );

      setLowStockCount(lowStock.length);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="admin-dashboard-content">

      <h1>Dashboard Overview</h1>

      <div className="cards">

        <div className="dashboard-card">
          <h3>💊 Medicines</h3>
          <p>Total Medicines</p>
          <h2>{medicineCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>🚚 Suppliers</h3>
          <p>Total Suppliers</p>
          <h2>{supplierCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>👥 Users</h3>
          <p>Total Users</p>
          <h2>{userCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>📦 Inventory</h3>
          <p>Stock Items</p>
          <h2>{stockCount}</h2>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin-low-stock")}
        >
          <h3>⚠️ Low Stock</h3>
          <p>Medicines Below Threshold</p>
          <h2>{lowStockCount}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/expiry-tracking?status=expired")}>
          <h3>🔴 Expired</h3>
          <p>Expired Medicines</p>
          <h2>{expiredCount}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/expiry-tracking?status=expiring")}>
          <h3>🟠 Expiring Soon</h3>
          <p>Medicines Expiring Soon</p>
          <h2>{expiringSoonCount}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/expiry-tracking?status=valid")}>
          <h3>🟢 Valid</h3>
          <p>Valid Medicines</p>
          <h2>{validCount}</h2>
        </div>

      </div>
      <div className="charts-row">
        <MedicineStatusChart />
        <MedicineCategoryChart />

      </div>
      <div className="charts-row">
        <ExpiryStatusChart />
        <StockMovementChart />
      </div>

    </div>
  );
}

export default AdminDashboard;