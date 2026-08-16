import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";

import ChatBot from "../../components/ChatBot/ChatBot";

import {
  FaPills,
  FaBoxes,
  FaTruck,
  FaBell,
  FaShoppingCart,
  FaClipboardList,
  FaExclamationTriangle,
  FaSearch,
  FaSyncAlt,
  FaCalendarAlt
} from "react-icons/fa";

import { getDashboardData } from "../../services/authService";

import "./StaffDashboard.css";

/* ---------------- Fallback sample data ---------------- */

const DEFAULT_STATE = {
  inventory: 0,
  suppliers: 0,
  purchaseOrders: 0,
  stockAvailable: 0,
  lowStock: 0,
  expiryAlerts: 0,

  medicines: [
    { medicine: "Amoxicillin 500mg", batch: "BAT-22981", qty: 1240, status: "In stock" },
    { medicine: "Insulin Glargine", batch: "BAT-23015", qty: 38, status: "Low stock" },
    { medicine: "Paracetamol 650mg", batch: "BAT-22750", qty: 60, status: "Low stock" },
    { medicine: "Metformin 500mg", batch: "BAT-23102", qty: 890, status: "In stock" },
    { medicine: "Azithromycin 250mg", batch: "BAT-22899", qty: 0, status: "Out of stock" },
  ],

  recentStockLogs: [
    { date: "2026-08-01", medicine: "Amoxicillin 500mg", change: "+200", by: "You" },
    { date: "2026-07-31", medicine: "Paracetamol 650mg", change: "-40", by: "You" },
    { date: "2026-07-30", medicine: "Metformin 500mg", change: "+500", by: "A. Khan" },
  ],

  purchaseOrdersList: [
    { orderId: "PO-2291", supplier: "MedSupply Co.", status: "Delivered", expected: "2026-07-29" },
    { orderId: "PO-2298", supplier: "PharmaLink Ltd.", status: "In transit", expected: "2026-08-03" },
    { orderId: "PO-2302", supplier: "Global Health Distributors", status: "Pending", expected: "2026-08-06" },
  ],
 lowStockItems: [
    { medicine: "Insulin Glargine", batch: "BAT-23015", qty: 38, reorderLevel: 50 },
    { medicine: "Azithromycin 250mg", batch: "BAT-22899", qty: 0, reorderLevel: 40 },
    { medicine: "Paracetamol 650mg", batch: "BAT-22750", qty: 60, reorderLevel: 100 },
  ],

  expiringMedicines: [
    { medicine: "Paracetamol 650mg", batch: "BAT-22750", expires: "08/2026", daysLeft: 30 },
    { medicine: "Azithromycin 250mg", batch: "BAT-22899", expires: "06/2026", daysLeft: 12 },
  ],
};

function statusBadgeClass(status) {
  if (status === "In stock" || status === "Delivered") return "badge badge-ok";
  if (status === "Low stock" || status === "Pending") return "badge badge-warning";
  if (status === "Out of stock") return "badge badge-danger";
  return "badge badge-info";
}

function StaffDashboard() {

  const [dashboardData, setDashboardData] = useState(DEFAULT_STATE);
  const [searchTerm, setSearchTerm] = useState("");

  // Quick stock update form state
  const [updateMedicine, setUpdateMedicine] = useState("");
  const [updateQty, setUpdateQty] = useState("");
  const [updateNote, setUpdateNote] = useState("");

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await getDashboardData(token, "STAFF");

        setDashboardData((prev) => ({ ...prev, ...response.data }));

      } catch (error) {

        console.error("Failed to load dashboard data:", error);

      }

    };

    fetchDashboardData();

  }, []);

  const filteredMedicines = useMemo(() => {
    if (!searchTerm.trim()) return dashboardData.medicines;
    const term = searchTerm.toLowerCase();
    return dashboardData.medicines.filter(
      (m) =>
        m.medicine.toLowerCase().includes(term) ||
        m.batch.toLowerCase().includes(term)
    );
  }, [searchTerm, dashboardData.medicines]);

  function handleStockUpdate(e) {
    e.preventDefault();
    if (!updateMedicine || !updateQty) return;

    // TODO: wire to POST /api/inventory/stock-update
    console.log("Stock update submitted:", {
      medicine: updateMedicine,
      qtyChange: updateQty,
      note: updateNote,
    });

    setUpdateMedicine("");
    setUpdateQty("");
    setUpdateNote("");
  }

  return (

    <div className="staff-container">

      <Sidebar role="staff" />

      <div className="main-content">

        <Navbar userName={localStorage.getItem("fullName")} />

        {/* KPI cards */}
        <div className="cards">

          <DashboardCard title="Inventory" value={dashboardData.inventory} icon={<FaBoxes />} />
          {/* <DashboardCard title="Suppliers" value={dashboardData.suppliers} icon={<FaTruck />} /> */}
          <DashboardCard title="Purchase Orders" value={dashboardData.purchaseOrders} icon={<FaShoppingCart />} />
          <DashboardCard title="Stock Logs" value={dashboardData.stockLogs} icon={<FaClipboardList />} />
          <DashboardCard title="Low-Stock Alerts" value={dashboardData.lowStockAlerts} icon={<FaExclamationTriangle />} />

        </div>
  

        {/* Scan & search medicines */}
        <div className="panel">
          <h3 className="panel-title"><FaSearch /> Scan & search medicines</h3>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by medicine name or batch number…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-row">No medicines match that search.</td>
                </tr>
              )}
              {filteredMedicines.map((m) => (
                <tr key={m.batch}>
                  <td>{m.medicine}</td>
                  <td className="mono">{m.batch}</td>
                  <td>{m.qty}</td>
                  <td><span className={statusBadgeClass(m.status)}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*  Low-stock alerts + expiry alerts*/}
  <div className="grid-2">

          <div className="panel">
            <h3 className="panel-title"><FaExclamationTriangle /> Low-stock items</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Qty</th>
                  <th>Reorder at</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.lowStockItems.map((item) => (
                  <tr key={item.batch}>
                    <td>{item.medicine}</td>
                    <td className="mono">{item.batch}</td>
                    <td>
                      <span className={`badge ${item.qty === 0 ? "badge-danger" : "badge-warning"}`}>{item.qty}</span>
                    </td>
                    <td>{item.reorderLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h3 className="panel-title"><FaCalendarAlt /> Expiring medicines</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Expires</th>
                  <th>Days left</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.expiringMedicines.map((item) => (
                  <tr key={item.batch}>
                    <td>{item.medicine}</td>
                    <td className="mono">{item.batch}</td>
                    <td>{item.expires}</td>
                    <td>
                      <span className={`badge ${item.daysLeft <= 15 ? "badge-danger" : "badge-warning"}`}>
                        {item.daysLeft}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Recent stock logs + Purchase orders */}
        {/* <div className="grid-2">

          <div className="panel">
            <h3 className="panel-title"><FaClipboardList /> Recent stock logs</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Medicine</th>
                  <th>Change</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentStockLogs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.date}</td>
                    <td>{log.medicine}</td>
                    <td>
                      <span className={`badge ${log.change.startsWith("+") ? "badge-ok" : "badge-info"}`}>
                        {log.change}
                      </span>
                    </td>
                    <td>{log.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h3 className="panel-title"><FaShoppingCart /> Purchase orders</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Expected</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.purchaseOrdersList.map((p) => (
                  <tr key={p.orderId}>
                    <td className="mono">{p.orderId}</td>
                    <td>{p.supplier}</td>
                    <td><span className={statusBadgeClass(p.status)}>{p.status}</span></td>
                    <td>{p.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div> */}

      </div>
 <ChatBot />
    </div>

  );

}

export default StaffDashboard;