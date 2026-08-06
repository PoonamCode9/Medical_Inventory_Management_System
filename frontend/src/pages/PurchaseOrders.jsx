import React, { useEffect, useState } from "react";
import API from "../api/Api";
import {
  ShoppingCart,
  Plus,
  Search,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  Pill,
  Building2,
  Calendar,
  Boxes,
} from "lucide-react";

function PurchaseOrders() {
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 

  const [inputValues, setInputValues] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    medicineId: "",
    supplierId: "",
    quantity: 1,
    expectedDelivery: "",
  });

  // Fetch All Data
  const fetchOrdersAndDropdowns = async () => {
    try {
      const [ordersRes, medRes, supRes] = await Promise.all([
        API.get("/purchase-orders"),
        API.get("/medicines").catch(() => ({ data: [] })),
        API.get("/suppliers").catch(() => ({ data: [] })),
      ]);

      const fetchedOrders = ordersRes.data || [];
      setOrders(fetchedOrders);
      setMedicines(medRes.data || []);
      setSuppliers(supRes.data || []);

      const initialInputs = {};
      fetchedOrders.forEach((order) => {
        initialInputs[order.orderId] = {
          receivedQuantity: order.quantity,
          damagedQuantity: 0,
          remarks: "",
        };
      });
      setInputValues(initialInputs);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndDropdowns();
  }, []);

  // Handle input changes
  const handleInputChange = (orderId, field, value) => {
    setInputValues((prev) => {
      const currentOrder = prev[orderId] || {};
      const updated = { ...currentOrder, [field]: value };

      if (field === "receivedQuantity") {
        const order = orders.find((o) => o.orderId === orderId);
        const recQty = parseInt(value) || 0;
        if (order && recQty < order.quantity) {
          updated.damagedQuantity = order.quantity - recQty;
        } else {
          updated.damagedQuantity = 0;
        }
      }

      return { ...prev, [orderId]: updated };
    });
  };

  // Confirm & Receive Stock
  const handleReceiveSubmit = async (order) => {
    const orderData = inputValues[order.orderId] || {};
    const recQty = parseInt(orderData.receivedQuantity ?? order.quantity);
    const damQty = parseInt(orderData.damagedQuantity ?? 0);

    if (recQty < 0 || damQty < 0) {
      alert("Quantity cannot be negative!");
      return;
    }

    if (recQty > order.quantity) {
      alert(`Received Quantity (${recQty}) cannot exceed Ordered Quantity (${order.quantity})!`);
      return;
    }

    try {
      await API.put(`/purchase-orders/${order.orderId}/receive`, {
        receivedQuantity: recQty,
        damagedQuantity: damQty,
        remarks: orderData.remarks || "",
      });

      alert("Stock received successfully & inventory updated!");
      fetchOrdersAndDropdowns();
    } catch (error) {
      console.error("Error receiving order:", error);
      alert(error.response?.data || "Failed to process order!");
    }
  };

  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this purchase order?")) return;

    try {
      await API.put(`/purchase-orders/${orderId}/cancel`, {});
      alert("Purchase Order Cancelled!");
      fetchOrdersAndDropdowns();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data || "Failed to cancel order!");
    }
  };

  // Create Purchase Order
  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        medicine: { medicineId: parseInt(newOrder.medicineId) },
        supplier: { supplierId: parseInt(newOrder.supplierId) },
        quantity: parseInt(newOrder.quantity),
        expectedDelivery: newOrder.expectedDelivery || null,
      };

      await API.post("/purchase-orders", payload);

      alert("New Purchase Order created successfully!");
      setShowModal(false);
      setNewOrder({ medicineId: "", supplierId: "", quantity: 1, expectedDelivery: "" });
      fetchOrdersAndDropdowns();
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.response?.data || "Failed to create purchase order!");
    }
  };

  // Badge Style 
  const getStatusBadge = (status = "") => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "PARTIALLY_DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Partial
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <PackageX className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  // Search & Status Filter
  const filteredOrders = orders.filter((order) => {
    const medName = order.medicine?.medicineName || "";
    const supName = order.supplier?.supplierName || "";
    const matchesSearch =
      medName.toLowerCase().includes(search.toLowerCase()) ||
      supName.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.toString().includes(search);

    if (!matchesSearch) return false;

    if (statusFilter !== "ALL") {
      return order.status?.toUpperCase() === statusFilter;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading purchase orders...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-orange-500" />
            Purchase Orders
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage supplier purchases, track incoming deliveries, and update inventory stock
          </p>
        </div>

        {(role === "Admin" || role === "Pharmacist") && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Order
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by order ID, medicine, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "PENDING" ? "bg-blue-600 text-white shadow-xs" : "hover:text-blue-600"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("DELIVERED")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "DELIVERED" ? "bg-emerald-600 text-white shadow-xs" : "hover:text-emerald-600"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setStatusFilter("PARTIALLY_DELIVERED")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "PARTIALLY_DELIVERED" ? "bg-amber-500 text-white shadow-xs" : "hover:text-amber-600"
            }`}
          >
            Partial
          </button>
          <button
            onClick={() => setStatusFilter("CANCELLED")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              statusFilter === "CANCELLED" ? "bg-rose-600 text-white shadow-xs" : "hover:text-rose-600"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-4">Medicine</th>
                <th className="p-4">Supplier</th>
                <th className="p-4 text-center">Ordered Qty</th>
                <th className="p-4 text-center w-32">Received Qty</th>
                <th className="p-4 text-center w-32">Damaged Qty</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-center">Status</th>
                {(role === "Admin" || role === "Pharmacist") && (
                  <th className="p-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isPending = order.status?.toUpperCase() === "PENDING";
                  const rowInput = inputValues[order.orderId] || {};

                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-blue-500" />
                          <span>{order.medicine?.medicineName || "N/A"}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.supplier?.supplierName || "N/A"}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                          <Boxes className="w-3.5 h-3.5 text-amber-500" />
                          {order.quantity}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {isPending && (role === "Admin" || role === "Pharmacist") ? (
                          <input
                            type="number"
                            min="0"
                            className="w-20 mx-auto text-center border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={rowInput.receivedQuantity ?? order.quantity}
                            onChange={(e) => handleInputChange(order.orderId, "receivedQuantity", e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-emerald-600">
                            {order.receivedQuantity || 0}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {isPending && (role === "Admin" || role === "Pharmacist") ? (
                          <input
                            type="number"
                            min="0"
                            className="w-20 mx-auto text-center border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-rose-600 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                            value={rowInput.damagedQuantity ?? 0}
                            onChange={(e) => handleInputChange(order.orderId, "damagedQuantity", e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold text-rose-500">
                            {order.damagedQuantity || 0}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {isPending && (role === "Admin" || role === "Pharmacist") ? (
                          <input
                            type="text"
                            placeholder="Add note..."
                            className="w-full border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={rowInput.remarks ?? ""}
                            onChange={(e) => handleInputChange(order.orderId, "remarks", e.target.value)}
                          />
                        ) : (
                          <span className="text-slate-500 italic text-xs">
                            {order.remarks || "—"}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">{getStatusBadge(order.status)}</td>

                      {(role === "Admin" || role === "Pharmacist") && (
                        <td className="p-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReceiveSubmit(order)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
                                title="Confirm Received Stock"
                              >
                                <Check className="w-3.5 h-3.5" /> Confirm
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.orderId)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                                title="Cancel Order"
                              >
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                              <Check className="w-3 h-3 text-slate-400" /> Done
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={role === "Admin" || role === "Pharmacist" ? "8" : "7"}
                    className="text-center py-10 text-slate-400"
                  >
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <ShoppingCart className="text-orange-500 w-5 h-5" /> Create Purchase Order
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Select medicine, supplier, and order quantity
            </p>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Medicine
                </label>
                <select
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  value={newOrder.medicineId}
                  onChange={(e) => setNewOrder({ ...newOrder, medicineId: e.target.value })}
                >
                  <option value="">-- Choose Medicine --</option>
                  {medicines.map((m) => (
                    <option key={m.medicineId} value={m.medicineId}>
                      {m.medicineName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Supplier
                </label>
                <select
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  value={newOrder.supplierId}
                  onChange={(e) => setNewOrder({ ...newOrder, supplierId: e.target.value })}
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expected Delivery Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={newOrder.expectedDelivery}
                  onChange={(e) => setNewOrder({ ...newOrder, expectedDelivery: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrders;