import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Pill,
  Users,
  PackageX,
  Download,
  Plus,
  FileSpreadsheet,
  FileText,
  X,
  Loader2,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ExpiryAlertsCard from "../components/dashboard/ExpiryAlertsCard";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import InventoryChart from "../components/dashboard/InventoryChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import PurchaseSummary from "../components/dashboard/PurchaseSummary";
import SuppliersCard from "../components/dashboard/SuppliersCard";
import API from "../api/Api";
import { useNavigate } from "react-router-dom";
import { downloadReport } from "../services/reportService";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalUsers: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [loading, setLoading] = useState(true);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportType, setReportType] = useState("STOCK_MOVEMENT");
  const [reportFormat, setReportFormat] = useState("PDF");
  const [isExporting, setIsExporting] = useState(false);

  const loadDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Report Download
  const handleDownloadReport = async (e) => {
    e.preventDefault();
    setIsExporting(true);

    try {
      await downloadReport(reportType, reportFormat);
      setShowExportModal(false);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again.");
    } font-medium;
      setIsExporting(false);
  };

  return (
    <div className="w-full pb-10 bg-slate-50/50 min-h-screen">
      <div className="mx-6 mt-6 mb-6 p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome Back, <span className="text-blue-400">{role}</span>!
            </h1>
            <span className="bg-blue-500/20 backdrop-blur-md text-blue-100 border border-blue-400/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {role}
            </span>
          </div>
          <p className="text-slate-300 text-xs mt-1.5 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-blue-400" />
            Real-time analytics, stock movement monitoring, and supplier
            operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {(role === "Admin" || role === "Pharmacist") && (
            <button
              onClick={() => navigate("/dashboard/inventory")}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
            >
              <Plus size={15} /> Add Stock
            </button>
          )}

          {(role === "Admin" || role === "Pharmacist") && (
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer backdrop-blur-md"
            >
              <Download size={14} /> Export Reports
            </button>
          )}
        </div>
      </div>

      {role === "Admin" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={<Pill size={18} className="text-blue-600" />}
              iconBg="bg-blue-50"
              cardBg="from-blue-100/50 to-white"
              borderColor="border-blue-200"
            />
            <StatCard
              title="Total Suppliers"
              value={stats.totalSuppliers}
              icon={<Building2 size={18} className="text-emerald-600" />}
              iconBg="bg-emerald-50"
              cardBg="from-emerald-100/50 to-white"
              borderColor="border-emerald-200"
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users size={18} className="text-indigo-600" />}
              iconBg="bg-indigo-50"
              cardBg="from-indigo-100/50 to-white"
              borderColor="border-indigo-200"
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              icon={<AlertTriangle size={18} className="text-amber-600" />}
              iconBg="bg-amber-50"
              cardBg="from-amber-100/50 to-white"
              borderColor="border-amber-200"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStock}
              icon={<PackageX size={18} className="text-rose-600" />}
              iconBg="bg-rose-50"
              cardBg="from-rose-100/50 to-white"
              borderColor="border-rose-200"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
            <InventoryChart />
            <CategoryChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            <SuppliersCard />
            <ExpiryAlertsCard />
            <LowStockAlerts />
          </div>
        </div>
      )}

      {role === "Pharmacist" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={<Pill size={18} className="text-blue-600" />}
              iconBg="bg-blue-50"
              cardBg="from-blue-100/50 to-white"
              borderColor="border-blue-200"
            />
            <StatCard
              title="Total Suppliers"
              value={stats.totalSuppliers}
              icon={<Building2 size={18} className="text-emerald-600" />}
              iconBg="bg-emerald-50"
              cardBg="from-emerald-100/50 to-white"
              borderColor="border-emerald-200"
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStock}
              icon={<AlertTriangle size={18} className="text-amber-600" />}
              iconBg="bg-amber-50"
              cardBg="from-amber-100/50 to-white"
              borderColor="border-amber-200"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStock}
              icon={<PackageX size={18} className="text-rose-600" />}
              iconBg="bg-rose-50"
              cardBg="from-rose-100/50 to-white"
              borderColor="border-rose-200"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
            <InventoryChart />
            <CategoryChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            <ExpiryAlertsCard />
            <LowStockAlerts />
            <PurchaseSummary />
          </div>
        </div>
      )}

      {role === "Staff" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={<Pill size={18} className="text-blue-600" />}
              iconBg="bg-blue-50"
              cardBg="from-blue-100/50 to-white"
              borderColor="border-blue-200"
            />
            <StatCard
              title="Low Stock Items"
              value={stats.lowStock}
              icon={<AlertTriangle size={18} className="text-amber-600" />}
              iconBg="bg-amber-50"
              cardBg="from-amber-100/50 to-white"
              borderColor="border-amber-200"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStock}
              icon={<PackageX size={18} className="text-rose-600" />}
              iconBg="bg-rose-50"
              cardBg="from-rose-100/50 to-white"
              borderColor="border-rose-200"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
            <InventoryChart />
            <CategoryChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
            <ExpiryAlertsCard />
            <LowStockAlerts />
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Download className="text-blue-600" size={18} /> Export Inventory
              Reports
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Select report type and format to generate instant report.
            </p>

            <form onSubmit={handleDownloadReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Type
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium text-slate-700"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="STOCK_MOVEMENT">
                    Stock Movement Log Report
                  </option>
                  <option value="INVENTORY">Inventory Stock Report</option>
                  <option value="EXPIRY">Expiry Tracker Report</option>
                  <option value="PURCHASE">Purchase Orders Report</option>
                  <option value="SUPPLIER">Suppliers Summary Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReportFormat("PDF")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      reportFormat === "PDF"
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText size={15} /> PDF Document
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportFormat("EXCEL")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      reportFormat === "EXCEL"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileSpreadsheet size={15} /> Excel Sheet
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExporting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    "Download Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;