import { Link, useNavigate } from "react-router-dom";
import { logoutUser, getUser } from "../services/authService";

function Navbar() {

    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {

        logoutUser();

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">

            <div className="container">

                {/* Brand */}
                <Link
                    className="navbar-brand fw-bold"
                    to="/dashboard"
                >
                    💊 MediStock
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/medicines"
                            >
                                Medicines
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/suppliers"
                            >
                                Suppliers
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/low-stock"
                            >
                                Low Stock
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/out-of-stock"
                            >
                                Out Of Stock
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/near-expiry"
                            >
                                Near Expiry
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/expired"
                            >
                                Expired
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/history"
                            >
                                History
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/purchases"
                            >
                                Purchases
                            </Link>
                        </li>

                    </ul>

                    {/* Right Side */}
                    <div className="d-flex align-items-center gap-3">

                        {user && (
                            <span className="text-white">
                                👤 {user.name}
                            </span>
                        )}

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;