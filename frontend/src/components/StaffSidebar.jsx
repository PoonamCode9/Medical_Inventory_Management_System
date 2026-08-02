import { useNavigate } from "react-router-dom";

function StaffSidebar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="sidebar">
            <h2>Staff Panel</h2>

            <ul>
                <li onClick={() => navigate("/staff-dashboard")}>
                    Dashboard
                </li>

                <li onClick={() => navigate("/staff-medicines")}>
                    View Medicines
                </li>



                <li onClick={() => navigate("/staff-purchase-orders")}>
                    Purchase Orders
                </li>

                <li onClick={() => navigate("/stock-logs")}>
                    Stock Logs
                </li>

                <li onClick={() => navigate("/staff-profile")}>
                    Profile
                </li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </div>
    );
}

export default StaffSidebar;