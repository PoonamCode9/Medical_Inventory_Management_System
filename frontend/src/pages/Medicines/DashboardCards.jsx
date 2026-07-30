import {
  FaCapsules,
  FaExclamationTriangle,
  FaTags,
  FaTruck,
} from "react-icons/fa";

const DashboardCards = ({ medicines }) => {

  const total = medicines.length;

  const lowStock = medicines.filter(
    (m) => Number(m.quantity) < 20
  ).length;

  const categories = new Set(
    medicines.map((m) => m.category)
  ).size;

  const suppliers = new Set(
    medicines.map((m) => m.supplier?.supplierName)
  ).size;

  const cards = [
    {
      title: "Total Medicines",
      value: total,
      icon: <FaCapsules />,
      color: "#14968d",
      bg: "#EAF8F7",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <FaExclamationTriangle />,
      color: "#E74C3C",
      bg: "#FFF2EF",
    },
    {
      title: "Categories",
      value: categories,
      icon: <FaTags />,
      color: "#F39C12",
      bg: "#FFF8E8",
    },
    {
      title: "Suppliers",
      value: suppliers,
      icon: <FaTruck />,
      color: "#14968d",
      bg: "#EAF8F7",
    },
  ];

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