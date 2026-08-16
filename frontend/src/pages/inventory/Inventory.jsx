import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/Api";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Package,
  CheckCircle2,
  XCircle,
  Boxes,
  TrendingDown,
  Layers,
} from "lucide-react";

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [damagedQty, setDamagedQty] = useState("");
  const [reason, setReason] = useState("");

  const [threshold, setThreshold] = useState(10);
  const [highlightedId, setHighlightedId] = useState(null);

  const fetchInventoryAndSettings = async () => {
    try {
      const [invRes, settingsRes] = await Promise.all([
        API.get("/inventory"),
        API.get("/settings"),
      ]);
      setInventoryList(invRes.data);
      if (settingsRes.data && settingsRes.data.lowStockThreshold) {
        setThreshold(settingsRes.data.lowStockThreshold);
      }
    } catch (err) {
      console.error("Error fetching inventory or settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryAndSettings();
  }, []);

  useEffect(() => {
    if (location.state?.highlightId && inventoryList.length > 0) {
      const id = location.state.highlightId;
      setHighlightedId(id);

      setTimeout(() => {
        const element = document.getElementById(`inventory-row-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [location.state, inventoryList]);

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-800">
            Are you sure you want to delete this inventory item?
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
                confirmDelete(id);
              }}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  const confirmDelete = async (id) => {
    try {
      await API.delete(`/inventory/${id}`);
      toast.success("Inventory deleted successfully");
      fetchInventoryAndSettings();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data || "Something went wrong while deleting");
    }
  };

  const handleOpenDamagedModal = (item) => {
    setSelectedInventory(item);
    setDamagedQty("");
    setReason("");
    setShowDamagedModal(true);
  };

  const handleReportDamaged = async (e) => {
    e.preventDefault();

    if (!damagedQty || Number(damagedQty) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (Number(damagedQty) > selectedInventory?.quantity) {
      toast.error("Damaged quantity cannot exceed available stock.");
      return;
    }

    try {
      await API.post(
        `/inventory/${selectedInventory.inventoryId}/damaged?quantity=${damagedQty}&reason=${encodeURIComponent(
          reason
        )}`
      );
      setShowDamagedModal(false);
      fetchInventoryAndSettings();
      toast.success("Damaged stock reported & log updated successfully!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to report damaged stock");
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        badgeClass: "bg-rose-100/70 text-rose-700 border-rose-200",
        stockBadge: "bg-rose-50 text-rose-700 border-rose-200/80",
        Icon: XCircle,
      };
    } else if (quantity <= threshold) {
      return {
        label: "Low Stock",
        badgeClass: "bg-amber-100/70 text-amber-800 border-amber-200",
        stockBadge: "bg-amber-50 text-amber-700 border-amber-200/80",
        Icon: AlertTriangle,
      };
    } else {
      return {
        label: "In Stock",
        badgeClass: "bg-emerald-100/70 text-emerald-800 border-emerald-200",
        stockBadge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        Icon: CheckCircle2,
      };
    }
  };

  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      item.medicine?.medicineName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.medicine?.batchNo?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "LOW_STOCK") {
      return item.quantity > 0 && item.quantity <= threshold;
    }
    if (statusFilter === "OUT_OF_STOCK") {
      return item.quantity === 0;
    }
    if (statusFilter === "IN_STOCK") {
      return item.quantity > threshold;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading inventory details...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 ring-4 ring-blue-50">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Inventory Stock
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage medicine stock levels, filter low stock, and report damaged items
              </p>
            </div>
          </div>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            onClick={() => navigate("/dashboard/inventory/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20 active:scale-98"
          >
            <Plus size={16} /> Add Inventory
          </button>
        )}
      </div>

      <div className="px-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by medicine name or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl text-xs font-medium text-slate-600 overflow-x-auto border border-slate-200/50">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                  : "hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              All Stock
            </button>
            <button
              onClick={() => setStatusFilter("LOW_STOCK")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === "LOW_STOCK"
                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                  : "hover:text-amber-600 hover:bg-amber-50"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock (&le; {threshold})
            </button>
            <button
              onClick={() => setStatusFilter("OUT_OF_STOCK")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === "OUT_OF_STOCK"
                  ? "bg-rose-600 text-white font-semibold shadow-xs"
                  : "hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Out of Stock
            </button>
            <button
              onClick={() => setStatusFilter("IN_STOCK")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "IN_STOCK"
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Adequate Stock
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Medicine</th>
                  <th className="py-3.5 px-5">Batch No</th>
                  <th className="py-3.5 px-5 text-center">Stock Level</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity);
                    const IconComponent = status.Icon;

                    const isHighlighted =
                      highlightedId !== null &&
                      highlightedId !== undefined &&
                      String(item.inventoryId) === String(highlightedId);

                    return (
                      <tr
                        key={item.inventoryId}
                        id={`inventory-row-${item.inventoryId}`}
                        className={`transition-all duration-300 ${
                          isHighlighted
                            ? "bg-blue-50/90 border-l-4 border-l-blue-600 font-semibold"
                            : "hover:bg-blue-50/30 border-l-4 border-l-transparent"
                        }`}
                      >
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/80 shrink-0">
                              <Boxes className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-slate-900">{item.medicine?.medicineName || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2 py-1 bg-slate-100/80 text-slate-600 font-mono text-[11px] font-medium rounded-md border border-slate-200/60">
                            {item.medicine?.batchNo || item.batchNo || "N/A"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[11px] ${status.stockBadge}`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {item.quantity} Units
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.badgeClass}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center justify-center gap-2">
                            {/* Report Damaged Button */}
                            {(() => {
                              const isAllowed =
                                role === "Admin" || role === "Pharmacist";
                              const isOutOfStock = item.quantity === 0;
                              const isDisabled = !isAllowed || isOutOfStock;

                              let tooltipText = "Report Damaged Stock";
                              if (!isAllowed) {
                                tooltipText =
                                  "Only Admin & Pharmacist can report damaged stock";
                              } else if (isOutOfStock) {
                                tooltipText = "Stock is empty";
                              }

                              return (
                                <button
                                  onClick={() =>
                                    isAllowed && handleOpenDamagedModal(item)
                                  }
                                  disabled={isDisabled}
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                  title={tooltipText}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Report Damaged</span>
                                </button>
                              );
                            })()}

                            {/* Edit Button */}
                            {(role === "Admin" || role === "Pharmacist") && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/inventory/edit/${item.inventoryId}`
                                  )
                                }
                                className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 rounded-lg transition-colors cursor-pointer"
                                title="Edit Inventory"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Button */}
                            {role === "Admin" && (
                              <button
                                onClick={() => handleDelete(item.inventoryId)}
                                className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/70 rounded-lg transition-colors cursor-pointer"
                                title="Delete Inventory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          No inventory records match your search or filter criteria.
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

      {/* Report Damaged Modal */}
      {showDamagedModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDamagedModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              Report Damaged Stock
            </h3>
            <p className="text-xs text-slate-500 mb-5 pl-8">
              Medicine:{" "}
              <span className="font-semibold text-slate-800">
                {selectedInventory?.medicine?.medicineName}
              </span>{" "}
              (Available:{" "}
              <span className="font-bold text-blue-600">
                {selectedInventory?.quantity}
              </span>
              )
            </p>

            <form onSubmit={handleReportDamaged} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Damaged Quantity
                </label>
                <input
                  type="number"
                  max={selectedInventory?.quantity}
                  min="1"
                  value={damagedQty}
                  onChange={(e) => setDamagedQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g., Broken bottle, Expired package"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDamagedModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Deduct & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;