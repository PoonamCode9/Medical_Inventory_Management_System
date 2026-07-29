import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
function Dashboard() {

  return (
    <>
    <Navbar />
    

    <div className="container mt-5">

      <h2>MediStock Dashboard</h2>

      <hr />

      

        <div className="card text-center shadow">

<h4>Total Medicines</h4>

<h1>20</h1>

<Link to="/medicines">

<button className="btn btn-primary">

View Medicines

</button>

</Link>

</div>

      </div>

    
    </>
  );

}

export default Dashboard;