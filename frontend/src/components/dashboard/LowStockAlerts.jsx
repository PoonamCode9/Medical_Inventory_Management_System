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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-center pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={18} />
          </div>
          <h2 className="text-xl font-medium text-gray-900">Low Stock Alerts</h2>
        </div>
        <button
          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 transition cursor-pointer "
          onClick={() => navigate("/dashboard/inventory")}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Alert List */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            Loading alerts...
          </div>
        ) : lowStockAlerts.length > 0 ? (
          lowStockAlerts.slice(0, 3).map((alert, index) => {
            const stockQty = alert.quantity ?? alert.remainingQuantity ?? 0;

            return (
              <div
                key={alert.medicineId || index}
                className="bg-amber-50/50 border border-amber-100 rounded-lg p-3.5 flex justify-between items-center hover:bg-amber-50 transition"
              >
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {alert.medicineName}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Batch: {alert.batchNo || "N/A"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {stockQty} Left
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            All medicines have sufficient stock! 👍
          </div>
        )}
      </div>
    </div>
  );
}

export default LowStockAlerts;