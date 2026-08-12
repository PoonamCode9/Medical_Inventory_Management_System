import React, { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";

function LowStockAlerts() {
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLowStockAlerts = async () => {
    try {
      const res = await API.get("/dashboard/low-stock-alerts");
      setLowStockAlerts(res.data);
    } catch (err) {
      console.error("Error fetching low stock alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Low Stock Items
              </h2>
              <p className="text-[11px] text-slate-400">
                Medicines requiring reorder
              </p>
            </div>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
            onClick={() => navigate("/dashboard/inventory")}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {loading ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Loading alerts...
            </div>
          ) : lowStockAlerts.length > 0 ? (
            lowStockAlerts.slice(0, 3).map((alert, index) => {
              const stockQty = alert.quantity ?? alert.remainingQuantity ?? 0;

              return (
                <div
                  key={alert.medicineId || index}
                  className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 flex justify-between items-center hover:bg-slate-100/60 transition"
                >
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-800 text-xs">
                      {alert.medicineName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Batch:{" "}
                      <span className="text-slate-600">
                        {alert.batchNo || "N/A"}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <AlertTriangle size={11} />
                      {stockQty} Left
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-emerald-600 font-medium text-xs">
              All medicines have sufficient stock!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LowStockAlerts;