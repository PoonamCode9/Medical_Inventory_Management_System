import React, { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertOctagon, ShieldAlert } from "lucide-react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";

function ExpiryAlertsCard() {
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExpiryAlerts = async () => {
    try {
      const res = await API.get("/expiry-alerts");
      if (res && res.data && Array.isArray(res.data)) {
        const alertsOnly = res.data.filter((item) => item.status !== "Active");

        alertsOnly.sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));

        setExpiryAlerts(alertsOnly);
      } else {
        setExpiryAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching expiry alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  const getBadgeStyle = (status, daysLeft) => {
    if (status === "Expired" || daysLeft < 0) {
      return {
        bg: "bg-red-100 text-red-800 border-red-200",
        label: "Expired",
        icon: <AlertOctagon size={12} />,
      };
    } else if (status === "Urgent" || daysLeft <= 7) {
      return {
        bg: "bg-rose-100 text-rose-800 border-rose-200",
        label: daysLeft === 0 ? "Expires Today" : `${daysLeft}d Left`,
        icon: <ShieldAlert size={12} />,
      };
    } else {
      return {
        bg: "bg-orange-100 text-orange-800 border-orange-200",
        label: `${daysLeft}d Left`,
        icon: <Clock size={12} />,
      };
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-center pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Clock size={18} />
          </div>
          <h2 className="text-xl font-medium text-gray-900">Expiry Alerts</h2>
        </div>
        <button
          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 transition cursor-pointer text-sm"
          onClick={() => navigate("/dashboard/expiry-tracker")}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            Loading expiry alerts...
          </div>
        ) : expiryAlerts.length > 0 ? (
          expiryAlerts.slice(0, 3).map((alert, index) => {
            const badge = getBadgeStyle(alert.status, alert.daysLeft);
            const itemKey =
              alert.inventoryId ||
              `${alert.medicineId}-${alert.batchNo}` ||
              index;

            return (
              <div
                key={itemKey}
                className="bg-red-50/40 border border-red-100 rounded-lg p-3.5 flex justify-between items-center hover:bg-red-50 transition"
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
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${badge.bg}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-emerald-600 font-medium text-sm">
            No medicines near expiry!
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpiryAlertsCard;
