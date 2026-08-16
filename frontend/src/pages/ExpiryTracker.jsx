import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Calendar,
  TriangleAlert,
  ShieldAlert,
  Clock,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import API from "../api/Api";
import toast from "react-hot-toast";

function ExpiryTracker() {
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("days");
  const [removingId, setRemovingId] = useState(null);

  const [settings, setSettings] = useState({
    urgentExpiryDays: 7,
    expiryAlertDays: 60,
  });

  const fetchExpiryData = async () => {
    setLoading(true);
    try {
      const [expiryRes, settingsRes] = await Promise.all([
        API.get("/expiry-alerts"),
        API.get("/settings"),
      ]);

      setData(expiryRes.data || []);

      if (settingsRes.data) {
        setSettings({
          urgentExpiryDays: settingsRes.data.urgentExpiryDays || 7,
          expiryAlertDays: settingsRes.data.expiryAlertDays || 60,
        });
      }
    } catch (error) {
      console.error("Error fetching expiry alerts or settings:", error);
      toast.error("Failed to fetch expiry tracker data.");
    } finally {
      setLoading(false);
    }
  };

  const removeExpiredStock = (inventoryId, medicineName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-800">
            Are you sure you want to remove expired stock for{" "}
            <span className="font-semibold text-rose-600">{medicineName}</span>?
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                confirmRemoveExpiredStock(inventoryId);
              }}
              className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition cursor-pointer"
            >
              Remove Stock
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  const confirmRemoveExpiredStock = async (inventoryId) => {
    try {
      setRemovingId(inventoryId);
      await API.post(`/inventory/${inventoryId}/remove-expired`);
      toast.success("Expired stock removed successfully!");
      fetchExpiryData();
    } catch (error) {
      toast.error(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Failed to remove expired stock."
      );
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchExpiryData();
  }, []);

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      expired: data.filter((x) => x.status === "Expired").length,
      urgent: data.filter((x) => x.status === "Urgent").length,
      expiringSoon: data.filter((x) => x.status === "Expiring_Soon").length,
      active: data.filter((x) => x.status === "Active").length,
    };
  }, [data]);

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.medicineName?.toLowerCase().includes(query) ||
          item.batchNo?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (sortBy === "days") {
      result.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        (a.medicineName || "").localeCompare(b.medicineName || "")
      );
    }

    return result;
  }, [data, search, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Expiring_Soon":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Urgent":
        return "bg-orange-50 text-orange-800 border-orange-200/80";
      case "Expired":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/80";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading expiry tracking data...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-amber-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-md shadow-amber-500/20 ring-4 ring-amber-50">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Expiry Tracker
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage medicine expiration dates and tracking alerts
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchExpiryData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20 active:scale-98 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="px-6 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Expired */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Expired
              </p>
              <h2 className="text-2xl font-extrabold text-rose-600 mt-1">
                {stats.expired}
              </h2>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 ring-4 ring-rose-50/50">
              <ShieldAlert size={20} />
            </div>
          </div>

          {/* Urgent */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Urgent (&le; {settings.urgentExpiryDays} Days)
              </p>
              <h2 className="text-2xl font-extrabold text-orange-600 mt-1">
                {stats.urgent}
              </h2>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 ring-4 ring-orange-50/50">
              <TriangleAlert size={20} />
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Expiring Soon (&le; {settings.expiryAlertDays} Days)
              </p>
              <h2 className="text-2xl font-extrabold text-amber-600 mt-1">
                {stats.expiringSoon}
              </h2>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 ring-4 ring-amber-50/50">
              <Clock size={20} />
            </div>
          </div>

          {/* Active */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Stock
              </p>
              <h2 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {stats.active}
              </h2>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 ring-4 ring-emerald-50/50">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search medicine or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Expired">Expired</option>
              <option value="Urgent">Urgent</option>
              <option value="Expiring_Soon">Expiring Soon</option>
              <option value="Active">Active</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="days">Sort by Days Left</option>
              <option value="name">Sort by Medicine Name</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Medicine</th>
                  <th className="py-3.5 px-5">Batch Number</th>
                  <th className="py-3.5 px-5">Expiry Date</th>
                  <th className="py-3.5 px-5">Days Left</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Remarks</th>
                  <th className="py-3.5 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const invId = item.inventoryId || item.id;
                    const itemKey = invId || item.batchNo || index;

                    return (
                      <tr
                        key={itemKey}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {item.medicineName || "N/A"}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                          {item.batchNo || "N/A"}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            <span>{item.expiryDate || "—"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-semibold">
                          <span
                            className={
                              item.daysLeft < 0
                                ? "text-rose-600 font-bold"
                                : item.daysLeft <= settings.urgentExpiryDays
                                ? "text-orange-600 font-bold"
                                : item.daysLeft <= settings.expiryAlertDays
                                ? "text-amber-600 font-semibold"
                                : "text-emerald-600"
                            }
                          >
                            {item.daysLeft < 0
                              ? "Expired"
                              : item.daysLeft === 0
                              ? "Expires Today"
                              : `${item.daysLeft} Days`}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status ? item.status.replace("_", " ") : "N/A"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">
                          {item.remarks || "—"}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {item.status === "Expired" &&
                          (role === "Admin" || role === "Pharmacist") ? (
                            !item.inventoryId ? (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                                No Stock
                              </span>
                            ) : item.quantity === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                                <CheckCircle
                                  size={13}
                                  className="text-emerald-600"
                                />
                                Stock Removed
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  removeExpiredStock(invId, item.medicineName)
                                }
                                disabled={removingId === invId}
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                                {removingId === invId
                                  ? "Removing..."
                                  : "Remove Stock"}
                              </button>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          No matching expiry records found. Try adjusting filters or search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpiryTracker;