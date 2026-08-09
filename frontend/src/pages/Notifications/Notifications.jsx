import { useEffect, useState } from "react";
import "../Medicines/Medicines.css";
import "./Notifications.css";
import { FaTrash, FaEnvelopeOpen } from "react-icons/fa";

import {
    getNotifications,
    markAsRead,
    deleteNotification
} from "../../services/notificationService";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const token = localStorage.getItem("token");

    const loadNotifications = async () => {

        try {

            const response = await getNotifications(token);

            setNotifications(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadNotifications();

    }, []);

    const handleRead = async (id) => {

        await markAsRead(id, token);

        loadNotifications();

    };

    const handleDelete = async (id) => {

        await deleteNotification(id, token);

        loadNotifications();

    };

    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    const lowStock = notifications.filter(
        n => n.notificationType === "LOW_STOCK"
    ).length;

    const expiry = notifications.filter(
        n => n.notificationType === "EXPIRY"
    ).length;

    return (
 <div className="notification-page">
        <div className="medicine-page">

            <div className="notification-content">

                {/* Header */}

                <div className="medicine-header">

                    <div>

                        <h1>🔔 Notifications Dashboard</h1>

                        <p>Manage system alerts efficiently</p>

                    </div>

                </div>

                {/* Dashboard Cards */}

                <div className="dashboard-cards">

                    <div className="dashboard-card total">

                        <div className="card-icon">🔔</div>

                        <h5>Total Notifications</h5>

                        <h2>{notifications.length}</h2>

                    </div>

                    <div className="dashboard-card low">

                       <div className="card-icon">⚠️</div>

                        <h5>Unread</h5>

                        <h2>{unread}</h2>

                    </div>

                    <div className="dashboard-card supplier">

                       <div className="card-icon">✔️</div>

                        <h5>Read</h5>

                        <h2>{read}</h2>

                    </div>

                    <div className="dashboard-card low">

                       <div className="card-icon">❌</div>

                        <h5>Low Stock</h5>

                        <h2>{lowStock}</h2>

                    </div>

                    <div className="dashboard-card low">

                        <div className="card-icon">🔔</div>

                        <h5>Expiry Alerts</h5>

                        <h2>{expiry}</h2>

                    </div>

                </div>

                {/* Table */}

                <div className="card shadow border-0 rounded-4 ">

                    <div className="card-body p-0">

                        <table className="table table-hover align-middle mb-0">

                            <thead style={{ background: "#14968d", color: "white" }}>

                                <tr>

                                    <th>Message</th>

                                    <th>Type</th>

                                    <th>Status</th>

                                    <th>Date</th>

                                    <th className="text-center">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {notifications.length > 0 ? (

                                    notifications.map((notification) => (

                                        <tr key={notification.notificationId}>

                                            <td>{notification.message}</td>

                                            <td>

                                                <span className="batch-pill">

                                                    {notification.notificationType}

                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${notification.isRead
                                                            ? "instock"
                                                            : "low"
                                                        }`}
                                                >

                                                    {notification.isRead
                                                        ? "Read"
                                                        : "Unread"}

                                                </span>

                                            </td>

                                            <td>

                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    {!notification.isRead && (

                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() =>
                                                                handleRead(notification.notificationId)
                                                            }
                                                        >

                                                            <FaEnvelopeOpen />

                                                        </button>

                                                    )}

                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(notification.notificationId)
                                                        }
                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center p-5"
                                        >

                                            No Notifications Found

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

         </div>

    );

}

export default Notifications;
