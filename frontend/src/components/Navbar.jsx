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
  ChevronRight,
  CheckCircle2,
  Menu
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import API from "../api/Api";
import { useNavigate } from "react-router-dom";

function Navbar({ isSidebarOpen, onToggleSidebar }) {
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
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";

    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LOW_STOCK":
        return <AlertTriangle className="text-amber-500 w-4 h-4 shrink-0" />;
      case "USER_REGISTERED":
        return <UserPlus className="text-blue-500 w-4 h-4 shrink-0" />;
      case "INVENTORY_ADDED":
      case "INVENTORY_UPDATED":
      case "INVENTORY_DELETED":
        return <Package className="text-emerald-500 w-4 h-4 shrink-0" />;
      case "SUPPLIER_ADDED":
      case "SUPPLIER_UPDATED":
      case "SUPPLIER_DELETED":
        return <Truck className="text-purple-500 w-4 h-4 shrink-0" />;
      case "MEDICINE_ADDED":
      case "MEDICINE_UPDATED":
      case "MEDICINE_DELETED":
        return <Pill className="text-indigo-500 w-4 h-4 shrink-0" />;
      default:
        return <Bell className="text-slate-500 w-4 h-4 shrink-0" />;
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
    <nav className="h-16 flex items-center justify-start gap-6 px-6 bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow select-none antialiased">

      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
            title="Expand Sidebar"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-80 sm:w-96" ref={searchRef}>
        <div className="flex items-center bg-slate-100/70 border border-slate-200/80 rounded-xl px-2.5 px-1.5 sm:px-3.5 py-2 w-full focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200">
          <Search size={17} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search & jump to stock..."
            value={searchQuery}
            onFocus={() => {
              fetchInventoryForSearch();
              if (searchQuery.trim().length >= 1) setShowSearchDropdown(true);
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2.5 bg-transparent outline-none w-full text-xs font-medium text-slate-800 placeholder:text-slate-400"
          />
          {isSearching ? (
            <Loader2
              size={15}
              className="text-blue-600 animate-spin shrink-0 ml-1.5"
            />
          ) : searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchDropdown(false);
              }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-md hover:bg-slate-200/50 transition"
            >
              <X size={15} />
            </button>
          ) : null}
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="absolute left-0 mt-2 w-full sm:w-[420px] bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Inventory Results</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{searchResults.length} found</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
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
                      className="p-3 hover:bg-slate-50/80 transition cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
                          <Pill size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition">
                            {medicineName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Batch: <span className="font-mono text-slate-600 font-medium">{batchNo}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <div className="text-xs font-bold text-slate-700">
                            {item.quantity} Units
                          </div>
                          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 justify-end group-hover:underline">
                            Jump <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
                  {isSearching
                    ? "Loading inventory stock..."
                    : "No matching stock items found."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5 ml-auto mr-5">
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 cursor-pointer transition-all duration-200"
            onClick={() => {
              setShowNotifications(!showNotifications);
              fetchLatestNotifications();
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 text-[9px] font-bold text-white flex items-center justify-center rounded-full bg-rose-500 ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute -right-8 sm:right-0 mt-3 w-60 sm:w-88 rounded-2xl shadow-xl border border-slate-200/90 z-50 bg-white overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">
                    Notifications
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All notifications caught up"}
                  </p>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {latestNotifications.length > 0 ? (
                  latestNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      onClick={() =>
                        handleNotificationClick(notification.notificationId)
                      }
                      className={`p-3.5 transition cursor-pointer flex gap-3 hover:bg-slate-50/80 ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-blue-50/40 border-l-3 border-l-blue-600"
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100/70 h-max">
                        {getNotificationIcon(notification.notificationType)}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {notification.notificationType?.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-snug">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No notifications available
                  </div>
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                <button
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 rounded-xl py-1.5 text-xs font-semibold cursor-pointer transition"
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

        {/* User Profile */}
        <button
          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-full text-white flex items-center justify-center transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 ring-2 ring-blue-50"
          onClick={() => navigate("/dashboard/profile")}
          title="User Profile"
        >
          <User size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;