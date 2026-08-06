import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import InventoryChart from "../components/InventoryChart";
import InventoryPieChart from "../components/InventoryPieChart";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {

    const [medicineCount, setMedicineCount] = useState(0);
    const [supplierCount, setSupplierCount] = useState(0);
    const [purchaseCount, setPurchaseCount] = useState(0);

    const [lowStockCount, setLowStockCount] = useState(0);
    const [outStockCount, setOutStockCount] = useState(0);
    const [nearExpiryCount, setNearExpiryCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = () => {

        // Demo values
        setMedicineCount(20);
        setSupplierCount(10);
        setPurchaseCount(15);

        setLowStockCount(4);
        setOutStockCount(2);
        setNearExpiryCount(3);
        setExpiredCount(2);

    };

    return (
        <>
            <Navbar />
            <div
  className="container-fluid py-5 text-white mb-4"
  style={{
    background: "linear-gradient(90deg,#2563eb,#06b6d4)"
  }}
>
  <div className="container">
    <div className="row align-items-center">

      <div className="col-md-7">

        <h1 className="display-4 fw-bold">
          💊 MediStock
        </h1>

        <p className="fs-4">
          Smart Medical Inventory Management Platform
        </p>

        <p>
          Monitor medicine stock, expiry dates,
          suppliers and purchases through one
          centralized dashboard.
        </p>

      </div>

      <div className="col-md-5 text-center">

        <img
          src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
          className="img-fluid"
          style={{maxHeight:"220px"}}
          alt="Medicine"
        />

      </div>

    </div>
  </div>
</div>

            <div className="container mt-4">

                <h2 className="mb-4">
                    MediStock Dashboard
                </h2>

                <div className="row g-3">

                    <DashboardCard
    title="Total Medicines"
    value={medicineCount}
    color="primary"
    icon="💊"
    link="/medicines"
/>

<DashboardCard
    title="Total Suppliers"
    value={supplierCount}
    color="success"
    icon="🏢"
    link="/suppliers"
/>

<DashboardCard
    title="Total Purchases"
    value={purchaseCount}
    color="dark"
    icon="📦"
    link="/purchases"
/>

<DashboardCard
    title="Low Stock"
    value={lowStockCount}
    color="warning"
    icon="⚠️"
    link="/low-stock"
/>

<DashboardCard
    title="Out Of Stock"
    value={outStockCount}
    color="danger"
    icon="❌"
    link="/out-of-stock"
/>

<DashboardCard
    title="Near Expiry"
    value={nearExpiryCount}
    color="info"
    icon="⏳"
    link="/near-expiry"
/>

<DashboardCard
    title="Expired Medicines"
    value={expiredCount}
    color="secondary"
    icon="🚫"
    link="/expired"
/>

                </div>

                <hr className="my-5" />

                <h3 className="mb-4">
                    Inventory Analytics
                </h3>

                <InventoryChart
                    medicines={medicineCount}
                    suppliers={supplierCount}
                    purchases={purchaseCount}
                    lowStock={lowStockCount}
                    expired={expiredCount}
                />

                <hr className="my-5" />

                <h3 className="mb-4">
                    Stock Distribution
                </h3>

                <div className="row">

                    <div className="col-md-6">

                        <InventoryPieChart
                            normalStock={14}
                            lowStock={4}
                            outOfStock={2}
                        />

                    </div>

                    <div className="col-md-6">

                        <div className="card shadow">

                            <div className="card-body">

                                <h4 className="mb-3">
                                    Inventory Summary
                                </h4>

                                <p>✅ Total Medicines : 20</p>

                                <p>✅ Total Suppliers : 10</p>

                                <p>✅ Total Purchases : 15</p>

                                <p className="text-warning">
                                    ⚠ Low Stock : 4
                                </p>

                                <p className="text-info">
                                    ⏳ Near Expiry : 3
                                </p>

                                <p className="text-danger">
                                    ❌ Expired : 2
                                </p>

                            </div>

                        </div>

                    </div>
                    <hr className="my-5" />

<RecentActivity />

                </div>

            </div>

            {/* Footer */}

            <footer
                className="text-center text-white mt-5 py-4"
                style={{
                    background: "linear-gradient(90deg,#2563eb,#06b6d4)"
                }}
            >

                <h4>💊 MediStock</h4>

                <p className="mb-1">
                    Smart Medical Inventory Management Platform
                </p>

                <small>
                    © 2026 | Developed by Daggupati Indumathi
                </small>

            </footer>

        </>
    );
}

function DashboardCard({ title, value, color, link, icon }) {
   

    return (

        <div className="col-md-3">

            <div className={`card border-${color} shadow`}>

                <div className="card-body text-center">

                    <div className="display-4 mb-2">

{icon}

</div>

<h1 className="fw-bold">

{value}

</h1>

<h5>

{title}

</h5>

                    <Link
                        to={link}
                        className={`btn btn-${color}`}
                    >
                        View
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Dashboard;