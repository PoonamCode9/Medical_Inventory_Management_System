function Dashboard() {

  return (

    <div className="container mt-5">

      <h2>MediStock Dashboard</h2>

      <hr />

      <div className="row">

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Total Medicines</h5>
            <h2>20</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Total Suppliers</h5>
            <h2>10</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Low Stock</h5>
            <h2>4</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5>Expired</h5>
            <h2>2</h2>
          </div>
        </div>

      </div>

    </div>

  );

}

export default Dashboard;