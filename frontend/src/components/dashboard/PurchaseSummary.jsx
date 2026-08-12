import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  ArrowRight,
  Clock,
  CheckCircle2,
  PackageX,
  AlertTriangle,
} from "lucide-react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";

function PurchaseSummary() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/purchase-orders");
        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching purchase orders for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status = "") => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={11} /> Delivered
          </span>
        );
      case "PARTIALLY_DELIVERED":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle size={11} /> Partial
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <PackageX size={11} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Clock size={11} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Purchase Summary
              </h2>
              <p className="text-[11px] text-slate-400">
                Recent supplier purchase orders
              </p>
            </div>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
            onClick={() => navigate("/dashboard/purchase-orders")}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {loading ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Loading purchases...
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 flex justify-between items-center hover:bg-slate-100/60 transition"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {order.medicine?.medicineName || "Medicine"}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Supplier:{" "}
                    <span className="text-slate-600 font-medium">
                      {order.supplier?.supplierName || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-slate-700">
                    {order.quantity} Units
                  </span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No recent purchase orders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchaseSummary;
