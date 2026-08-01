import "../css/StockLogs.css";

import { useEffect, useState } from "react";
import API from "../services/api";

function StockLogs() {

    const [stockLogs, setStockLogs] = useState([]);

    const [action, setAction] = useState("");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [medicineId, setMedicineId] = useState("");

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadStockLogs();
    }, []);

    const loadStockLogs = async () => {

        try {

            const response = await API.get("/stocklogs");

            setStockLogs(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const saveStockLog = async () => {

        const stockLog = {

            action,
            quantity,
            date,

            medicine: {
                id: medicineId
            }

        };

        try {

            if (editingId === null) {

                await API.post("/stocklogs", stockLog);

                alert("Stock Log Added Successfully");

            } else {

                await API.put(`/stocklogs/${editingId}`, stockLog);

                alert("Stock Log Updated Successfully");

            }

            clearForm();

            loadStockLogs();

        } catch (error) {

            console.log(error);

        }

    };

    const editStockLog = (log) => {

        setEditingId(log.id);

        setAction(log.action);

        setQuantity(log.quantity);

        setDate(log.date);

        setMedicineId(log.medicine?.id);

    };

    const deleteStockLog = async (id) => {

        if (window.confirm("Delete this Stock Log?")) {

            await API.delete(`/stocklogs/${id}`);

            alert("Deleted Successfully");

            loadStockLogs();

        }

    };

    const clearForm = () => {

        setEditingId(null);

        setAction("");

        setQuantity("");

        setDate("");

        setMedicineId("");

    };

    return (

        <div className="stocklogs-page">

<div className="container mt-4">

           <h2 className="page-title">
    📦 Stock Logs
</h2>

<p className="page-subtitle">
    Track medicine stock movements
</p>

<div className="row mb-4">

    <div className="col-md-4">

        <div className="stats-card bg-primary">

            <h5>Total Logs</h5>

            <h2>{stockLogs.length}</h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-success">

            <h5>Stock In</h5>

            <h2>
                {
                    stockLogs.filter(log => log.action === "IN").length
                }
            </h2>

        </div>

    </div>

    <div className="col-md-4">

        <div className="stats-card bg-danger">

            <h5>Stock Out</h5>

            <h2>
                {
                    stockLogs.filter(log => log.action === "OUT").length
                }
            </h2>

        </div>

    </div>

</div>

            <div className="card shadow border-0 rounded-4 p-4 mb-4">

    <h4 className="mb-4">
        {editingId === null ? "➕ Add Stock Log" : "✏ Update Stock Log"}
    </h4>

    <input
        className="form-control mb-2"
        placeholder="Action"
        value={action}
                    onChange={(e) => setAction(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Medicine ID"
                    type="number"
                    value={medicineId}
                    onChange={(e) => setMedicineId(e.target.value)}
                />

               <button
    className="btn btn-primary w-100"
    onClick={saveStockLog}
>

                    {editingId === null ? "Add Stock Log" : "Update Stock Log"}

                </button>

            </div>

            <div className="table-card">

<table className="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Action</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Medicine ID</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        stockLogs.map((log) => (

                            <tr key={log.id}>

                                <td>{log.id}</td>

                                <td>{log.action}</td>

                                <td>{log.quantity}</td>

                                <td>{log.date}</td>

                                <td>{log.medicine?.id}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editStockLog(log)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteStockLog(log.id)}
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

        </div>

        </div>

    );

}

export default StockLogs;