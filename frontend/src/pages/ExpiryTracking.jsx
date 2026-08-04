import "../css/ExpiryTracking.css";
import { useEffect, useState } from "react";
import API from "../services/api";
function ExpiryTracking() {
    const [records, setRecords] = useState([]);
    const [medicineId, setMedicineId] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("");
    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
        loadRecords();
    }, []);
    const loadRecords = async () => {
        try {
            const response = await API.get("/expirytracking");
            setRecords(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const addRecord = async () => {
        try {
            if (editingId === null) {
                await API.post("/expirytracking", {
                    medicine: {
                        id: medicineId
                    },
                    expiryDate,
                    status
                });
                alert("Expiry Record Added Successfully");
            } else {
                await API.put(`/expirytracking/${editingId}`, {
                    medicine: {
                        id: medicineId
                    },
                    expiryDate,
                    status
                });
                alert("Expiry Record Updated Successfully");
                setEditingId(null);
            }
            setMedicineId("");
            setExpiryDate("");
            setStatus("");
            loadRecords();
        } catch (error) {
            console.log(error);
            alert("Operation Failed");
        }
    };
    const editRecord = (record) => {
        setEditingId(record.id);
        setMedicineId(record.medicine.id);
        setExpiryDate(record.expiryDate);
        setStatus(record.status);
    };
    const deleteRecord = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this record?"
        );
        if (!confirmDelete) return;
        try {
            await API.delete(`/expirytracking/${id}`);
            alert("Expiry Record Deleted Successfully");
            loadRecords();
        } catch (error) {
            console.log(error);
            alert("Delete Failed");
        }
    };
    return (
        <div className="expiry-page">
<div className="container mt-4">
            <h2 className="page-title">
    ⏰ Expiry Tracking
</h2>
<p className="page-subtitle">
    Monitor medicine expiry dates
</p>
            <div className="card shadow border-0 rounded-4 p-4 mb-4">

                <h4 className="mb-4">
    {editingId === null
        ? "⏰ Add Expiry Record"
        : "✏ Update Expiry Record"}
</h4>
<div className="row mb-4">
    <div className="col-md-4">
        <div className="stats-card bg-primary">
            <h5>Total Records</h5>
            <h2>{records.length}</h2>
        </div>
    </div>
    <div className="col-md-4">
        <div className="stats-card bg-warning">
            <h5>Expiring Soon</h5>
            <h2>
                {
                    records.filter(
                        record => record.status === "Expiring Soon"
                    ).length
                }
            </h2>
        </div>
    </div>
    <div className="col-md-4">
        <div className="stats-card bg-danger">
            <h5>Expired</h5>
            <h2>
                {
                    records.filter(
                        record => record.status === "Expired"
                    ).length

                }
            </h2>
        </div>
    </div>
</div>
                <input
                    className="form-control mb-2"
                    placeholder="Medicine ID"
                    value={medicineId}
                    onChange={(e) => setMedicineId(e.target.value)}
                />
                <input
                    className="form-control mb-2"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />
                <button
                    className="btn btn-success w-100"
                    onClick={addRecord}
                >
                    {editingId === null ? "Add Record" : "Update Record"}
                </button>
            </div>
            <div className="table-card">
<table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Medicine</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map((record) => (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>{record.medicine?.medicineName}</td>
                                <td>{record.expiryDate}</td>
                                <td>
    {record.status === "Safe" && (
        <span className="badge bg-success">
            Safe
        </span>
    )}
    {record.status === "Expiring Soon" && (
        <span className="badge bg-warning text-dark">
            Expiring Soon
        </span>
    )}
    {record.status === "Expired" && (
        <span className="badge bg-danger">
            Expired
        </span>
    )}
</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editRecord(record)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteRecord(record.id)}
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
export default ExpiryTracking;