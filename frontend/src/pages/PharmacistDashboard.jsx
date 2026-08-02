import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/PharmacistDashboard.css";

function PharmacistDashboard() {

  const [totalMedicines, setTotalMedicines] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [inStockCount, setInStockCount] = useState(0);

  const [totalStock, setTotalStock] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const expiryResponse = await fetch(
        "http://localhost:8080/expiry-tracking/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const expiryData = await expiryResponse.json();

      setExpiredCount(expiryData.expired);
      setExpiringSoonCount(expiryData.expiringSoon);
      setValidCount(expiryData.valid);

      const medicineResponse = await fetch("http://localhost:8080/medicines", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const medicines = await medicineResponse.json();

      setTotalMedicines(medicines.length);
      const stockTotal = medicines.reduce(
        (sum, medicine) => sum + medicine.quantity,
        0
      );

      setTotalStock(stockTotal);

      const lowStockList = medicines.filter(
        medicine => medicine.quantity > 0 && medicine.quantity <= 50
      );

      setLowStockCount(lowStockList.length);

      const supplierResponse = await fetch("http://localhost:8080/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const suppliers = await supplierResponse.json();

      setSupplierCount(suppliers.length);

    } catch (error) {
      console.error(error);
    }
  };

  return (


    <div className="dashboard-content">

      <h2>Pharmacist Dashboard</h2>

      <div className="cards">

        <div className="dashboard-card">
          <h3>💊 Total Medicines</h3>
          <p> Available medicines</p>
          <h2>{totalMedicines}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/pharmacist-low-stock")}>
          <h3>⚠️ Low Stock</h3>
          <p> low inventory levels</p>
          <h2>{lowStockCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>🚚 Suppliers</h3>
          <p>  Total Suppliers </p>
          <h2>{supplierCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3>📦 Total Stock</h3>
          <p> Available Inventory</p>
          <h2>{totalStock}</h2>
        </div>
        <div className="dashboard-card"
          onClick={() => navigate("/pharmacist-expiry-tracking?status=expired")}>
          <h3>🔴 Expired</h3>
          <p>Expired Medicines</p>
          <h2>{expiredCount}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/pharmacist-expiry-tracking?status=expiring")}>
          <h3>🟠 Expiring Soon</h3>
          <p>Medicines Expiring Soon</p>
          <h2>{expiringSoonCount}</h2>
        </div>

        <div className="dashboard-card"
          onClick={() => navigate("/pharmacist-expiry-tracking?status=valid")}>
          <h3>🟢 Valid</h3>
          <p>Valid Medicines</p>
          <h2>{validCount}</h2>
        </div>

      </div>


    </div>



  );
}

export default PharmacistDashboard;