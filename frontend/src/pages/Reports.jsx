import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styles/Reports.css";

function Reports() {

    const location = useLocation();

    const isAdmin = location.pathname === "/reports";

    const showPurchaseOrder = isAdmin;

    const downloadReport = async (url, fileName) => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080${url}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: "blob"
                }
            );


            const file = new Blob(
                [response.data],
                { type: "application/pdf" }
            );


            const fileURL = window.URL.createObjectURL(file);

            const link = document.createElement("a");

            link.href = fileURL;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();


        } catch (error) {

            console.error("Report download failed", error);

        }
    };


    return (
        <div className="reports-container">

            <h2>Reports</h2>

            <div className="reports-grid">

                <div className="report-card">
                    <h3>📄 Medicine Inventory Report</h3>
                    <p>View complete medicine inventory details</p>
                    <button onClick={() =>
                        downloadReport(
                            "/reports/medicine",
                            "Medicine_Inventory_Report.pdf"
                        )
                    }>
                        Download PDF
                    </button>
                </div>


                <div className="report-card">
                    <h3>⏰ Expiry Report</h3>
                    <p>Check expired and expiring medicines</p>
                    <button onClick={() =>
                        downloadReport(
                            "/reports/expiry",
                            "Medicine_Expiry_Report.pdf"
                        )
                    }>
                        Download PDF
                    </button>
                </div>


                <div className="report-card">
                    <h3>📦 Stock Report</h3>
                    <p>View current stock status</p>
                    <button onClick={() =>
                        downloadReport(
                            "/reports/stock",
                            "Stock_Report.pdf"
                        )
                    }>
                        Download PDF
                    </button>
                </div>


                <div className="report-card">
                    <h3>📊 Stock Transaction Report</h3>
                    <p>View stock in and stock out history</p>
                    <button onClick={() =>
                        downloadReport(
                            "/reports/stock-transactions",
                            "Stock_Transaction_Report.pdf"
                        )
                    }>
                        Download PDF
                    </button>
                </div>

                {showPurchaseOrder && (
                    <div className="report-card">
                        <h3>🛒 Purchase Order Report</h3>
                        <p>View purchase order details</p>
                        <button onClick={() =>
                            downloadReport(
                                "/reports/purchase-orders",
                                "Purchase_Order_Report.pdf"
                            )
                        }>
                            Download PDF
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Reports;