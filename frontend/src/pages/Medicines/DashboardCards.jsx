const DashboardCards = ({ medicines }) => {
  return (
 <div className="row g-4 mb-4">

   

 
    <div className="dashboard-cards">

    <div className="dashboard-card total">
        <div className="card-icon">💊</div>
        <h5>Total Medicines</h5>
        <h2>{medicines.length}</h2>
    </div>

    <div className="dashboard-card low">
        <div className="card-icon">⚠️</div>
        <h5>Low Stock</h5>
        <h2>{medicines.filter(m => m.quantity <= 20).length}</h2>
    </div>

    <div className="dashboard-card out">
        <div className="card-icon">❌</div>
        <h5>Out Of Stock</h5>
        <h2>{medicines.filter(m => m.quantity === 0).length}</h2>
    </div>

    <div className="dashboard-card supplier">
        <div className="card-icon">🚚</div>
        <h5>Suppliers</h5>
        <h2>{new Set(medicines.map(m => m.supplier?.supplierName)).size}</h2>
    </div>

</div>

 
</div>
  );
};

export default DashboardCards;
