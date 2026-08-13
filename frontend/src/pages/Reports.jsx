import "../css/Reports.css";

import { useEffect, useState } from "react";
import API from "../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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

    const [generatedReport, setGeneratedReport] = useState(null);


    // =========================
    // LOAD ALL REPORT DATA
    // =========================

    useEffect(() => {
        loadReports();
    }, []);


    const loadReports = async () => {

        try {

            const reportsRes =
                await API.get("/reports");

            const dashboardRes =
                await API.get("/reports/dashboard");

            const inventoryRes =
                await API.get("/reports/inventory");

            const lowStockRes =
                await API.get("/reports/lowstock");

            const expiryRes =
                await API.get("/reports/expiry");

            const supplierRes =
                await API.get("/reports/suppliers");

            const purchaseRes =
                await API.get("/reports/purchaseorders");

            const generatedRes =
                await API.get("/reports/generate");


            setReports(reportsRes.data);

            setDashboard(dashboardRes.data);

            setInventoryReport(inventoryRes.data);

            setLowStockReport(lowStockRes.data);

            setExpiryReport(expiryRes.data);

            setSupplierReport(supplierRes.data);

            setPurchaseReport(purchaseRes.data);

            setGeneratedReport(generatedRes.data);

        }
        catch (error) {

            console.log("Error loading reports:", error);

        }

    };


    // =========================
    // ADD / UPDATE REPORT
    // =========================

    const addReport = async () => {

        try {

            if (editingId === null) {

                await API.post("/reports", {

                    reportName,
                    reportType,
                    generatedDate

                });

                alert("Report Added Successfully");

            }
            else {

                await API.put(
                    `/reports/${editingId}`,
                    {

                        reportName,
                        reportType,
                        generatedDate

                    }
                );

                alert("Report Updated Successfully");

                setEditingId(null);

            }


            setReportName("");

            setReportType("");

            setGeneratedDate("");

            loadReports();

        }
        catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };


    // =========================
    // EDIT REPORT
    // =========================

    const editReport = (report) => {

        setEditingId(report.id);

        setReportName(report.reportName);

        setReportType(report.reportType);

        setGeneratedDate(report.generatedDate);

    };


    // =========================
    // DELETE REPORT
    // =========================

    const deleteReport = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this report?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await API.delete(`/reports/${id}`);

            alert("Report Deleted Successfully");

            loadReports();

        }
        catch (error) {

            console.log(error);

            alert("Delete Failed");

        }

    };


    // =====================================================
    // DOWNLOAD PDF REPORT
    // =====================================================

    const downloadPDF = () => {

        try {

            const doc = new jsPDF();


            // TITLE
            doc.setFontSize(18);

            doc.text(
                "MediStock - Reports",
                14,
                20
            );


            doc.setFontSize(10);

            doc.text(
                `Generated on: ${new Date().toLocaleDateString()}`,
                14,
                28
            );


            let y = 38;


            // =========================
            // INVENTORY
            // =========================

            doc.setFontSize(14);

            doc.text(
                "Inventory Report",
                14,
                y
            );


            autoTable(doc, {

                startY: y + 5,

                head: [
                    [
                        "Medicine",
                        "Category",
                        "Quantity",
                        "Supplier"
                    ]
                ],

                body: inventoryReport.map(
                    (medicine) => [

                        medicine.medicineName || "",

                        medicine.category || "",

                        medicine.quantity ?? "",

                        medicine.supplier || ""

                    ]
                )

            });


            y =
                doc.lastAutoTable.finalY + 15;


            // =========================
            // LOW STOCK
            // =========================

            doc.setFontSize(14);

            doc.text(
                "Low Stock Report",
                14,
                y
            );


            autoTable(doc, {

                startY: y + 5,

                head: [
                    [
                        "Medicine",
                        "Quantity"
                    ]
                ],

                body: lowStockReport.map(
                    (medicine) => [

                        medicine.medicineName || "",

                        medicine.quantity ?? ""

                    ]
                )

            });


            y =
                doc.lastAutoTable.finalY + 15;


            // =========================
            // EXPIRY
            // =========================

            doc.setFontSize(14);

            doc.text(
                "Expiry Report",
                14,
                y
            );


            autoTable(doc, {

                startY: y + 5,

                head: [
                    [
                        "Medicine",
                        "Expiry Date",
                        "Status"
                    ]
                ],

                body: expiryReport.map(
                    (item) => [

                        item.medicine?.medicineName || "",

                        item.expiryDate || "",

                        item.status || ""

                    ]
                )

            });


            y =
                doc.lastAutoTable.finalY + 15;


            // =========================
            // SUPPLIERS
            // =========================

            doc.setFontSize(14);

            doc.text(
                "Supplier Report",
                14,
                y
            );


            autoTable(doc, {

                startY: y + 5,

                head: [
                    [
                        "Supplier",
                        "Phone",
                        "Email"
                    ]
                ],

                body: supplierReport.map(
                    (supplier) => [

                        supplier.supplierName || "",

                        supplier.contactNumber || "",

                        supplier.email || ""

                    ]
                )

            });


            y =
                doc.lastAutoTable.finalY + 15;


            // =========================
            // PURCHASE ORDERS
            // =========================

            doc.setFontSize(14);

            doc.text(
                "Purchase Order Report",
                14,
                y
            );


            autoTable(doc, {

                startY: y + 5,

                head: [
                    [
                        "Supplier",
                        "Medicine",
                        "Quantity",
                        "Amount"
                    ]
                ],

                body: purchaseReport.map(
                    (order) => [

                        order.supplier?.supplierName || "",

                        order.medicine?.medicineName || "",

                        order.quantity ?? "",

                        order.totalAmount ?? ""

                    ]
                )

            });


            // =========================
            // GENERATED REPORT
            // =========================

            if (generatedReport) {

                y =
                    doc.lastAutoTable.finalY + 15;


                doc.setFontSize(14);

                doc.text(
                    "Generated Report Summary",
                    14,
                    y
                );


                autoTable(doc, {

                    startY: y + 5,

                    head: [
                        [
                            "Metric",
                            "Value"
                        ]
                    ],

                    body: [

                        [
                            "Report Date",
                            generatedReport.reportDate || ""
                        ],

                        [
                            "Total Medicines",
                            generatedReport.totalMedicines ?? ""
                        ],

                        [
                            "Total Suppliers",
                            generatedReport.totalSuppliers ?? ""
                        ],

                        [
                            "Total Inventory",
                            generatedReport.totalInventory ?? ""
                        ],

                        [
                            "Low Stock",
                            generatedReport.lowStock ?? ""
                        ],

                        [
                            "Expiring Soon",
                            generatedReport.expiringSoon ?? ""
                        ],

                        [
                            "Expired",
                            generatedReport.expired ?? ""
                        ]

                    ]

                });


                y =
                    doc.lastAutoTable.finalY + 10;


                doc.setFontSize(11);

                doc.text(
                    "Summary:",
                    14,
                    y
                );


                const summaryLines =
                    doc.splitTextToSize(
                        generatedReport.summary || "",
                        180
                    );


                doc.text(
                    summaryLines,
                    14,
                    y + 7
                );

            }


            doc.save(
                "MediStock-Reports.pdf"
            );


            alert(
                "PDF Report Downloaded Successfully"
            );

        }
        catch (error) {

            console.log(
                "PDF Error:",
                error
            );

            alert(
                "Failed to generate PDF"
            );

        }

    };


    // =====================================================
    // DOWNLOAD EXCEL REPORT
    // =====================================================

    const downloadExcelReport = () => {

        try {

            const workbook =
                XLSX.utils.book_new();


            // =========================
            // INVENTORY SHEET
            // =========================

            const inventoryData =
                inventoryReport.map(
                    (medicine) => ({

                        Medicine:
                            medicine.medicineName || "",

                        Category:
                            medicine.category || "",

                        Quantity:
                            medicine.quantity ?? "",

                        Supplier:
                            medicine.supplier || ""

                    })
                );


            const inventorySheet =
                XLSX.utils.json_to_sheet(
                    inventoryData
                );


            XLSX.utils.book_append_sheet(
                workbook,
                inventorySheet,
                "Inventory"
            );


            // =========================
            // LOW STOCK SHEET
            // =========================

            const lowStockData =
                lowStockReport.map(
                    (medicine) => ({

                        Medicine:
                            medicine.medicineName || "",

                        Quantity:
                            medicine.quantity ?? ""

                    })
                );


            const lowStockSheet =
                XLSX.utils.json_to_sheet(
                    lowStockData
                );


            XLSX.utils.book_append_sheet(
                workbook,
                lowStockSheet,
                "Low Stock"
            );


            // =========================
            // EXPIRY SHEET
            // =========================

            const expiryData =
                expiryReport.map(
                    (item) => ({

                        Medicine:
                            item.medicine?.medicineName || "",

                        ExpiryDate:
                            item.expiryDate || "",

                        Status:
                            item.status || ""

                    })
                );


            const expirySheet =
                XLSX.utils.json_to_sheet(
                    expiryData
                );


            XLSX.utils.book_append_sheet(
                workbook,
                expirySheet,
                "Expiry"
            );


            // =========================
            // SUPPLIER SHEET
            // =========================

            const supplierData =
                supplierReport.map(
                    (supplier) => ({

                        Supplier:
                            supplier.supplierName || "",

                        Phone:
                            supplier.contactNumber || "",

                        Email:
                            supplier.email || ""

                    })
                );


            const supplierSheet =
                XLSX.utils.json_to_sheet(
                    supplierData
                );


            XLSX.utils.book_append_sheet(
                workbook,
                supplierSheet,
                "Suppliers"
            );


            // =========================
            // PURCHASE HISTORY SHEET
            // =========================

            const purchaseData =
                purchaseReport.map(
                    (order) => ({

                        Supplier:
                            order.supplier?.supplierName || "",

                        Medicine:
                            order.medicine?.medicineName || "",

                        Quantity:
                            order.quantity ?? "",

                        Amount:
                            order.totalAmount ?? ""

                    })
                );


            const purchaseSheet =
                XLSX.utils.json_to_sheet(
                    purchaseData
                );


            XLSX.utils.book_append_sheet(
                workbook,
                purchaseSheet,
                "Purchase History"
            );


            // =========================
            // GENERATED REPORT SHEET
            // =========================

            if (generatedReport) {

                const generatedData = [

                    {
                        Metric: "Report Date",
                        Value:
                            generatedReport.reportDate || ""
                    },

                    {
                        Metric: "Total Medicines",
                        Value:
                            generatedReport.totalMedicines ?? ""
                    },

                    {
                        Metric: "Total Suppliers",
                        Value:
                            generatedReport.totalSuppliers ?? ""
                    },

                    {
                        Metric: "Total Inventory",
                        Value:
                            generatedReport.totalInventory ?? ""
                    },

                    {
                        Metric: "Low Stock",
                        Value:
                            generatedReport.lowStock ?? ""
                    },

                    {
                        Metric: "Expiring Soon",
                        Value:
                            generatedReport.expiringSoon ?? ""
                    },

                    {
                        Metric: "Expired",
                        Value:
                            generatedReport.expired ?? ""
                    },

                    {
                        Metric: "Summary",
                        Value:
                            generatedReport.summary || ""
                    }

                ];


                const generatedSheet =
                    XLSX.utils.json_to_sheet(
                        generatedData
                    );


                XLSX.utils.book_append_sheet(
                    workbook,
                    generatedSheet,
                    "Summary"
                );

            }


            // =========================
            // DOWNLOAD
            // =========================

            XLSX.writeFile(
                workbook,
                "MediStock_Report.xlsx"
            );


            alert(
                "Excel Report Downloaded Successfully"
            );

        }
        catch (error) {

            console.log(
                "Excel Error:",
                error
            );

            alert(
                "Failed to generate Excel Report"
            );

        }

    };


    // =====================================================
    // EXPORT STOCK DATA
    // =====================================================

    const exportStockData = async () => {

        try {

            const response =
                await API.get("/stocklogs");


            const stockData =
                response.data.map(
                    (log) => ({

                        ID:
                            log.id,

                        Action:
                            log.action || "",

                        Quantity:
                            log.quantity ?? "",

                        Date:
                            log.date || "",

                        Medicine:
                            log.medicine?.medicineName || "",

                        MedicineID:
                            log.medicine?.id || ""

                    })
                );


            const worksheet =
                XLSX.utils.json_to_sheet(
                    stockData
                );


            const workbook =
                XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Stock Data"
            );


            XLSX.writeFile(
                workbook,
                "MediStock_Stock_Data.xlsx"
            );


            alert(
                "Stock Data Exported Successfully"
            );

        }
        catch (error) {

            console.log(
                "Stock Export Error:",
                error
            );

            alert(
                "Failed to Export Stock Data"
            );

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="reports-page">

            <div className="container mt-4">

                <h2 className="page-title">
                    📊 Reports
                </h2>

                <p className="page-subtitle">
                    Generate and manage pharmacy reports
                </p>


                {/* =====================================
                    EXPORT BUTTONS - TOP
                ===================================== */}

                <div className="card shadow border-0 rounded-4 p-4 mb-4">

                    <h4 className="mb-3">
                        📥 Data Export
                    </h4>

                    <p className="text-muted">
                        Download MediStock reports and stock data
                        for offline use.
                    </p>


                    <div className="d-flex gap-3 flex-wrap">

                        <button
                            className="btn btn-danger"
                            onClick={downloadPDF}
                        >
                            📄 Download Reports PDF
                        </button>


                        <button
                            className="btn btn-success"
                            onClick={downloadExcelReport}
                        >
                            📊 Download Excel Report
                        </button>


                        <button
                            className="btn btn-primary"
                            onClick={exportStockData}
                        >
                            📦 Export Stock Data
                        </button>

                    </div>

                </div>


                {/* =====================================
                    ADD / UPDATE REPORT
                ===================================== */}

                <div className="card shadow border-0 rounded-4 p-4 mb-4">

                    <h4 className="mb-4">

                        {editingId === null
                            ? "📊 Add Report"
                            : "✏ Update Report"}

                    </h4>


                    <div className="row mb-4">


                        <div className="col-md-4">

                            <div className="stats-card bg-primary">

                                <h5>
                                    Total Medicines
                                </h5>

                                <h2>
                                    {reports.length}
                                </h2>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="stats-card bg-success">

                                <h5>
                                    Suppliers
                                </h5>

                                <h2>
                                    {supplierReport.length}
                                </h2>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="stats-card bg-warning">

                                <h5>
                                    Notifications
                                </h5>

                                <h2>
                                    {
                                        new Set(
                                            reports.map(
                                                report =>
                                                    report.reportType
                                            )
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
                        onChange={
                            (e) =>
                                setReportName(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        className="form-control mb-2"
                        placeholder="Report Type"
                        value={reportType}
                        onChange={
                            (e) =>
                                setReportType(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        className="form-control mb-3"
                        type="date"
                        value={generatedDate}
                        onChange={
                            (e) =>
                                setGeneratedDate(
                                    e.target.value
                                )
                        }
                    />


                    <button
                        className="btn btn-success w-100"
                        onClick={addReport}
                    >
                        {editingId === null
                            ? "Add Report"
                            : "Update Report"}
                    </button>

                </div>


                {/* =====================================
                    REPORT LIST
                ===================================== */}

                <div className="table-card">

                    <table className="table table-hover align-middle">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>
                                    Report Name
                                </th>

                                <th>
                                    Report Type
                                </th>

                                <th>
                                    Generated Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {
                                reports.map(
                                    (report) => (

                                        <tr
                                            key={report.id}
                                        >

                                            <td>
                                                {report.id}
                                            </td>

                                            <td>
                                                {report.reportName}
                                            </td>

                                            <td>

                                                <span className="badge bg-primary px-3 py-2">

                                                    {report.reportType}

                                                </span>

                                            </td>

                                            <td>
                                                {report.generatedDate}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={
                                                        () =>
                                                            editReport(
                                                                report
                                                            )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={
                                                        () =>
                                                            deleteReport(
                                                                report.id
                                                            )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>


                {/* =====================================
                    INVENTORY REPORT
                ===================================== */}

                <h3 className="mt-5">
                    📦 Inventory Report
                </h3>


                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Medicine
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Supplier
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            inventoryReport.map(
                                (medicine) => (

                                    <tr
                                        key={
                                            medicine.id
                                        }
                                    >

                                        <td>
                                            {
                                                medicine.medicineName
                                            }
                                        </td>

                                        <td>
                                            {
                                                medicine.category
                                            }
                                        </td>

                                        <td>
                                            {
                                                medicine.quantity
                                            }
                                        </td>

                                        <td>
                                            {
                                                medicine.supplier
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>


                {/* =====================================
                    LOW STOCK
                ===================================== */}

                <h3 className="mt-5">
                    ⚠ Low Stock Report
                </h3>


                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Medicine
                            </th>

                            <th>
                                Quantity
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            lowStockReport.map(
                                (medicine) => (

                                    <tr
                                        key={
                                            medicine.id
                                        }
                                    >

                                        <td>
                                            {
                                                medicine.medicineName
                                            }
                                        </td>

                                        <td>
                                            {
                                                medicine.quantity
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>


                {/* =====================================
                    EXPIRY
                ===================================== */}

                <h3 className="mt-5">
                    ⏰ Expiry Report
                </h3>


                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Medicine
                            </th>

                            <th>
                                Expiry Date
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            expiryReport.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                    >

                                        <td>
                                            {
                                                item.medicine
                                                    ?.medicineName
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.expiryDate
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.status
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>


                {/* =====================================
                    SUPPLIER
                ===================================== */}

                <h3 className="mt-5">
                    🚚 Supplier Report
                </h3>


                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Supplier
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Email
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            supplierReport.map(
                                (supplier) => (

                                    <tr
                                        key={
                                            supplier.id
                                        }
                                    >

                                        <td>
                                            {
                                                supplier.supplierName
                                            }
                                        </td>

                                        <td>
                                            {
                                                supplier.contactNumber
                                            }
                                        </td>

                                        <td>
                                            {
                                                supplier.email
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>


                {/* =====================================
                    PURCHASE ORDERS
                ===================================== */}

                <h3 className="mt-5">
                    🧾 Purchase Orders
                </h3>


                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Supplier
                            </th>

                            <th>
                                Medicine
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            purchaseReport.map(
                                (order) => (

                                    <tr
                                        key={
                                            order.id
                                        }
                                    >

                                        <td>
                                            {
                                                order.supplier
                                                    ?.supplierName
                                            }
                                        </td>

                                        <td>
                                            {
                                                order.medicine
                                                    ?.medicineName
                                            }
                                        </td>

                                        <td>
                                            {
                                                order.quantity
                                            }
                                        </td>

                                        <td>
                                            {
                                                order.totalAmount
                                            }
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>


                {/* =====================================
                    GENERATED REPORT
                ===================================== */}

                <h3 className="mt-5">
                    📄 Generated Report
                </h3>


                {
                    generatedReport && (

                        <div className="card shadow p-4 mb-5">

                            <p>
                                <strong>
                                    Report Date:
                                </strong>{" "}
                                {
                                    generatedReport.reportDate
                                }
                            </p>


                            <p>
                                <strong>
                                    Total Medicines:
                                </strong>{" "}
                                {
                                    generatedReport.totalMedicines
                                }
                            </p>


                            <p>
                                <strong>
                                    Total Suppliers:
                                </strong>{" "}
                                {
                                    generatedReport.totalSuppliers
                                }
                            </p>


                            <p>
                                <strong>
                                    Total Inventory:
                                </strong>{" "}
                                {
                                    generatedReport.totalInventory
                                }
                            </p>


                            <p>
                                <strong>
                                    Low Stock:
                                </strong>{" "}
                                {
                                    generatedReport.lowStock
                                }
                            </p>


                            <p>
                                <strong>
                                    Expiring Soon:
                                </strong>{" "}
                                {
                                    generatedReport.expiringSoon
                                }
                            </p>


                            <p>
                                <strong>
                                    Expired:
                                </strong>{" "}
                                {
                                    generatedReport.expired
                                }
                            </p>


                            <hr />


                            <h5>
                                Summary
                            </h5>


                            <p>
                                {
                                    generatedReport.summary
                                }
                            </p>

                        </div>

                    )
                }


                {/* =====================================
                    BOTTOM DATA EXPORT
                ===================================== */}

                <div className="card shadow border-0 rounded-4 p-4 mt-4 mb-5">

                    <h3 className="mb-3">
                        📥 Data Export
                    </h3>


                    <p className="text-muted">
                        Download MediStock reports and
                        stock data for offline use.
                    </p>


                    <div className="d-flex gap-3 flex-wrap">

                        <button
                            className="btn btn-danger"
                            onClick={downloadPDF}
                        >
                            📄 Download Reports PDF
                        </button>


                        <button
                            className="btn btn-success"
                            onClick={downloadExcelReport}
                        >
                            📊 Download Excel Report
                        </button>


                        <button
                            className="btn btn-primary"
                            onClick={exportStockData}
                        >
                            📦 Export Stock Data
                        </button>

                    </div>

                </div>


            </div>

        </div>

    );

}


export default Reports;