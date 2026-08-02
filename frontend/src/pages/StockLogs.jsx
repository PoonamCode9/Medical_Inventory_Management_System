import { useEffect, useState } from "react";
import "../styles/StockLogs.css";

function StockLogs() {

    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/stock-logs", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch stock logs");
                }
                return response.json();
            })
            .then((data) => {
                setLogs(data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);


    return (
        <div className="stocklogs-container">

            <h2>Stock Logs</h2>
            <div className="stocklogs-filters">

                <input
                    type="text"
                    placeholder="Search Medicine..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="All">All Actions</option>
                    <option value="STOCK_IN">Stock In</option>
                    <option value="STOCK_OUT">Stock Out</option>
                </select>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Staff">Staff</option>
                </select>

            </div>

            <table className="stocklogs-table">

                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Medicine</th>
                        <th>Manufacturer</th>
                        <th>Expiry Date</th>
                        <th>Action</th>
                        <th>Quantity</th>
                        <th>Updated By</th>
                        <th>Role</th>
                        <th>Remarks</th>
                    </tr>
                </thead>

                <tbody>

                    {logs
                        .filter((log) => {
                            const searchText = search.toLowerCase();

                            const matchesSearch =
                                log.medicineName?.toLowerCase().includes(searchText);

                            const matchesAction =
                                actionFilter === "All" ||
                                log.action?.toUpperCase() === actionFilter;

                            const matchesRole =
                                roleFilter === "All" ||
                                log.role?.toLowerCase() === roleFilter.toLowerCase();

                            return matchesSearch && matchesAction && matchesRole;
                        })
                        .map((log) => (
                            <tr key={log.logId}>

                                <td>{log.actionDate}</td>

                                <td>{log.medicineName}</td>

                                <td>{log.manufacturer}</td>
                                <td>{log.expiryDate}</td>

                                <td>{log.action}</td>

                                <td>{log.quantity}</td>

                                <td>{log.updatedBy}</td>
                                <td>{log.role}</td>

                                <td>{log.remarks}</td>

                            </tr>
                        ))}

                </tbody>

            </table>

        </div>
    );
}

export default StockLogs;