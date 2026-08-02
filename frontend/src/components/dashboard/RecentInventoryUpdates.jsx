import React, { useEffect, useState } from "react";
import { ArrowRight, History, PackageCheck } from "lucide-react";
import API from "../../api/Api";
import { useNavigate } from "react-router-dom";

function RecentInventoryUpdates() {
  const [recentMedicines, setRecentMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecentMedicines = async () => {
    try {
      const res = await API.get("/inventory/recent-medicines");
      if (res && res.data && Array.isArray(res.data)) {
        setRecentMedicines(res.data);
      } else {
        setRecentMedicines([]);
      }
    } catch (error) {
      console.error("Error fetching recent inventory updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";

    return `${days}d ago`;
  };

  useEffect(() => {
    fetchRecentMedicines();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <History size={18} />
          </div>
          <h2 className="text-xl font-medium text-gray-900">
            Recent Updates
          </h2>
        </div>
        <button
          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold flex items-center gap-1 transition cursor-pointer text-sm"
          onClick={() => navigate("/dashboard/inventory")}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            Loading updates...
          </div>
        ) : recentMedicines.length > 0 ? (
          recentMedicines.slice(0, 3).map((medicine, index) => (
            <div
              key={medicine.medicineId || index}
              className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 flex justify-between items-center hover:bg-emerald-50 transition"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {medicine.medicineName}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Updated: {getTimeAgo(medicine.lastUpdated)}
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <PackageCheck size={12} />
                  {medicine.quantity} In Stock
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            No recent inventory updates found.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentInventoryUpdates;