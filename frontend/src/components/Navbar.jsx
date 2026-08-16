import { Link } from "react-router-dom";
import { FaBell, FaCog } from "react-icons/fa";
import "../css/Navbar.css";

function Navbar() {

    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    return (

        <div className="top-navbar">

            <div className="navbar-title">
                <span>MediStock Dashboard</span>
            </div>

            <div className="navbar-actions">

                <Link
                    to="/notifications"
                    className="navbar-icon-button"
                    title="Notifications"
                >
                    <FaBell />
                </Link>

                <Link
                    to="/settings"
                    className="navbar-icon-button"
                    title="Settings"
                >
                    <FaCog />
                </Link>

                <div className="profile">

                    <div className="avatar">
                        {name ? name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div>
                        <h5>{name}</h5>
                        <span>{role}</span>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default Navbar;
