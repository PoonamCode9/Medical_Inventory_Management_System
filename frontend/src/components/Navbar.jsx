import "../css/Navbar.css";

function Navbar() {

    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    return (

        <div className="top-navbar">

            <div className="navbar-title"></div>

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

    );

}

export default Navbar;