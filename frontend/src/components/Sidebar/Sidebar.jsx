import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaPills,
  FaTruck,
  FaBoxes,
  FaChartBar,
  FaShoppingCart,
  FaClipboardList,
  FaBell,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar({ role }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="sidebar">

      <h2 className="logo">MediStock</h2>

      <ul>

        {/* Dashboard */}

        <li>
          <NavLink to={`/${role}`}>
            <FaHome /> Dashboard
          </NavLink>
        </li>

        {/* Admin */}

        {role === "admin" && (
          <>
            <li><NavLink to="/users"><FaUsers /> Users</NavLink></li>

            <li><NavLink to="/medicines"><FaPills /> Medicines</NavLink></li>

            <li><NavLink to="/suppliers"><FaTruck /> Suppliers</NavLink></li>

            <li><NavLink to="/inventory"><FaBoxes /> Inventory</NavLink></li>

            <li><NavLink to="/reports"><FaChartBar /> Reports</NavLink></li>

            <li><NavLink to="/notifications"><FaBell /> Notifications</NavLink></li>

            <li><NavLink to="/analytics"><FaChartBar /> Analytics</NavLink></li>
{/* 
            <li><NavLink to="/settings"><FaCog /> Settings</NavLink></li> */}
          </>
        )}

        {/* Pharmacist */}

        {role === "pharmacist" && (
          <>
            <li><NavLink to="/medicines"><FaPills /> Medicines</NavLink></li>

            <li><NavLink to="/stock"><FaBoxes /> Stock</NavLink></li>

            <li><NavLink to="/notifications"><FaBell /> Notifications</NavLink></li>
          </>
        )}

        {/* Staff */}

        {role === "staff" && (
          <>
            <li><NavLink to="/inventory"><FaBoxes /> Inventory</NavLink></li>

            <li><NavLink to="/medicines"><FaPills /> Medicines</NavLink></li>

            {/* <li><NavLink to="/purchase-orders"><FaShoppingCart /> Purchase Orders</NavLink></li> */}

            {/* <li><NavLink to="/stock-logs"><FaClipboardList /> Stock Logs</NavLink></li> */}

            <li><NavLink to="/notifications"><FaBell /> Notifications</NavLink></li>
          </>
        )}

        {/* Logout */}

        <li className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>

      </ul>

    </div>

  );

}

export default Sidebar;