import React, { useState } from "react";
import { downloadReport } from "../services/reportService";
import toast from "react-hot-toast"; 
import {
  FileText,
  Table,
  Download,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Activity
} from "lucide-react";

function Reports() {
  const [reportType, setReportType] = useState("INVENTORY");
  const [format, setFormat] = useState("PDF");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadReport(reportType, format);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const reportOptions = [
    {
      id: "INVENTORY",
      title: "Full Inventory Report",
      description:
        "Complete medicine catalogue including stock quantities, pricing, categories, and active supplier details.",
      icon: ShieldCheck,
      badge: "All Stock",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80",
      activeBorder: "border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/30",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      id: "LOW_STOCK",
      title: "Low Stock Alert Report",
      description:
        "List of medicines that have fallen below the minimum stock threshold and require immediate reordering.",
      icon: AlertTriangle,
      badge: "Critical",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80",
      activeBorder: "border-amber-500 bg-amber-50/20 ring-1 ring-amber-500/30",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      id: "EXPIRY",
      title: "Expiry Tracking Report",
      description:
        "Detailed list of expired items or medicines nearing their expiry threshold.",
      icon: Clock,
      badge: "Urgent",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200/80",
      activeBorder: "border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30",
      iconBg: "bg-rose-100 text-rose-600",
    },
    {
      id: "PURCHASE",
      title: "Purchase History Report",
      description:
        "Historical log of stock purchases, restock quantities, and vendor distribution activity over time.",
      icon: ShoppingCart,
      badge: "History",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      activeBorder: "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      id: "STOCK_MOVEMENT",
      title: "Stock Movement Log Report",
      description:
        "Comprehensive audit log of stock sales, expiry removals, damaged items, and additions.",
      icon: Activity,
      badge: "Audit Log",
      badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      activeBorder: "border-indigo-500 bg-indigo-50/20 ring-1 ring-indigo-500/30",
      iconBg: "bg-indigo-100 text-indigo-600",
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2.5">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" /> Reports & Data Export
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                <Sparkles className="w-3 h-3 text-amber-500" /> Real-time
              </span>
            </div>
            <p className="text-slate-500 mt-0.5 text-sm">
              Generate and download real-time inventory and operational reports
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8"> 
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
            1. Select Report Type
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportOptions.map((item) => {
              const IconComponent = item.icon;
              const isSelected = reportType === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setReportType(item.id)}
                  className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${item.activeBorder} shadow-sm`
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className={`p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110 ${item.iconBg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeStyle}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mb-1.5">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {isSelected ? "Selected" : "Click to select"}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
            2. Choose Export Format
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-md gap-3">
            <button
              type="button"
              onClick={() => setFormat("PDF")}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                format === "PDF"
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm ring-1 ring-rose-400/30"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5 text-rose-600" />
              PDF Document
            </button>

            <button
              type="button"
              onClick={() => setFormat("EXCEL")}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                format === "EXCEL"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm ring-1 ring-emerald-400/30"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Table className="w-5 h-5 text-emerald-600" />
              Excel Sheet (.xlsx)
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              Configured: <strong className="text-slate-700">{reportType}</strong> in{" "}
              <strong className="text-slate-700">{format}</strong> format.
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow transition-colors cursor-pointer ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;