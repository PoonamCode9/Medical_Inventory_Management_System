import "../css/Reports.css";

import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {

    const [reports, setReports] = useState([]);

    const [reportName, setReportName] = useState("");
    const [reportType, setReportType] = useState("");
    const [generatedDate, setGeneratedDate] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [dashboard, setDashboard] = useState({});

const [inventoryReport, setInventoryReport] = useState([]);

const [lowStockReport, setLowStockReport] = useState([]);

const [expiryReport, setExpiryReport] = useState([]);

const [supplierReport, setSupplierReport] = useState([]);

const [purchaseReport, setPurchaseReport] = useState([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

    try {

        const reportsRes = await API.get("/reports");

        const dashboardRes = await API.get("/reports/dashboard");

        const inventoryRes = await API.get("/reports/inventory");

        const lowStockRes = await API.get("/reports/lowstock");

        const expiryRes = await API.get("/reports/expiry");

        const supplierRes = await API.get("/reports/suppliers");

        const purchaseRes = await API.get("/reports/purchaseorders");

        setReports(reportsRes.data);

        setDashboard(dashboardRes.data);

        setInventoryReport(inventoryRes.data);

        setLowStockReport(lowStockRes.data);

        setExpiryReport(expiryRes.data);

        setSupplierReport(supplierRes.data);

        setPurchaseReport(purchaseRes.data);

    }

    catch(error){

        console.log(error);

    }

};

    const addReport = async () => {

        try {

            if (editingId === null) {

                await API.post("/reports", {

                    reportName,
                    reportType,
                    generatedDate

                });

                alert("Report Added Successfully");

            } else {

                await API.put(`/reports/${editingId}`, {

                    reportName,
                    reportType,
                    generatedDate

                });

                alert("Report Updated Successfully");

                setEditingId(null);

            }

            setReportName("");
            setReportType("");
            setGeneratedDate("");

            loadReports();

        } catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };

    const editReport = (report) => {

        setEditingId(report.id);

        setReportName(report.reportName);
        setReportType(report.reportType);
        setGeneratedDate(report.generatedDate);

    };

    const deleteReport = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/reports/${id}`);

            alert("Report Deleted Successfully");

            loadReports();

        } catch (error) {

            console.log(error);

            alert("Delete Failed");

        }

    };

    return (

        <div className="reports-page">

<div className="container mt-4">

            <h2 className="page-title">
    📊 Reports
</h2>

<p className="page-subtitle">
    Generate and manage pharmacy reports
</p>

            <div className="card shadow border-0 rounded-4 p-4 mb-4">

               <h4 className="mb-4">
    {editingId === null
        ? "📊 Add Report"
        : "✏ Update Report"}
</h4>

<div className="row mb-4">

    <div className="col-md-4">

        <div className="stats-card bg-primary">

            <h5>Total Medicines</h5>

            <h2>{reports.length}</h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-success">

            <h5>Suppliers</h5>

            <h2>

                {

                    reports.filter(

                        report=>report.generatedDate===new Date().toISOString().split("T")[0]

                    ).length

                }

            </h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-warning">

            <h5>Notifications</h5>

            <h2>

                {

                    new Set(

                        reports.map(report=>report.reportType)

                    ).size

                }

            </h2>

        </div>

    </div>

</div>

                <input
                    className="form-control mb-2"
                    placeholder="Report Name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Report Type"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="date"
                    value={generatedDate}
                    onChange={(e) => setGeneratedDate(e.target.value)}
                />

                <button
                    className="btn btn-success w-100"
                    onClick={addReport}
                >
                    {editingId === null ? "Add Report" : "Update Report"}
                </button>

            </div>

            <div className="table-card">

<table className="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Report Name</th>
                        <th>Report Type</th>
                        <th>Generated Date</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        reports.map((report) => (

                            <tr key={report.id}>

                                <td>{report.id}</td>
                                <td>{report.reportName}</td>
                                <td>

    <span className="badge bg-primary px-3 py-2">

        {report.reportType}

    </span>

</td>
                                <td>{report.generatedDate}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editReport(report)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteReport(report.id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

            </div>

            <h3 className="mt-5">📦 Inventory Report</h3>

<table className="table table-bordered">

    <thead>

        <tr>

            <th>Medicine</th>

            <th>Category</th>

            <th>Quantity</th>

            <th>Supplier</th>

        </tr>

    </thead>

    <tbody>

        {

            inventoryReport.map((medicine)=>(

                <tr key={medicine.id}>

                    <td>{medicine.medicineName}</td>

                    <td>{medicine.category}</td>

                    <td>{medicine.quantity}</td>

                    <td>{medicine.supplier}</td>

                </tr>

            ))

        }

    </tbody>

</table>

<h3 className="mt-5">⚠ Low Stock Report</h3>

<table className="table table-bordered">

    <thead>

        <tr>

            <th>Medicine</th>

            <th>Quantity</th>

        </tr>

    </thead>

    <tbody>

        {

            lowStockReport.map((medicine)=>(

                <tr key={medicine.id}>

                    <td>{medicine.medicineName}</td>

                    <td>{medicine.quantity}</td>

                </tr>

            ))

        }

    </tbody>

</table>

<h3 className="mt-5">⏰ Expiry Report</h3>

<table className="table table-bordered">

    <thead>

        <tr>

            <th>Medicine</th>

            <th>Expiry Date</th>

            <th>Status</th>

        </tr>

    </thead>

    <tbody>

        {

            expiryReport.map((item)=>(

                <tr key={item.id}>

                    <td>{item.medicine?.medicineName}</td>

                    <td>{item.expiryDate}</td>

                    <td>{item.status}</td>

                </tr>

            ))

        }

    </tbody>

</table>

<h3 className="mt-5">🚚 Supplier Report</h3>

<table className="table table-bordered">

    <thead>

        <tr>

            <th>Supplier</th>

            <th>Phone</th>

            <th>Email</th>

        </tr>

    </thead>

    <tbody>

        {

            supplierReport.map((supplier)=>(

                <tr key={supplier.id}>

                    <td>{supplier.supplierName}</td>

                    <td>{supplier.contactNumber}</td>

                    <td>{supplier.email}</td>

                </tr>

            ))

        }

    </tbody>

</table>

<h3 className="mt-5">🧾 Purchase Orders</h3>

<table className="table table-bordered">

    <thead>

        <tr>

            <th>Supplier</th>

            <th>Medicine</th>

            <th>Quantity</th>

            <th>Amount</th>

        </tr>

    </thead>

    <tbody>

        {

            purchaseReport.map((order)=>(

                <tr key={order.id}>

                    <td>{order.supplier?.supplierName}</td>

                    <td>{order.medicine?.medicineName}</td>

                    <td>{order.quantity}</td>

                    <td>{order.totalAmount}</td>

                </tr>

            ))

        }

    </tbody>

</table>
            
            </div>

        </div>

    );

}

export default Reports;