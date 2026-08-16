import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  CheckCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Package,
  Clock,
  X,
  Inbox,
  Sparkles,
} from "lucide-react";
import API from "../api/Api";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Load notifications and unread count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [allRes, countRes] = await Promise.all([
        API.get("/notifications"),
        API.get("/notifications/unread-count"),
      ]);
      setNotifications(allRes.data || []);
      setUnreadCount(countRes.data || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id || n.id === id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await API.put(`/notifications/${id}/read`);
      toast.success("Notification marked as read.");
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to mark notification as read.");
      fetchNotifications();
    }
  };

  // Delete single notification
  const handleDeleteSingle = async (id) => {
    try {
      const targetNotif = notifications.find(
        (n) => (n.notificationId || n.id) === id
      );
      setNotifications((prev) =>
        prev.filter((n) => (n.notificationId || n.id) !== id)
      );

      if (targetNotif && !targetNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      await API.delete(`/notifications/${id}`);
      toast.success("Notification removed.");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification.");
      fetchNotifications();
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await API.put("/notifications/read-all");
      toast.success("All notifications marked as read.");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all as read.");
      fetchNotifications();
    }
  };

  // Clear all read notifications
  const handleDeleteRead = () => {
    const readCountToClear = notifications.filter((n) => n.isRead).length;
    if (readCountToClear === 0) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-800">
            Clear all <span className="font-bold">{readCountToClear}</span> read notifications?
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2.5 py-1 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                confirmDeleteRead();
              }}
              className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      ),
      { duration: 4000, position: "top-center" }
    );
  };

  const confirmDeleteRead = async () => {
    try {
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      await API.delete("/notifications/read");
      toast.success("Read notifications cleared.");
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
      toast.error("Failed to clear read notifications.");
      fetchNotifications();
    }
  };

  const getModeBadge = (mode) => {
    const modeUpper = (mode || "PUSH").toUpperCase();
    if (modeUpper === "EMAIL") {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-purple-200/80">
          <Mail className="w-3 h-3" /> Email
        </span>
      );
    } else if (modeUpper === "PUSH") {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-blue-200/80">
          <Smartphone className="w-3 h-3" /> Push
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/80">
        <Smartphone className="w-3 h-3" />
        <Mail className="w-3 h-3" /> Both
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const t = (type || "").toUpperCase();
    if (t.includes("EXPIRY") || t.includes("EXPIRED")) {
      return (
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shrink-0 border border-rose-100 ring-4 ring-rose-50/50">
          <Clock className="w-5 h-5" />
        </div>
      );
    } else if (t.includes("LOW_STOCK") || t.includes("STOCK")) {
      return (
        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0 border border-amber-100 ring-4 ring-amber-50/50">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    } else if (t.includes("ORDER")) {
      return (
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 border border-blue-100 ring-4 ring-blue-50/50">
          <Package className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 border border-indigo-100 ring-4 ring-indigo-50/50">
        <Bell className="w-5 h-5" />
      </div>
    );
  };

  // Filtering Notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "read") return item.isRead;
    return true;
  });

  const readCount = notifications.length - unreadCount;

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60 font-sans antialiased">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 ring-4 ring-blue-50">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {unreadCount} New
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time updates on stock alerts, drug expiries, and store orders
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition active:scale-98 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleDeleteRead}
              className="flex items-center gap-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition active:scale-98 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear Read ({readCount})
            </button>
          )}
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Tab Controls Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center bg-slate-200/60 p-1 rounded-xl text-xs font-medium text-slate-600 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "unread"
                  ? "bg-white text-blue-700 font-semibold shadow-xs"
                  : "hover:text-blue-600"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "read"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Read ({readCount})
            </button>
          </div>
        </div>

        {/* Notifications List Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const id = item.notificationId || item.id;
              return (
                <div
                  key={id}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-all duration-150 ${
                    !item.isRead
                      ? "bg-blue-50/40 hover:bg-blue-50/60"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {getTypeIcon(item.notificationType)}

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[11px] tracking-wider text-slate-900 uppercase">
                        {item.notificationType?.replace(/_/g, " ") || "GENERAL"}
                      </span>
                      {getModeBadge(item.notificationMode)}
                      {!item.isRead && (
                        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {item.message}
                    </p>
                    {item.createdAt && (
                      <p className="text-[11px] text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(id)}
                        title="Mark as Read"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSingle(id)}
                      title="Delete Notification"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl w-fit mx-auto border border-slate-200/60 ring-4 ring-slate-50">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-medium text-xs">
                {activeTab === "unread"
                  ? "All caught up! No unread notifications."
                  : activeTab === "read"
                  ? "No read notifications found."
                  : "No notifications available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}