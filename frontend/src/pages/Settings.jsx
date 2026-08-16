import React, { useState, useEffect } from "react";
import API from "../api/Api";
import toast from "react-hot-toast";
import {
  Building2,
  BellRing,
  Save,
  FileText,
  Boxes,
  Clock,
  AlertTriangle,
  Lock,
  Sparkles,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingAlerts, setSavingAlerts] = useState(false);

  const [settings, setSettings] = useState({
    pharmacyName: "",
    licenseNumber: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    lowStockThreshold: 10,
    urgentExpiryDays: 7,
    expiryAlertDays: 60,
  });

  const [originalSettings, setOriginalSettings] = useState({ ...settings });

  const userRole =
    localStorage.getItem("role") || sessionStorage.getItem("role");
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await API.get("/settings");
      if (response.data) {
        const fetchedData = {
          pharmacyName: response.data.pharmacyName || "",
          licenseNumber: response.data.licenseNumber || "",
          contactEmail: response.data.contactEmail || "",
          contactPhone: response.data.contactPhone || "",
          address: response.data.address || "",
          lowStockThreshold: response.data.lowStockThreshold ?? 10,
          urgentExpiryDays: response.data.urgentExpiryDays ?? 7,
          expiryAlertDays: response.data.expiryAlertDays ?? 60,
        };
        setSettings(fetchedData);
        setOriginalSettings(fetchedData);
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
      toast.error("Failed to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  // Tab 1 Specific Save Handler
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSavingGeneral(true);

    const generalPayload = {
      pharmacyName: settings.pharmacyName,
      licenseNumber: settings.licenseNumber,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,

      lowStockThreshold: originalSettings.lowStockThreshold,
      urgentExpiryDays: originalSettings.urgentExpiryDays,
      expiryAlertDays: originalSettings.expiryAlertDays,
    };

    try {
      const response = await API.put("/settings", generalPayload);
      const updatedData = { ...settings, ...response.data };
      setSettings(updatedData);
      setOriginalSettings(updatedData);

      toast.success("Pharmacy profile updated successfully!");
    } catch (err) {
      console.error("Save general settings error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : "") ||
        "Failed to update pharmacy profile.";
      toast.error(errorMsg);
    } finally {
      setSavingGeneral(false);
    }
  };

  // Tab 2 Specific Save Handler
  const handleSaveAlerts = async (e) => {
    e.preventDefault();

    const urgent = Number(settings.urgentExpiryDays);
    const expiringSoon = Number(settings.expiryAlertDays);
    const lowStock = Number(settings.lowStockThreshold);

    if (!urgent || !expiringSoon || !lowStock) {
      toast.error("Please fill in all threshold values.");
      return;
    }

    if (urgent >= expiringSoon) {
      toast.error(
        `Urgent Expiry Window (${urgent} days) must be LESS than Expiring Soon Window (${expiringSoon} days).`
      );
      return;
    }

    if (urgent <= 0 || expiringSoon <= 0 || lowStock <= 0) {
      toast.error("Threshold values must be positive numbers greater than 0.");
      return;
    }

    setSavingAlerts(true);

    const alertsPayload = {
      pharmacyName: originalSettings.pharmacyName,
      licenseNumber: originalSettings.licenseNumber,
      contactEmail: originalSettings.contactEmail,
      contactPhone: originalSettings.contactPhone,
      address: originalSettings.address,

      lowStockThreshold: lowStock,
      urgentExpiryDays: urgent,
      expiryAlertDays: expiringSoon,
    };

    try {
      const response = await API.put("/settings", alertsPayload);
      const updatedData = { ...settings, ...response.data };
      setSettings(updatedData);
      setOriginalSettings(updatedData);

      toast.success("Inventory thresholds & rules updated successfully!");
    } catch (err) {
      console.error("Save alert settings error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : "") ||
        "Failed to update threshold rules.";
      toast.error(errorMsg);
    } finally {
      setSavingAlerts(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full pb-10 min-h-screen bg-slate-50/60 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading system configurations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60 font-sans antialiased">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 ring-4 ring-blue-50">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  System Settings
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Config
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure store profile, automated inventory thresholds, and system preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-8 text-xs font-bold tracking-wide uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 size={16} /> Pharmacy Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "alerts"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BellRing size={16} /> Inventory Thresholds
          </button>
        </div>

        {/* TAB 1: General Pharmacy Info Form */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="text-blue-600" size={16} /> Pharmacy / Business Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pharmacy / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={settings.pharmacyName}
                    onChange={(e) =>
                      setSettings({ ...settings, pharmacyName: e.target.value })
                    }
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-700 transition"
                    placeholder="e.g. MediStock Pharmacy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Drug License / GST No.
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={settings.licenseNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, licenseNumber: e.target.value })
                    }
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-700 transition"
                    placeholder="e.g. DL-20B/123456"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    disabled={!isAdmin}
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-700 transition"
                    placeholder="support@pharmacy.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-700 transition"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Address
                  </label>
                  <textarea
                    rows="3"
                    disabled={!isAdmin}
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-700 transition resize-none"
                    placeholder="Street, City, State, Pincode"
                  />
                </div>
              </div>
            </div>

            {/* Tab 1 Save Button */}
            {isAdmin ? (
              <button
                type="submit"
                disabled={savingGeneral}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition active:scale-98 cursor-pointer disabled:bg-slate-300"
              >
                <Save size={15} />
                {savingGeneral ? "Saving Profile..." : "Save Profile Details"}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Note: Only Administrators can modify system configurations.</span>
              </div>
            )}
          </form>
        )}

        {/* TAB 2: Alerts & Thresholds Form */}
        {activeTab === "alerts" && (
          <form onSubmit={handleSaveAlerts} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BellRing className="text-blue-600" size={16} /> Automated Inventory & Expiry Rules
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Low Stock Input */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 transition hover:border-slate-300">
                  <label className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Boxes size={15} className="text-blue-600" />
                    Low Stock Threshold (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={!isAdmin}
                    value={settings.lowStockThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lowStockThreshold:
                          e.target.value === "" ? "" : e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100 font-bold mt-2"
                  />
                  <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                    Medicines with quantity{" "}
                    <strong className="text-slate-700">equal to or lower than</strong> this limit will
                    trigger <strong className="text-slate-700">Low Stock Alert</strong>.
                  </p>
                </div>

                {/* Urgent Expiry Input */}
                <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-200/60 transition hover:border-orange-300">
                  <label className="text-xs font-bold text-orange-950 mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-orange-600" />
                    Urgent Expiry Window (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={!isAdmin}
                    value={settings.urgentExpiryDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        urgentExpiryDays:
                          e.target.value === "" ? "" : e.target.value,
                      })
                    }
                    className="w-full border border-orange-200/80 rounded-xl p-2.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:bg-slate-100 font-bold mt-2"
                  />
                  <p className="text-[11px] text-orange-800/80 mt-2.5 leading-relaxed">
                    Medicines expiring within{" "}
                    <strong className="text-orange-950">1 to this number of days</strong> will be flagged as{" "}
                    <strong className="text-orange-950">Urgent Alert</strong>.
                  </p>
                </div>

                {/* Expiring Soon Input */}
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/60 transition hover:border-amber-300">
                  <label className="text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <Clock size={15} className="text-amber-600" />
                    Expiring Soon Window (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={!isAdmin}
                    value={settings.expiryAlertDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        expiryAlertDays:
                          e.target.value === "" ? "" : e.target.value,
                      })
                    }
                    className="w-full border border-amber-200/80 rounded-xl p-2.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-slate-100 font-bold mt-2"
                  />
                  <p className="text-[11px] text-amber-800/80 mt-2.5 leading-relaxed">
                    Medicines expiring between{" "}
                    <strong className="text-amber-950">Urgent Days and this limit</strong> will be flagged as{" "}
                    <strong className="text-amber-950">Expiring Soon</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Tab 2 Save Button */}
            {isAdmin ? (
              <button
                type="submit"
                disabled={savingAlerts}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition active:scale-98 cursor-pointer disabled:bg-slate-300"
              >
                <Save size={15} />
                {savingAlerts ? "Saving Thresholds..." : "Save Thresholds"}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Note: Only Administrators can modify system configurations.</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;