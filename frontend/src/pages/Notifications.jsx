import React, { useEffect, useState } from "react";
import API from "../api/Api";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Edit,
  PackageX,
  PackageCheck,
  Pill,
  ShoppingCart,
  Trash2,
  Truck,
  Users,
  ShieldAlert,
} from "lucide-react";

// Flexible Notification Type Visual Config
const getNotificationTypeConfig = (type) => {
  switch (type) {
    case "MEDICINE_ADDED":
    case "SUPPLIER_ADDED":
      return {
        icon: <Pill className="w-4 h-4 text-emerald-600" />,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      };
    case "MEDICINE_UPDATED":
    case "SUPPLIER_UPDATED":
    case "INVENTORY_UPDATED":
      return {
        icon: <Edit className="w-4 h-4 text-blue-600" />,
        bg: "bg-blue-50 text-blue-700 border-blue-200/80",
      };
    case "MEDICINE_DELETED":
    case "SUPPLIER_DELETED":
    case "INVENTORY_DELETED":
      return {
        icon: <Trash2 className="w-4 h-4 text-rose-600" />,
        bg: "bg-rose-50 text-rose-700 border-rose-200/80",
      };
    case "MEDICINE_SOLD":
      return {
        icon: <ShoppingCart className="w-4 h-4 text-cyan-600" />,
        bg: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
      };
    case "STOCK_DAMAGED":
    case "LOW_STOCK":
      return {
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        bg: "bg-amber-50 text-amber-800 border-amber-200/80",
      };
    case "USER_REGISTERED":
      return {
        icon: <Users className="w-4 h-4 text-purple-600" />,
        bg: "bg-purple-50 text-purple-700 border-purple-200/80",
      };
    default:
      return {
        icon: <Bell className="w-4 h-4 text-slate-600" />,
        bg: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); 

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`, {});
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await API.put("/notifications/mark-all-read");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";

    return `${days}d ago`;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "READ") return n.isRead;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Bell className="w-6 h-6 text-purple-600" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Stay updated with real-time system activities, stock logs, and alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-4 py-2.5 rounded-lg text-sm shadow-xs transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-medium">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === "ALL"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === "UNREAD"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("READ")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === "READ"
              ? "bg-slate-900 text-white font-semibold shadow-lg"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white border border-slate-200 rounded-xl animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Notification List */
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const typeConfig = getNotificationTypeConfig(
                notification.notificationType
              );

              return (
                <div
                  key={notification.notificationId}
                  className={`rounded-xl p-4 border transition-all duration-150 ${
                    notification.isRead
                      ? "bg-white border-slate-400 opacity-75"
                      : "bg-blue-50/40 border-blue-200/80 shadow-xs border-l-4 border-l-blue-600"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Left content block */}
                    <div className="flex gap-3.5 items-start">
                      <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg shadow-xs flex-shrink-0 mt-0.5">
                        {typeConfig.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${typeConfig.bg}`}
                          >
                            {notification.notificationType?.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-slate-800 leading-snug">
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(notification.notificationId)
                        }
                        className="self-end sm:self-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-14 bg-white border border-slate-200 rounded-xl">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold">No Notifications Found</p>
              <p className="text-slate-400 text-xs mt-1">
                {filter === "UNREAD"
                  ? "You have no unread notifications right now."
                  : "All system activity updates will appear here."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;