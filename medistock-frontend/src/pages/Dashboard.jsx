import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

import { getMedicines } from "../services/medicineService";
import { getSuppliers } from "../services/supplierService";
import { getPurchases } from "../services/purchaseService";

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

    const [normalStockCount, setNormalStockCount] = useState(0);


    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            const medicineRes = await getMedicines();
            const supplierRes = await getSuppliers();
            const purchaseRes = await getPurchases();

            const medicines = medicineRes.data || [];
            const suppliers = supplierRes.data || [];
            const purchases = purchaseRes.data || [];


            // -----------------------------
            // TOTAL COUNTS
            // -----------------------------

            setMedicineCount(medicines.length);
            setSupplierCount(suppliers.length);
            setPurchaseCount(purchases.length);


            // -----------------------------
            // LOW STOCK
            // -----------------------------

            const lowStock = medicines.filter(
                (medicine) =>
                    Number(medicine.quantity) > 0 &&
                    Number(medicine.quantity) < 10
            );

            setLowStockCount(lowStock.length);


            // -----------------------------
            // OUT OF STOCK
            // -----------------------------

            const outOfStock = medicines.filter(
                (medicine) =>
                    Number(medicine.quantity) === 0
            );

            setOutStockCount(outOfStock.length);


            // -----------------------------
            // EXPIRY CALCULATIONS
            // -----------------------------

            const today = new Date();

            const next30Days = new Date();

            next30Days.setDate(
                today.getDate() + 30
            );


            // -----------------------------
            // EXPIRED
            // -----------------------------

            const expired = medicines.filter(
                (medicine) => {

                    if (!medicine.expiryDate) {
                        return false;
                    }

                    const expiryDate =
                        new Date(medicine.expiryDate);

                    return expiryDate < today;
                }
            );

            setExpiredCount(expired.length);


            // -----------------------------
            // NEAR EXPIRY
            // -----------------------------

            const nearExpiry = medicines.filter(
                (medicine) => {

                    if (!medicine.expiryDate) {
                        return false;
                    }

                    const expiryDate =
                        new Date(medicine.expiryDate);

                    return (
                        expiryDate >= today &&
                        expiryDate <= next30Days
                    );

                }
            );

            setNearExpiryCount(
                nearExpiry.length
            );


            // -----------------------------
            // NORMAL STOCK
            // -----------------------------

            const normalStock = medicines.filter(
                (medicine) =>
                    Number(medicine.quantity) >= 10
            );

            setNormalStockCount(
                normalStock.length
            );


        } catch (error) {

            console.error(
                "Error loading dashboard:",
                error
            );

        }

    };


    return (

        <>

            <Navbar />


            {/* =====================================
                HERO SECTION
            ====================================== */}

            <div
                className="container-fluid text-white py-5"
                style={{
                    background:
                        "linear-gradient(90deg,#2563eb,#06b6d4)"
                }}
            >

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-md-7">

                            <h1 className="display-4 fw-bold">
                                💊 MediStock
                            </h1>

                            <p className="fs-4">
                                Smart Medical Inventory
                                Management Platform
                            </p>

                            <p className="fs-6">

                                Monitor medicine stock,
                                expiry dates, suppliers
                                and purchases through
                                one centralized dashboard.

                            </p>

                        </div>


                        <div className="col-md-5 text-center">

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
                                className="img-fluid"
                                style={{
                                    maxHeight: "220px"
                                }}
                                alt="Medical Inventory"
                            />

                        </div>

                    </div>

                </div>

            </div>



            {/* =====================================
                MAIN DASHBOARD
            ====================================== */}

            <div className="container mt-5">


                {/* TITLE */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Clinical Inventory Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Overview of your medical inventory
                        </p>

                    </div>


                    <Link
                        to="/medicines"
                        className="btn btn-primary rounded-pill px-4"
                    >
                        + Manage Medicines
                    </Link>

                </div>



                {/* =====================================
                    STATISTICS CARDS
                ====================================== */}

                <div className="row g-4">


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
                        title="Low Stock Items"
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
                        title="Expiring Soon"
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



                {/* =====================================
                    ANALYTICS
                ====================================== */}

                <div className="mt-5 mb-4">

                    <h3 className="fw-bold mb-1">
                        📊 Inventory Analytics
                    </h3>

                    <p className="text-muted">
                        Visual overview of medicine inventory
                        and purchase activity
                    </p>

                </div>


                <InventoryChart />



                {/* =====================================
                    STOCK DISTRIBUTION
                ====================================== */}

                <div className="mt-5 mb-4">

                    <h3 className="fw-bold mb-1">
                        📦 Stock Distribution
                    </h3>

                    <p className="text-muted">
                        Current stock health of your inventory
                    </p>

                </div>


                <div className="row g-4">


                    {/* PIE CHART */}

                    <div className="col-lg-6">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: "18px"
                            }}
                        >

                            <div className="card-body">

                                <InventoryPieChart

                                    normalStock={
                                        normalStockCount
                                    }

                                    lowStock={
                                        lowStockCount
                                    }

                                    outOfStock={
                                        outStockCount
                                    }

                                />

                            </div>

                        </div>

                    </div>



                    {/* INVENTORY SUMMARY */}

                    <div className="col-lg-6">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: "18px"
                            }}
                        >

                            <div className="card-body p-4">

                                <h4 className="fw-bold mb-4">
                                    📋 Inventory Summary
                                </h4>


                                <SummaryRow
                                    icon="💊"
                                    title="Total Medicines"
                                    value={medicineCount}
                                />


                                <SummaryRow
                                    icon="🏢"
                                    title="Total Suppliers"
                                    value={supplierCount}
                                />


                                <SummaryRow
                                    icon="📦"
                                    title="Total Purchases"
                                    value={purchaseCount}
                                />


                                <SummaryRow
                                    icon="⚠️"
                                    title="Low Stock"
                                    value={lowStockCount}
                                    textClass="text-warning"
                                />


                                <SummaryRow
                                    icon="⏳"
                                    title="Near Expiry"
                                    value={nearExpiryCount}
                                    textClass="text-info"
                                />


                                <SummaryRow
                                    icon="❌"
                                    title="Expired"
                                    value={expiredCount}
                                    textClass="text-danger"
                                />

                            </div>

                        </div>

                    </div>

                </div>



                {/* =====================================
                    RECENT ACTIVITY
                ====================================== */}

                <div className="mt-5 mb-4">

                    <h3 className="fw-bold mb-1">
                        🕒 Recent Activity
                    </h3>

                    <p className="text-muted">
                        Latest inventory activities
                    </p>

                </div>


                <RecentActivity />


            </div>



            {/* =====================================
                FOOTER
            ====================================== */}

            <footer
                className="text-center text-white mt-5 py-5"
                style={{
                    background:
                        "linear-gradient(90deg,#2563eb,#06b6d4)"
                }}
            >

                <h4 className="fw-bold">
                    💊 MediStock
                </h4>

                <p className="mb-2">
                    Smart Medical Inventory Management Platform
                </p>

                <small>
                    © 2026 | Medical Inventory Management System
                </small>

            </footer>

        </>

    );

}



/* =====================================
   DASHBOARD CARD
===================================== */

function DashboardCard({
    title,
    value,
    color,
    link,
    icon
}) {

    return (

        <div className="col-lg-3 col-md-6">

            <div
                className={`card border-${color} shadow-sm h-100`}
                style={{
                    borderRadius: "18px",
                    transition: "0.3s"
                }}
            >

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start">

                        <div>

                            <p className="text-muted mb-2">
                                {title}
                            </p>

                            <h1 className="fw-bold mb-2">
                                {value}
                            </h1>

                        </div>


                        <div
                            style={{
                                fontSize: "35px"
                            }}
                        >
                            {icon}
                        </div>

                    </div>


                    <Link
                        to={link}
                        className={`btn btn-${color} rounded-pill px-4 mt-2`}
                    >
                        View Details
                    </Link>

                </div>

            </div>

        </div>

    );

}



/* =====================================
   SUMMARY ROW
===================================== */

function SummaryRow({
    icon,
    title,
    value,
    textClass = ""
}) {

    return (

        <div
            className="d-flex justify-content-between align-items-center border-bottom py-3"
        >

            <div>

                <span className="me-2">
                    {icon}
                </span>

                <span className={textClass}>
                    {title}
                </span>

            </div>


            <strong
                className={`fs-5 ${textClass}`}
            >
                {value}
            </strong>

        </div>

    );

}


export default Dashboard;