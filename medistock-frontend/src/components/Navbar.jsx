import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    // If you store login data later, clear it here
    // localStorage.removeItem("token");

    alert("Logged Out Successfully");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        <Link className="navbar-brand fw-bold" to="/dashboard">
          MediStock
        </Link>

        <div className="navbar-nav me-auto">

          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link" to="/medicines">
            Medicines
          </Link>

          <Link className="nav-link" to="/suppliers">
            Suppliers
          </Link>
          <Link className="nav-link" to="/low-stock">
            Low Stock
        </Link>
        <Link className="nav-link" to="/out-of-stock">
          Out Of Stock
      </Link>
      <Link className="nav-link" to="/near-expiry">
          Near Expiry
      </Link>
      <Link className="nav-link" to="/expired">
          Expired
      </Link>

        </div>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;