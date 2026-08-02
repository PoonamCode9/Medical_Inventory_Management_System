
import { useEffect, useState } from "react";
import "../styles/StaffDashboard.css";

function StaffDashboard() {
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0);
  const [inStockCount, setInStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/medicines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setTotalMedicines(data.length);

        const inStock = data.filter(medicine => medicine.quantity > 50).length;
        const lowStock = data.filter(
          medicine => medicine.quantity > 0 && medicine.quantity <= 50
        ).length;

        setInStockCount(inStock);
        setLowStockCount(lowStock);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/purchase-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setTotalPurchaseOrders(data.length);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };

    fetchPurchaseOrders();
  }, []);
  return (



    <div className="dashboard-content">
      <h2>Staff Dashboard</h2>

      <div className="cards">
        <div className="dashboard-card">
          <h3> 💊  Medicines</h3>
          <p> view total medicines</p>
          <h2>{totalMedicines}</h2>
        </div>

        <div className="dashboard-card">
          <h3> ⚠️ Low Stock</h3>
          <p> medicines that need restocking</p>
          <h2>{lowStockCount}</h2>
        </div>

        <div className="dashboard-card">
          <h3> 🛒 Purchase Orders</h3>
          <p> Manage medicine orders</p>
          <h2>{totalPurchaseOrders}</h2>
        </div>

        <div className="dashboard-card">
          <h3> 📦 In Stock</h3>
          <p> Available stock</p>
          <h2>{inStockCount}</h2>
        </div>
      </div>
    </div>

  );
}

export default StaffDashboard;