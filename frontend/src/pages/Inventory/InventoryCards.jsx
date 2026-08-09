const InventoryCards = ({ inventory }) => {
  const totalItems = inventory.length;

  const lowStock = inventory.filter(
    (item) => item.quantityAvailable <= item.minimumStock
  ).length;

  const totalQuantity = inventory.reduce(
    (sum, item) => sum + item.quantityAvailable,
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const updatedToday = inventory.filter((item) =>
    item.lastUpdated?.startsWith(today)
  ).length;

  return (
    <div className="row g-4 mb-4">
      <div className="dashboard-cards">

        <div className="dashboard-card total">
          <div className="card-icon">📦</div>
          <h5>Total Inventory</h5>
          <h2>{totalItems}</h2>
        </div>

        <div className="dashboard-card low">
          <div className="card-icon">⚠️</div>
          <h5>Low Stock</h5>
          <h2>{lowStock}</h2>
        </div>

        <div className="dashboard-card out">
          <div className="card-icon">📊</div>
          <h5>Total Quantity</h5>
          <h2>{totalQuantity}</h2>
        </div>

        <div className="dashboard-card supplier">
          <div className="card-icon">🕒</div>
          <h5>Updated Today</h5>
          <h2>{updatedToday}</h2>
        </div>

      </div>
    </div>
  );
};

export default InventoryCards;
