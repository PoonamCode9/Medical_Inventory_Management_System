import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar({ userName }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("roleName");
        localStorage.removeItem("fullName");

        navigate("/login");

    };

    return (

        <div className="navbar">

            <div className="navbar-left">

                <h2>Dashboard</h2>

            </div>

            <div className="navbar-right">

                <FaBell className="nav-icon" />

                <div className="profile">

                    <FaUserCircle className="profile-icon" />

                    <div className="profile-info">
                        <span>{userName}</span>
                        <small>{localStorage.getItem("roleName")}</small>
                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

export default Navbar;