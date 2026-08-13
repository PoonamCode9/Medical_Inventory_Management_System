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
    } finally {
      setLoading(false);
    }
  };

  const removeExpiredStock = async (inventoryId, medicineName) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove expired stock for ${medicineName}?`,
    );
    if (!confirmRemove) return;

    try {
      setRemovingId(inventoryId);
      await API.post(`/inventory/${inventoryId}/remove-expired`);
      alert("Expired stock removed successfully.");
      fetchExpiryData();
    } catch (error) {
      alert(error.response?.data || "Failed to remove expired stock.");
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
          item.batchNo?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (sortBy === "days") {
      result.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        (a.medicineName || "").localeCompare(b.medicineName || ""),
      );
    }

    return result;
  }, [data, search, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Expiring_Soon":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Expired":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            Expiry Tracker
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage medicine expiration dates and tracking alerts
          </p>
        </div>
        <button
          onClick={fetchExpiryData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition duration-200 text-sm shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Expired
            </p>
            <h2 className="text-2xl font-bold text-rose-600 mt-1">
              {stats.expired}
            </h2>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Urgent (&le; {settings.urgentExpiryDays} Days)
            </p>
            <h2 className="text-2xl font-bold text-orange-600 mt-1">
              {stats.urgent}
            </h2>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
            <TriangleAlert size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Expiring Soon (&le; {settings.expiryAlertDays} Days)
            </p>
            <h2 className="text-2xl font-bold text-amber-600 mt-1">
              {stats.expiringSoon}
            </h2>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Stock
            </p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.active}
            </h2>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search medicine or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
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
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="days">Sort by Days Left</option>
              <option value="name">Sort by Medicine Name</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-4">Medicine</th>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Days Left</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const invId = item.inventoryId || item.id;
                  const itemKey = invId || item.batchNo || index;

                  return (
                    <tr
                      key={itemKey}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-800">
                        {item.medicineName || "N/A"}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs">
                        {item.batchNo || "N/A"}
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{item.expiryDate || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
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
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            item.status,
                          )}`}
                        >
                          {item.status ? item.status.replace("_", " ") : "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {item.remarks || "—"}
                      </td>
                      <td className="p-4 text-center">
                        {item.status === "Expired" &&
                        (role === "Admin" || role === "Pharmacist") ? (
                          !item.inventoryId ? (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                              No Stock
                            </span>
                          ) : item.quantity === 0 ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
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
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <Trash2 size={13} />
                              {removingId === invId
                                ? "Removing..."
                                : "Remove Stock"}
                            </button>
                          )
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpiryTracker;