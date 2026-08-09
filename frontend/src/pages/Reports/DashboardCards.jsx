const DashboardCards = ({ reports }) => {

    const total = reports.length;

    const inventory = reports.filter(
        r => r.reportType === "Inventory Report"
    ).length;

    const purchase = reports.filter(
        r => r.reportType === "Purchase Report"
    ).length;

    const lowStock = reports.filter(
        r => r.reportType === "Low Stock Report"
    ).length;
    return (

        <div className="dashboard-cards">

            <div className="dashboard-card total">
               <div className="card-icon">📋</div>
                <h3>Total Reports</h3>
                <h1 style={{color:"#14968d"}}>{total}</h1>
            </div>

            <div className="dashboard-card supplier">
                <div className="card-icon">📦</div>

                <h3>Inventory</h3>
                <h1 style={{color:"#14968d"}}>{inventory}</h1>
            </div>

            <div className="dashboard-card low">
                <div className="card-icon">🛒</div>
                <h3>Purchase</h3>
                <h1 style={{color:"#14968d"}}>{purchase}</h1>
            </div>

            <div className="dashboard-card out">
                <div className="card-icon">⚠️</div>
                <h3>Low Stock</h3>
                <h1 style={{color:"#14968d"}}>{lowStock}</h1>
            </div>

        </div>

    );

};

export default DashboardCards;
