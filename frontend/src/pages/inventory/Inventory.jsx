import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/Api";
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
} from "lucide-react";

const Inventory = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, LOW_STOCK, OUT_OF_STOCK, IN_STOCK
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [damagedQty, setDamagedQty] = useState("");
  const [reason, setReason] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      setInventoryList(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/inventory/${id}`);
      alert("Inventory deleted successfully");
      fetchInventory();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data || "Something went wrong while deleting");
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
      alert("Please enter a valid quantity.");
      return;
    }

    if (Number(damagedQty) > selectedInventory?.quantity) {
      alert("Damaged quantity cannot exceed available stock.");
      return;
    }

    try {
      await API.post(
        `/inventory/${selectedInventory.inventoryId}/damaged?quantity=${damagedQty}&reason=${encodeURIComponent(reason)}`
      );
      setShowDamagedModal(false);
      fetchInventory(); // Stock Refresh
      alert("Damaged stock reported & log updated successfully!");
    } catch (err) {
      alert(err.response?.data || "Failed to report damaged stock");
    }
  };

  // Helper function to get Status Details
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { 
        label: "Out of Stock", 
        badgeClass: "bg-red-100 text-red-700 border-red-200",
        stockBadge: "bg-red-50 text-red-700 border-red-200",
        Icon: XCircle 
      };
    } else if (quantity <= 20) {
      return { 
        label: "Low Stock", 
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        stockBadge: "bg-amber-50 text-amber-700 border-amber-200",
        Icon: AlertTriangle 
      };
    } else {
      return { 
        label: "In Stock", 
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        stockBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Icon: CheckCircle2 
      };
    }
  };

  // Filter Logic (Search + Status Filter)
  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      item.medicine?.medicineName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.medicine?.batchNo?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "LOW_STOCK") {
      return item.quantity > 0 && item.quantity <= 20;
    }
    if (statusFilter === "OUT_OF_STOCK") {
      return item.quantity === 0;
    }
    if (statusFilter === "IN_STOCK") {
      return item.quantity > 20;
    }

    return true; // "ALL"
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-600" />
            Inventory Stock
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage medicine stock levels, filter low stock, and report damaged items
          </p>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            onClick={() => navigate("/dashboard/inventory/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Inventory
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by medicine name or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setStatusFilter("LOW_STOCK")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              statusFilter === "LOW_STOCK"
                ? "bg-amber-500 text-white shadow-xs"
                : "hover:text-amber-600"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock (&le; 20)
          </button>
          <button
            onClick={() => setStatusFilter("OUT_OF_STOCK")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "OUT_OF_STOCK"
                ? "bg-red-600 text-white shadow-xs"
                : "hover:text-red-600"
            }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => setStatusFilter("IN_STOCK")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "IN_STOCK"
                ? "bg-emerald-600 text-white shadow-xs"
                : "hover:text-emerald-600"
            }`}
          >
            Adequate Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
            <tr>
              <th className="p-4">Medicine</th>
              <th className="p-4">Batch No</th>
              <th className="p-4 text-center">Stock Level</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const status = getStockStatus(item.quantity);
                const IconComponent = status.Icon;
                return (
                  <tr
                    key={item.inventoryId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {item.medicine?.medicineName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {item.medicine?.batchNo || item.batchNo || "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border font-semibold text-xs ${status.stockBadge}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                        {item.quantity} Units
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${status.badgeClass}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4">
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
                              className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-50 cursor-pointer"
                              title={tooltipText}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Report Damaged
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
                            className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Inventory"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        {role === "Admin" && (
                          <button
                            onClick={() => handleDelete(item.inventoryId)}
                            className="p-1.5 text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Inventory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400">
                  No inventory records match your search/filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Report Damaged Modal */}
      {showDamagedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDamagedModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <AlertTriangle className="text-amber-500 w-5 h-5" /> Report
              Damaged Stock
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Medicine:{" "}
              <span className="font-semibold text-slate-700">
                {selectedInventory?.medicine?.medicineName}
              </span>{" "}
              (Available:{" "}
              <span className="font-bold text-slate-800">
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
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDamagedModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
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