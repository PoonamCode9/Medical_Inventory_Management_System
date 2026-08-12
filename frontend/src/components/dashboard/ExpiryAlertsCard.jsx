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
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Expired",
        icon: <AlertOctagon size={11} />,
      };
    } else if (status === "Urgent" || daysLeft <= 7) {
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-200",
        label: daysLeft === 0 ? "Expires Today" : `${daysLeft}d Left`,
        icon: <ShieldAlert size={11} />,
      };
    } else {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        label: `${daysLeft}d Left`,
        icon: <Clock size={11} />,
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Expiring Medicines
              </h2>
              <p className="text-[11px] text-slate-400">
                Items near or past expiration
              </p>
            </div>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
            onClick={() => navigate("/dashboard/expiry-tracker")}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {loading ? (
            <div className="text-center py-6 text-slate-400 text-xs">
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-emerald-600 font-medium text-xs">
              No medicines near expiry!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpiryAlertsCard;
