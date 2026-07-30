const DashboardCards = ({ inventory }) => {

    const total = inventory.length;

    const inStock = inventory.filter(
        item => item.quantityAvailable > item.minimumStock
    ).length;

    const lowStock = inventory.filter(
        item =>
            item.quantityAvailable > 0 &&
            item.quantityAvailable <= item.minimumStock
    ).length;

    const outOfStock = inventory.filter(
        item => item.quantityAvailable === 0
    ).length;

    return (

        <div className="dashboard-cards">

            <div className="dashboard-card total">

                <div className="card-icon">📦</div>

                <h3>Total Medicines</h3>

                <h1 style={{ color: "#14968d" }}>
                    {total}
                </h1>

            </div>

            <div className="dashboard-card supplier">

                <div className="card-icon">🟢</div>

                <h3>In Stock</h3>

                <h1 style={{ color: "#14968d" }}>
                    {inStock}
                </h1>

            </div>

            <div className="dashboard-card low">

                <div className="card-icon">🟡</div>

                <h3>Low Stock</h3>

                <h1 style={{ color: "#14968d" }}>
                    {lowStock}
                </h1>

            </div>

            <div className="dashboard-card out">

                <div className="card-icon">🔴</div>

                <h3>Out Of Stock</h3>

                <h1 style={{ color: "#14968d" }}>
                    {outOfStock}
                </h1>

            </div>

        </div>

    );

};

export default DashboardCards;