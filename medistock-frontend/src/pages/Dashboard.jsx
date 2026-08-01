import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { getMedicines } from "../services/medicineService";
import { getSuppliers } from "../services/supplierService";

function Dashboard() {

    const [medicineCount, setMedicineCount] = useState(0);
    const [supplierCount, setSupplierCount] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {

            const medicineRes = await getMedicines();
            const supplierRes = await getSuppliers();

            const medicines = medicineRes.data;
            const suppliers = supplierRes.data;

            setMedicineCount(medicines.length);
            setSupplierCount(suppliers.length);

            const lowStock = medicines.filter(
                (m) => m.quantity < 10
            );
            setLowStockCount(lowStock.length);

            const today = new Date();

            const expired = medicines.filter(
                (m) => new Date(m.expiryDate) < today
            );

            setExpiredCount(expired.length);

        } catch (error) {
            console.error("Error loading dashboard", error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2>MediStock Dashboard</h2>

                <hr />

                <div className="row">

                    {/* Total Medicines */}
                    <div className="col-md-3 mb-3">
                        <div className="card shadow text-center p-3">
                            <h5>Total Medicines</h5>
                            <h1>{medicineCount}</h1>

                            <Link to="/medicines">
                                <button className="btn btn-primary">
                                    View Medicines
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Total Suppliers */}
                    <div className="col-md-3 mb-3">
                        <div className="card shadow text-center p-3">
                            <h5>Total Suppliers</h5>
                            <h1>{supplierCount}</h1>

                            <Link to="/suppliers">
                                <button className="btn btn-success">
                                    View Suppliers
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="col-md-3 mb-3">
                        <div className="card shadow text-center p-3">
                            <h5>Low Stock</h5>
                            <h1>{lowStockCount}</h1>

                            <Link to="/medicines">
                                <button className="btn btn-warning">
                                    View Medicines
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Expired Medicines */}
                    <div className="col-md-3 mb-3">
                        <div className="card shadow text-center p-3">
                            <h5>Expired Medicines</h5>
                            <h1>{expiredCount}</h1>

                            <Link to="/medicines">
                                <button className="btn btn-danger">
                                    View Medicines
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;