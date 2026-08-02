import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StockHistory.css";

function StockHistory() {

    const [stockLogs, setStockLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStockLogs();
    }, []);

    const fetchStockLogs = async () => {
        try {

            const response = await axios.get(
                "http://localhost:8080/stock-logs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStockLogs(response.data);

        } catch (error) {

            console.error("Error fetching stock history:", error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="stock-history-container">

            <h2>Stock History</h2>

            {loading ? (
                <p>Loading stock history...</p>
            ) : stockLogs.length === 0 ? (
                <p>No stock history found.</p>
            ) : (

                <div className="stock-history-table-container">

                    <table className="stock-history-table">

                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Medicine</th>
                                <th>Manufacturer</th>
                                <th>Supplier</th>
                                <th>Expiry Date</th>
                                <th>Old Quantity</th>
                                <th>Action</th>
                                <th>Changed Quantity</th>
                                <th>New Quantity</th>
                                <th>Updated By</th>
                                <th>Role</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>

                        <tbody>

                            {stockLogs.map((log) => (

                                <tr key={log.logId}>

                                    <td>
                                        {log.actionDate
                                            ? new Date(log.actionDate).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td>{log.medicineName}</td>

                                    <td>{log.manufacturer}</td>

                                    <td>{log.supplierName}</td>

                                    <td>{log.expiryDate}</td>

                                    <td>{log.oldQuantity ?? "-"}</td>

                                    <td>{log.action}</td>

                                    <td>{log.quantity}</td>

                                    <td>{log.newQuantity ?? "-"}</td>

                                    <td>{log.updatedBy}</td>

                                    <td>{log.role}</td>

                                    <td>{log.remarks}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default StockHistory;