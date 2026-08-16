import "../css/Notifications.css";

import { useEffect, useState } from "react";
import API from "../services/api";
function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [lowStock, setLowStock] = useState(0);
const [outOfStock, setOutOfStock] = useState(0);
const [expired, setExpired] = useState(0);
const [nearExpiry, setNearExpiry] = useState(0);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [date, setDate] = useState("");
    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
    loadNotifications();
    loadMedicineAlerts();
}, []);
    const loadNotifications = async () => {
        try {
            const response = await API.get("/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const loadMedicineAlerts = async () => {
    try {
        const low = await API.get("/medicines/lowstock");
        const out = await API.get("/medicines/outofstock");
        const exp = await API.get("/medicines/expired");
        const near = await API.get("/medicines/nearexpiry");
        setLowStock(low.data);
        setOutOfStock(out.data);
        setExpired(exp.data);
        setNearExpiry(near.data);
    } catch (error) {
        console.log(error);
    }
};
    const addNotification = async () => {
        try {
            if (editingId === null) {
                await API.post("/notifications", {
                    title,
                    message,
                    date
                });
                alert("Notification Added Successfully");
            } else {
                await API.put(`/notifications/${editingId}`, {
                    title,
                    message,
                    date
                });
                alert("Notification Updated Successfully");
                setEditingId(null);
            }
            setTitle("");
            setMessage("");
            setDate("");
            loadNotifications();
        } catch (error) {
            console.log(error);
            alert("Operation Failed");
        }
    };
    const editNotification = (notification) => {
        setEditingId(notification.id);
        setTitle(notification.title);
        setMessage(notification.message);
        setDate(notification.date);
    };
    const deleteNotification = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this notification?"
        );
        if (!confirmDelete) return;
        try {
            await API.delete(`/notifications/${id}`);
            alert("Notification Deleted Successfully");
            loadNotifications();
        } catch (error) {
            console.log(error);
            alert("Delete Failed");
        }
    };
    return (
        <div className="notifications-page">
<div className="container mt-4">
            <h2 className="page-title">
    🔔 Notifications
</h2>
<p className="page-subtitle">
    Manage system notifications and alerts
</p>
            <div className="card shadow border-0 rounded-4 p-4 mb-4">
                <h4 className="mb-4">
    {editingId === null
        ? "🔔 Add Notification"
        : "✏ Update Notification"}
</h4>
<div className="row mb-4">
    <div className="col-md-3">
        <div className="stats-card bg-warning">
            <h5>Low Stock</h5>
            <h2>{lowStock}</h2>
        </div>
    </div>
    <div className="col-md-3">
        <div className="stats-card bg-danger">
            <h5>Out Of Stock</h5>
            <h2>{outOfStock}</h2>
        </div>
    </div>
    <div className="col-md-3">
        <div className="stats-card bg-info">
            <h5>Near Expiry</h5>
            <h2>{nearExpiry}</h2>
        </div>
    </div>
    <div className="col-md-3">
        <div className="stats-card bg-dark">
            <h5>Expired</h5>
            <h2>{expired}</h2>
        </div>
    </div>
</div>
                <input
                    className="form-control mb-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="form-control mb-2"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <input
                    className="form-control mb-3"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button
                    className="btn btn-success w-100"
                    onClick={addNotification}
                >
                    {editingId === null ? "Add Notification" : "Update Notification"}
                </button>
            </div>
            <div className="table-card">
<table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        notifications.map((notification) => (
                            <tr key={notification.id}>
                                <td>{notification.id}</td>
                               <td>
    <span className="badge bg-primary px-3 py-2">
        {notification.title}
    </span>
</td>
<td>{notification.message}</td>
                                <td>{notification.date}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editNotification(notification)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteNotification(notification.id)}
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
export default Notifications;