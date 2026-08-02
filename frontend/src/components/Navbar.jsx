import {
  Bell,
  Package,
  Pill,
  AlertTriangle,
  Truck,
  UserPlus,
  Search, 
  User,   
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import API from "../api/Api";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [latestNotifications, setLatestNotifications] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notifications/unread-count");
      setUnreadCount(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLatestNotifications = async () => {
    try {
      const res = await API.get("/notifications/latest");
      setLatestNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}/read`, {});
      fetchLatestNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";

    return `${days} days ago`;
  };

  const getNotificationIcon = (type) => {
        switch (type) {
            case 'LOW_STOCK':
                return <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />;
            case 'USER_REGISTERED':
                return <UserPlus className="text-blue-500 w-5 h-5 shrink-0" />;
            case 'INVENTORY_ADDED':
            case 'INVENTORY_UPDATED':
            case 'INVENTORY_DELETED':
                return <Package className="text-emerald-500 w-5 h-5 shrink-0" />;
            case 'SUPPLIER_ADDED':
            case 'SUPPLIER_UPDATED':
            case 'SUPPLIER_DELETED':
                return <Truck className="text-purple-500 w-5 h-5 shrink-0" />;
            case 'MEDICINE_ADDED':
            case 'MEDICINE_UPDATED':
            case 'MEDICINE_DELETED':
                return <Pill className="text-indigo-500 w-5 h-5 shrink-0" />;
            default:
                return <Bell className="text-gray-500 w-5 h-5 shrink-0" />;
        }
    };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <nav className="h-16 flex items-center px-8 shadow justify-between w-full">
      <div className="flex gap-3 items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 bg-transparent outline-none w-full"
        />
      </div>
      {/* Right side */}
      <div className="flex items-center gap-12 mr-9">
        <div className="relative" ref={dropdownRef}>
          <button className="relative text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => {
                setShowNotifications(!showNotifications);
                fetchLatestNotifications();
              }}>
            <Bell
              size={22}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-2 h-5 w-5 text-[9px] font-bold text-white flex items-center justify-center rounded-full bg-red-500">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-1 w-88 rounded-xl shadow-xl border z-50 bg-white">
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-[11px] text-gray-500">
                    {unreadCount} unread message{unreadCount !== 1 && "s"}
                  </p>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {latestNotifications.length > 0 ? (
                  latestNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      onClick={() =>
                        handleNotificationClick(notification.notificationId)
                      }
                      className={`p-3.5 transition cursor-pointer flex gap-3 hover:bg-gray-50 ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50 border-l-4 border-l-blue-500"
                      }`}
                    >
                      {/* Icon */}
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.notificationType)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-start">
                          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full">
                            {notification.notificationType}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                      {/* Unread Dot */}
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-gray-500">
                    No Notifications
                  </div>
                )}
                <div className="p-3 border-t">
                  <button
                    className="w-full text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    onClick={() => {
                      navigate("/dashboard/notifications");
                      setShowNotifications(false);
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="h-9 w-9 bg-blue-600 rounded-full text-white flex items-center justify-center hover:bg-blue-700 cursor-pointer">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
