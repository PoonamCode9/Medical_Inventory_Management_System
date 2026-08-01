import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPills,
  FaTruck,
  FaBoxes,
  FaClipboardList,
  FaBell,
  FaChartBar,
  FaHistory,
  FaClock,
  FaSignOutAlt
} from "react-icons/fa";

import "../css/Sidebar.css";

function Sidebar({ role, logout }) {
  return (
    <div className="sidebar">

      <div className="logo">

    <h2>🏥 MediStock</h2>

    <p>
        Medical Inventory
        <br />
        Management System
    </p>

</div>

      <ul>

        <li>
          <NavLink to="/dashboard">
            <FaHome /> Dashboard
          </NavLink>
        </li>

        {(role === "ADMIN" || role === "PHARMACIST") && (
          <li>
            <NavLink to="/medicines">
              <FaPills /> Medicines
            </NavLink>
          </li>
        )}

        {role === "ADMIN" && (
          <li>
            <NavLink to="/suppliers">
              <FaTruck /> Suppliers
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/inventory">
            <FaBoxes /> Inventory
          </NavLink>
        </li>

        <li>
          <NavLink to="/purchaseorders">
            <FaClipboardList /> Purchase Orders
          </NavLink>
        </li>

        {(role === "ADMIN" || role === "STAFF") && (
          <li>
            <NavLink to="/stocklogs">
              <FaHistory /> Stock Logs
            </NavLink>
          </li>
        )}

        {(role === "ADMIN" || role === "PHARMACIST") && (
          <li>
            <NavLink to="/expirytracking">
              <FaClock /> Expiry Tracking
            </NavLink>
          </li>
        )}

        {(role === "ADMIN" || role === "STAFF") && (
          <li>
            <NavLink to="/notifications">
              <FaBell /> Notifications
            </NavLink>
          </li>
        )}

        {role === "ADMIN" && (
          <li>
            <NavLink to="/reports">
              <FaChartBar /> Reports
            </NavLink>
          </li>
        )}

      </ul>

      <button
        className="logout-side"
        onClick={logout}
      >
        <FaSignOutAlt /> Logout
      </button>

    </div>
  );
}

export default Sidebar;