import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Analytics.css";

function Analytics() {

    const [analytics, setAnalytics] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalInventory: 0,
    lowStockMedicines: 0,
    expiringSoonMedicines: 0,
    expiredMedicines: 0
});
    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const response = await API.get("/reports/analytics");
            setAnalytics(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load analytics");
        }
    };

    return (
        <div className="analytics-page">
            <div className="container mt-4">

                <h2 className="page-title">📊 Analytics Dashboard</h2>
                <p className="page-subtitle">
                    Overview of MediStock Inventory
                </p>

                <div className="row">

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-primary">
                            <h5>Total Medicines</h5>
                            <h2>{analytics.totalMedicines}</h2>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-success">
                            <h5>Total Suppliers</h5>
                            <h2>{analytics.totalSuppliers}</h2>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-info">
                            <h5>Total Inventory</h5>
                            <h2>{analytics.totalInventory}</h2>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-warning">
                            <h5>Low Stock</h5>
                            <h2>{analytics.lowStockMedicines}</h2>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-secondary">
                            <h5>Expiring Soon</h5>
                            <h2>{analytics.expiringSoonMedicines}</h2>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="analytics-card bg-danger">
                            <h5>Expired</h5>
                            <h2>{analytics.expiredMedicines}</h2>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Analytics;