import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PharmacistSidebar() {
    const navigate = useNavigate();

    const [stockOpen, setStockOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="sidebar">
            <h2>Pharmacist Panel</h2>

            <ul>

                <li onClick={() => navigate("/pharmacist-dashboard")}>
                    Dashboard
                </li>

                <li onClick={() => navigate("/pharmacist-medicines")}>
                    View Medicines
                </li>

                <li onClick={() => setStockOpen(!stockOpen)}>
                    Stock {stockOpen ? "▲" : "▼"}
                </li>

                {stockOpen && (
                    <ul>
                        <li onClick={() => navigate("/pharmacist-stock")}>
                            Stock Management
                        </li>
                    </ul>
                )}

                <li onClick={() => navigate("/pharmacist-suppliers")}>
                    View Suppliers
                </li>

                <li onClick={() => navigate("/pharmacist-profile")}>
                    Profile
                </li>

                <li onClick={handleLogout}>
                    Logout
                </li>

            </ul>
        </div>
    );
}

export default PharmacistSidebar;