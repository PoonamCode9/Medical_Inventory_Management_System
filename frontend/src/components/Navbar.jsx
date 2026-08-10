import {
  Bell,
  Package,
  Pill,
  AlertTriangle,
  Truck,
  UserPlus,
  Search,
  User,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import API from "../api/Api";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [latestNotifications, setLatestNotifications] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

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
      await API.put(`/notifications/${id}/read`, {});
      fetchLatestNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInventoryForSearch = async () => {
    if (inventoryList.length > 0) return;
    setIsSearching(true);
    try {
      const res = await API.get("/inventory");
      setInventoryList(res.data || []);
    } catch (error) {
      console.error("Error fetching inventory for search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = inventoryList.filter((item) => {
        const name = (item.medicine?.medicineName || item.medicineName || item.name || "").toLowerCase();
        const batch = (item.medicine?.batchNo || item.batchNo || "").toLowerCase();
        const category = (item.medicine?.category || "").toLowerCase();

        return (
          name.includes(query) ||
          batch.includes(query) ||
          category.includes(query)
        );
      });

      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery, inventoryList]);

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
      case "LOW_STOCK":
        return <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />;
      case "USER_REGISTERED":
        return <UserPlus className="text-blue-500 w-5 h-5 shrink-0" />;
      case "INVENTORY_ADDED":
      case "INVENTORY_UPDATED":
      case "INVENTORY_DELETED":
        return <Package className="text-emerald-500 w-5 h-5 shrink-0" />;
      case "SUPPLIER_ADDED":
      case "SUPPLIER_UPDATED":
      case "SUPPLIER_DELETED":
        return <Truck className="text-purple-500 w-5 h-5 shrink-0" />;
      case "MEDICINE_ADDED":
      case "MEDICINE_UPDATED":
      case "MEDICINE_DELETED":
        return <Pill className="text-indigo-500 w-5 h-5 shrink-0" />;
      default:
        return <Bell className="text-gray-500 w-5 h-5 shrink-0" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    fetchInventoryForSearch();
  }, []);

  return (
    <nav className="h-16 flex items-center px-8 shadow-xs justify-between w-full bg-white relative z-40">
      <div className="relative w-80 sm:w-96" ref={searchRef}>
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all border border-transparent">
          <Search size={18} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search & jump to stock..."
            value={searchQuery}
            onFocus={() => {
              fetchInventoryForSearch();
              if (searchQuery.trim().length >= 1) setShowSearchDropdown(true);
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 bg-transparent outline-none w-full text-xs sm:text-sm text-slate-800 placeholder:text-gray-400"
          />
          {isSearching ? (
            <Loader2
              size={16}
              className="text-blue-600 animate-spin shrink-0 ml-1"
            />
          ) : searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchDropdown(false);
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {showSearchDropdown && (
          <div className="absolute left-0 mt-2 w-full sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Inventory Stock Results</span>
              <span>{searchResults.length} found</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  const medicineName = item.medicine?.medicineName || item.medicineName || item.name || "N/A";
                  const batchNo = item.medicine?.batchNo || item.batchNo || "N/A";

                  return (
                    <div
                      key={item.inventoryId}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery("");
                        
                        navigate("/dashboard/inventory", {
                          state: { highlightId: item.inventoryId },
                        });
                      }}
                      className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                          <Pill size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">
                            {medicineName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            Batch: <span className="font-mono">{batchNo}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-800">
                          {item.quantity} Units
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                          Jump →
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  {isSearching
                    ? "Loading inventory stock..."
                    : "No matching stock items found."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative text-gray-600 hover:text-blue-600 cursor-pointer transition"
            onClick={() => {
              setShowNotifications(!showNotifications);
              fetchLatestNotifications();
            }}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-2.5 -right-2 h-5 w-5 text-[9px] font-bold text-white flex items-center justify-center rounded-full bg-red-500 shadow-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-88 rounded-2xl shadow-xl border border-slate-200 z-50 bg-white overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Notifications
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {unreadCount} unread message{unreadCount !== 1 && "s"}
                  </p>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {latestNotifications.length > 0 ? (
                  latestNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      onClick={() =>
                        handleNotificationClick(notification.notificationId)
                      }
                      className={`p-3.5 transition cursor-pointer flex gap-3 hover:bg-slate-50 ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50/60 border-l-4 border-l-blue-600"
                      }`}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.notificationType)}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-start">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {notification.notificationType}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No Notifications available
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  className="w-full text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer py-1"
                  onClick={() => {
                    navigate("/dashboard/notifications");
                    setShowNotifications(false);
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-full text-white flex items-center justify-center transition cursor-pointer shadow-xs"
          onClick={() => navigate("/dashboard/profile")}
        >
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;