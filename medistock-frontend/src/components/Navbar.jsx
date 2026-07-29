import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        <Link className="navbar-brand" to="/dashboard">
          MediStock
        </Link>

        <div className="navbar-nav">

          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link" to="/medicines">
            Medicines
          </Link>

          <Link className="nav-link" to="/suppliers">
            Suppliers
          </Link>

          <Link className="nav-link" to="/">
            Logout
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;