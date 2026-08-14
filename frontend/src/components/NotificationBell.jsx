import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/notifications`
      );
      setNotifications(response.data.slice(0, 10));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/notifications/unread-count`
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/mark-all-read`
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/${id}/read`
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/notifications/${id}`
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      await axios.post(
        `${API_URL}/api/notifications/generate-alerts`
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTypeColor = (type) => {
    if (type === "LOW_STOCK") return "#f6ad55";
    if (type === "OUT_OF_STOCK") return "#e53e3e";
    if (type === "EXPIRY") return "#fc8181";
    if (type === "PURCHASE") return "#68d391";
    return "#63b3ed";
  };

  const getTypeIcon = (type) => {
    if (type === "LOW_STOCK") return "⚠️";
    if (type === "OUT_OF_STOCK") return "🔴";
    if (type === "EXPIRY") return "⏰";
    if (type === "PURCHASE") return "🛒";
    return "🔔";
  };

  return (
    <div style={{ position: "relative" }}>

      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            background: "#e94560",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: "absolute",
          right: "0",
          top: "55px",
          width: "380px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          zIndex: 1000,
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "15px 20px",
            background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{
                color: "white", margin: 0,
                fontSize: "16px", fontWeight: "700"
              }}>
                🔔 Notifications
              </h3>
              <p style={{
                color: "#a0aec0", margin: 0,
                fontSize: "12px"
              }}>
                {unreadCount} unread
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleGenerateAlerts}
                style={{
                  padding: "5px 10px",
                  background: "#e94560",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "600"
                }}>
                🔄 Refresh
              </button>
              <button
                onClick={handleMarkAllRead}
                style={{
                  padding: "5px 10px",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px"
                }}>
                ✅ Mark All Read
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: "400px",
            overflowY: "auto"
          }}>
            {notifications.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "40px",
                color: "#a0aec0"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  🔔
                </div>
                <p>No notifications!</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id} style={{
                  padding: "15px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  background: notification.isRead
                    ? "white" : "#f8f9ff",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}>
                  {/* Icon */}
                  <div style={{
                    width: "40px",
                    height: "40px",
                    background: getTypeColor(notification.type) + "20",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0
                  }}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: "0 0 4px 0",
                      fontWeight: notification.isRead
                        ? "400" : "600",
                      color: "#2d3748",
                      fontSize: "13px"
                    }}>
                      {notification.title}
                    </p>
                    <p style={{
                      margin: "0 0 6px 0",
                      color: "#718096",
                      fontSize: "12px",
                      lineHeight: "1.4"
                    }}>
                      {notification.message}
                    </p>
                    <p style={{
                      margin: 0,
                      color: "#a0aec0",
                      fontSize: "11px"
                    }}>
                      {notification.createdAt ?
                        new Date(notification.createdAt)
                          .toLocaleString() : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        style={{
                          padding: "3px 8px",
                          background: "#f0fff4",
                          color: "#276749",
                          border: "1px solid #9ae6b4",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "10px"
                        }}>
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      style={{
                        padding: "3px 8px",
                        background: "#fff5f5",
                        color: "#e53e3e",
                        border: "1px solid #fed7d7",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "10px"
                      }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid #f0f0f0",
            textAlign: "center"
          }}>
            <button
              onClick={() => {
                setShowDropdown(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#718096",
                cursor: "pointer",
                fontSize: "13px"
              }}>
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;