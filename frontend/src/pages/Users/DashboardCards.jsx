import {
FaUsers,
FaUserShield,
FaUserNurse,
FaUser
} from "react-icons/fa";

const DashboardCards = ({ users }) => {

const total = users.length;

const admins = users.filter(
    user => user.roleName === "Admin"
).length;

const pharmacists = users.filter(
    user => user.roleName === "Pharmacist"
).length;

const staff = users.filter(
    user => user.roleName === "Staff"
).length;
users.filter(u=>u.roleName==="STAFF").length;

return(

<div className="dashboard-cards">

<div className="dashboard-card total">

<div className="card-icon">

<FaUsers/>

</div>

<h3>Total Users</h3>

<h1 style={{color:"#14968d"}}>{total}</h1>

</div>

<div className="dashboard-card supplier">

<div className="card-icon">

<FaUserShield/>

</div>

<h3>Admins</h3>

<h1 style={{color:"#14968d"}}>{admins}</h1>

</div>

<div className="dashboard-card low">

<div className="card-icon">

<FaUserNurse/>

</div>

<h3>Pharmacists</h3>

<h1 style={{color:"#14968d"}}>{pharmacists}</h1>

</div>

<div className="dashboard-card out">

<div className="card-icon">

<FaUser/>

</div>

<h3>Staff</h3>

<h1 style={{color:"#14968d"}}>{staff}</h1>

</div>

</div>

);

};

export default DashboardCards;