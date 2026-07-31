import React, { useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard, Package, Truck, Calendar, Bell, ClipboardList,
  Search, Plus, Pencil, Trash2, X, ChevronDown, ShieldCheck,
  AlertTriangle, TrendingUp, Users, PackageX, PackageCheck,
  Download, Pill, ArrowUpRight, Filter, CircleAlert, Check,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, AreaChart, Area,
} from "recharts";

/* ============================== CONSTANTS ============================== */

const TODAY = new Date("2026-07-02");

const CATEGORIES = [
  "Analgesics", "Antibiotics", "Antipyretics", "Antacids",
  "Vitamins & Supplements", "Cardiac Care", "Diabetes Care",
  "Antiseptics", "Antihistamines",
];

const UNITS = ["tablet", "capsule", "bottle", "vial", "ml", "syrup", "strip"];

const ROLES = ["Admin", "Pharmacist", "Staff"];

const CATEGORY_COLORS = {
  "Analgesics": "#1E6F6E",
  "Antibiotics": "#A93E3E",
  "Antipyretics": "#C08A2E",
  "Antacids": "#5E7CE2",
  "Vitamins & Supplements": "#3F7A52",
  "Cardiac Care": "#8A4B9E",
  "Diabetes Care": "#B9622E",
  "Antiseptics": "#2E8FA3",
  "Antihistamines": "#9E7B4B",
};

const initialSuppliers = [
  { id: "S-01", name: "MedSource Pharma", contact: "+91 98765 43210", email: "contact@medsource.example", address: "12 Industrial Rd, Chennai, TN", performance: 92 },
  { id: "S-02", name: "Global Health Distributors", contact: "+91 90123 45678", email: "sales@ghdist.example", address: "4th Cross, Bengaluru, KA", performance: 78 },
  { id: "S-03", name: "CarePlus Supplies", contact: "+91 91234 56789", email: "hello@careplus.example", address: "22 Anna Salai, Chennai, TN", performance: 88 },
  { id: "S-04", name: "Wellness Pharma Co.", contact: "+91 99887 76655", email: "orders@wellnesspharma.example", address: "8 MG Road, Coimbatore, TN", performance: 65 },
  { id: "S-05", name: "Apex Medical Traders", contact: "+91 93456 12378", email: "info@apexmed.example", address: "17 Nehru St, Hyderabad, TS", performance: 81 },
  { id: "S-06", name: "PureLife Pharmaceuticals", contact: "+91 97654 32109", email: "support@purelife.example", address: "3 Lake View, Pune, MH", performance: 95 },
];

const initialMedicines = [
  { id: "M-01", name: "Paracetamol 500mg", batchNumber: "BN-24011-A", category: "Analgesics", supplierId: "S-01", quantity: 420, reorderLevel: 100, mfgDate: "2025-01-10", expiryDate: "2027-01-10", price: 0.05, unit: "tablet" },
  { id: "M-02", name: "Amoxicillin 250mg", batchNumber: "BN-24087-C", category: "Antibiotics", supplierId: "S-02", quantity: 60, reorderLevel: 80, mfgDate: "2025-08-01", expiryDate: "2026-08-01", price: 0.12, unit: "capsule" },
  { id: "M-03", name: "Ibuprofen 400mg", batchNumber: "BN-24033-B", category: "Analgesics", supplierId: "S-03", quantity: 300, reorderLevel: 100, mfgDate: "2025-03-01", expiryDate: "2027-03-01", price: 0.08, unit: "tablet" },
  { id: "M-04", name: "Omeprazole 20mg", batchNumber: "BN-23120-D", category: "Antacids", supplierId: "S-04", quantity: 15, reorderLevel: 50, mfgDate: "2024-12-01", expiryDate: "2026-07-15", price: 0.15, unit: "capsule" },
  { id: "M-05", name: "Metformin 500mg", batchNumber: "BN-24051-E", category: "Diabetes Care", supplierId: "S-05", quantity: 200, reorderLevel: 60, mfgDate: "2025-05-01", expiryDate: "2027-05-01", price: 0.09, unit: "tablet" },
  { id: "M-06", name: "Atorvastatin 10mg", batchNumber: "BN-24022-F", category: "Cardiac Care", supplierId: "S-06", quantity: 5, reorderLevel: 40, mfgDate: "2025-02-01", expiryDate: "2026-06-20", price: 0.20, unit: "tablet" },
  { id: "M-07", name: "Vitamin C 500mg", batchNumber: "BN-24061-G", category: "Vitamins & Supplements", supplierId: "S-01", quantity: 500, reorderLevel: 150, mfgDate: "2025-06-01", expiryDate: "2027-06-01", price: 0.04, unit: "tablet" },
  { id: "M-08", name: "Azithromycin 250mg", batchNumber: "BN-24092-H", category: "Antibiotics", supplierId: "S-02", quantity: 90, reorderLevel: 70, mfgDate: "2025-09-01", expiryDate: "2026-09-01", price: 0.25, unit: "capsule" },
  { id: "M-09", name: "Aspirin 75mg", batchNumber: "BN-24041-I", category: "Cardiac Care", supplierId: "S-03", quantity: 250, reorderLevel: 80, mfgDate: "2025-04-01", expiryDate: "2027-04-01", price: 0.03, unit: "tablet" },
  { id: "M-10", name: "Loratadine 10mg", batchNumber: "BN-24071-J", category: "Antihistamines", supplierId: "S-04", quantity: 40, reorderLevel: 50, mfgDate: "2025-07-01", expiryDate: "2026-07-25", price: 0.10, unit: "tablet" },
  { id: "M-11", name: "Insulin Glargine", batchNumber: "BN-24101-K", category: "Diabetes Care", supplierId: "S-05", quantity: 25, reorderLevel: 30, mfgDate: "2025-10-01", expiryDate: "2026-10-01", price: 18.50, unit: "vial" },
  { id: "M-12", name: "Povidone Iodine Solution", batchNumber: "BN-24015-L", category: "Antiseptics", supplierId: "S-06", quantity: 70, reorderLevel: 40, mfgDate: "2025-01-15", expiryDate: "2027-01-15", price: 1.20, unit: "bottle" },
  { id: "M-13", name: "Multivitamin Syrup", batchNumber: "BN-23110-M", category: "Vitamins & Supplements", supplierId: "S-01", quantity: 0, reorderLevel: 30, mfgDate: "2024-11-01", expiryDate: "2026-05-01", price: 3.50, unit: "syrup" },
  { id: "M-14", name: "Ranitidine 150mg", batchNumber: "BN-24032-N", category: "Antacids", supplierId: "S-03", quantity: 110, reorderLevel: 50, mfgDate: "2025-03-15", expiryDate: "2027-03-15", price: 0.07, unit: "tablet" },
  { id: "M-15", name: "Ceftriaxone Injection", batchNumber: "BN-24111-O", category: "Antibiotics", supplierId: "S-02", quantity: 35, reorderLevel: 40, mfgDate: "2025-11-01", expiryDate: "2026-08-15", price: 2.10, unit: "vial" },
];

/* =============================== HELPERS ================================ */

const daysBetween = (a, b) => Math.round((a - b) / (1000 * 60 * 60 * 24));

const getExpiryInfo = (expiryDate, mfgDate) => {
  const exp = new Date(expiryDate);
  const mfg = new Date(mfgDate);
  const days = daysBetween(exp, TODAY);
  const totalLife = Math.max(daysBetween(exp, mfg), 1);
  const elapsed = Math.max(daysBetween(TODAY, mfg), 0);
  const pctUsed = Math.min(Math.max((elapsed / totalLife) * 100, 0), 100);
  let status, color;
  if (days < 0) { status = "Expired"; color = "red"; }
  else if (days <= 30) { status = "Critical"; color = "red"; }
  else if (days <= 90) { status = "Near expiry"; color = "amber"; }
  else { status = "Fresh"; color = "green"; }
  return { days, status, color, pctUsed };
};

const getStockInfo = (quantity, reorderLevel) => {
  if (quantity === 0) return { status: "Out of stock", color: "red" };
  if (quantity <= reorderLevel) return { status: "Low stock", color: "amber" };
  return { status: "In stock", color: "green" };
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const formatCurrency = (v) => `₹${v.toFixed(2)}`;

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const exportCSV = (rows, headers, filename) => {
  const csv = [headers.map((h) => h.label).join(",")]
    .concat(rows.map((r) => headers.map((h) => `"${String(r[h.key] ?? "").replace(/"/g, '""')}"`).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* =============================== STYLES ================================= */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .ms-app {
      --paper: #F6F5EF;
      --paper-raised: #FFFFFF;
      --ink: #16241F;
      --ink-soft: #5B6B62;
      --teal-900: #0E3A3B;
      --teal-800: #12484A;
      --teal-600: #1E6F6E;
      --teal-100: #DCEAE6;
      --amber: #B9822C;
      --amber-soft: #F3E4C6;
      --red: #A63E3E;
      --red-soft: #F3DCDA;
      --green: #3F7A52;
      --green-soft: #DEEBE1;
      --line: #E1DFD2;
      font-family: 'Inter', sans-serif;
      color: var(--ink);
      background: var(--paper);
      min-height: 100vh;
      display: flex;
      position: relative;
    }
    .ms-app * { box-sizing: border-box; }
    .ms-mono { font-family: 'IBM Plex Mono', monospace; }
    .ms-display { font-family: 'Newsreader', serif; }

    /* ---------- Sidebar ---------- */
    .ms-sidebar {
      width: 232px; flex-shrink: 0; background: var(--teal-900); color: #EAF3F1;
      display: flex; flex-direction: column; padding: 22px 14px;
      background-image: radial-gradient(circle at 1px 1px, rgba(234,243,241,0.05) 1.4px, transparent 0);
      background-size: 14px 14px;
    }
    .ms-brand { display: flex; align-items: center; gap: 9px; padding: 4px 8px 22px 8px; }
    .ms-brand-mark {
      width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg,#EAF3F1,#BFE0D8);
      display: flex; align-items: center; justify-content: center; color: var(--teal-900); flex-shrink:0;
    }
    .ms-brand-name { font-family: 'Newsreader', serif; font-size: 19px; font-weight: 600; letter-spacing: 0.2px; }
    .ms-brand-sub { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #9FC2BB; margin-top: -2px; }

    .ms-nav { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .ms-nav-item {
      display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 9px;
      font-size: 13.5px; font-weight: 500; color: #BFDAD4; cursor: pointer; border: none;
      background: transparent; text-align: left; width: 100%; transition: background .12s, color .12s;
    }
    .ms-nav-item:hover { background: rgba(234,243,241,0.08); color: #EAF3F1; }
    .ms-nav-item.active { background: #EAF3F1; color: var(--teal-900); }
    .ms-nav-badge {
      margin-left: auto; background: var(--red); color: white; font-size: 10.5px; font-weight: 600;
      padding: 1px 6px; border-radius: 20px;
    }
    .ms-nav-item.active .ms-nav-badge { background: var(--red); color: white; }

    .ms-sidebar-footer { margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(234,243,241,0.12); }
    .ms-role-box { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9FC2BB; }

    /* ---------- Main ---------- */
    .ms-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .ms-topbar {
      display: flex; align-items: center; gap: 16px; padding: 16px 28px; border-bottom: 1px solid var(--line);
      background: var(--paper-raised);
    }
    .ms-search { position: relative; flex: 1; max-width: 420px; }
    .ms-search input {
      width: 100%; padding: 9px 12px 9px 36px; border-radius: 8px; border: 1px solid var(--line);
      background: var(--paper); font-size: 13.5px; color: var(--ink); outline: none;
    }
    .ms-search input:focus { border-color: var(--teal-600); }
    .ms-search svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--ink-soft); }

    .ms-role-select {
      display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 8px;
      border: 1px solid var(--line); background: var(--paper); font-size: 12.5px; font-weight: 500; cursor: pointer;
    }
    .ms-bell { position: relative; padding: 8px; border-radius: 8px; cursor: pointer; border: 1px solid var(--line); background: var(--paper-raised); }
    .ms-bell:hover { background: var(--paper); }
    .ms-bell-dot { position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--red); border: 2px solid var(--paper-raised); }

    .ms-content { flex: 1; padding: 26px 28px 40px; overflow-y: auto; }

    .ms-page-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
    .ms-page-title { font-family: 'Newsreader', serif; font-size: 26px; font-weight: 600; }
    .ms-page-sub { color: var(--ink-soft); font-size: 13px; margin-top: 3px; }
    .ms-eyebrow { font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: var(--teal-600); font-weight: 600; margin-bottom: 4px; }

    .ms-btn {
      display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 8px;
      font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: opacity .12s;
    }
    .ms-btn:hover { opacity: 0.88; }
    .ms-btn-primary { background: var(--teal-900); color: #EAF3F1; }
    .ms-btn-secondary { background: var(--paper-raised); color: var(--ink); border-color: var(--line); }
    .ms-btn-danger { background: var(--red-soft); color: var(--red); }
    .ms-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .ms-btn-icon { padding: 7px; border-radius: 7px; background: transparent; border: 1px solid var(--line); cursor: pointer; }
    .ms-btn-icon:hover { background: var(--paper); }

    /* ---------- Cards / stats ---------- */
    .ms-grid { display: grid; gap: 14px; }
    .ms-stat-grid { grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); margin-bottom: 22px; }
    .ms-card {
      background: var(--paper-raised); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px;
    }
    .ms-stat-card { display: flex; flex-direction: column; gap: 8px; }
    .ms-stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .ms-stat-value { font-family: 'Newsreader', serif; font-size: 28px; font-weight: 600; line-height: 1; }
    .ms-stat-label { font-size: 12px; color: var(--ink-soft); }

    .ms-panel-grid { grid-template-columns: 1.3fr 1fr; }
    @media (max-width: 980px) { .ms-panel-grid { grid-template-columns: 1fr; } }
    .ms-panel-title { font-size: 14.5px; font-weight: 600; margin-bottom: 14px; display:flex; align-items:center; justify-content:space-between; }

    /* ---------- Shelf-life bar (signature element) ---------- */
    .ms-shelf { display: flex; flex-direction: column; gap: 4px; min-width: 128px; }
    .ms-shelf-track {
      position: relative; height: 6px; border-radius: 4px;
      background: linear-gradient(90deg, var(--green) 0%, var(--green) 55%, var(--amber) 75%, var(--red) 100%);
      opacity: 0.85;
    }
    .ms-shelf-marker {
      position: absolute; top: 50%; width: 10px; height: 10px; border-radius: 50%;
      background: var(--paper-raised); border: 2.5px solid var(--ink); transform: translate(-50%, -50%);
    }
    .ms-shelf-label { font-size: 10.5px; font-family: 'IBM Plex Mono', monospace; color: var(--ink-soft); }

    /* ---------- Table ---------- */
    .ms-table-wrap { background: var(--paper-raised); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
    table.ms-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .ms-table th {
      text-align: left; padding: 11px 14px; font-size: 10.5px; letter-spacing: 0.8px; text-transform: uppercase;
      color: var(--ink-soft); border-bottom: 1px solid var(--line); background: var(--paper); font-weight: 600;
    }
    .ms-table td { padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
    .ms-table tr:last-child td { border-bottom: none; }
    .ms-table tr:hover td { background: rgba(30,111,110,0.035); }
    .ms-row-name { font-weight: 600; }
    .ms-row-sub { color: var(--ink-soft); font-size: 11.5px; }

    .ms-pill {
      display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
    }
    .ms-pill-red { background: var(--red-soft); color: var(--red); }
    .ms-pill-amber { background: var(--amber-soft); color: var(--amber); }
    .ms-pill-green { background: var(--green-soft); color: var(--green); }
    .ms-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .ms-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .ms-select {
      padding: 8px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--paper-raised);
      font-size: 12.5px; color: var(--ink); cursor: pointer;
    }

    .ms-empty { text-align: center; padding: 60px 20px; color: var(--ink-soft); }
    .ms-empty svg { margin-bottom: 10px; opacity: 0.5; }

    /* ---------- Modal ---------- */
    .ms-modal-overlay {
      position: fixed; inset: 0; background: rgba(14,30,29,0.45); display: flex; align-items: center;
      justify-content: center; z-index: 50; padding: 20px;
    }
    .ms-modal {
      background: var(--paper-raised); border-radius: 14px; width: 100%; max-width: 560px; max-height: 88vh;
      overflow-y: auto; padding: 26px; border: 1px solid var(--line);
    }
    .ms-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .ms-modal-title { font-family: 'Newsreader', serif; font-size: 20px; font-weight: 600; }
    .ms-field { margin-bottom: 14px; }
    .ms-field label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-soft); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ms-field input, .ms-field select {
      width: 100%; padding: 9px 11px; border-radius: 8px; border: 1px solid var(--line); background: var(--paper);
      font-size: 13.5px; color: var(--ink); outline: none;
    }
    .ms-field input:focus, .ms-field select:focus { border-color: var(--teal-600); }
    .ms-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ms-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

    /* ---------- Toast ---------- */
    .ms-toast {
      position: fixed; bottom: 22px; right: 22px; background: var(--teal-900); color: #EAF3F1;
      padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex;
      align-items: center; gap: 9px; z-index: 60; box-shadow: 0 8px 24px rgba(14,58,59,0.25);
    }

    /* ---------- Alerts list ---------- */
    .ms-alert-item { display: flex; gap: 12px; padding: 13px 14px; border-bottom: 1px solid var(--line); align-items: flex-start; }
    .ms-alert-item:last-child { border-bottom: none; }
    .ms-alert-icon { width: 30px; height: 30px; border-radius: 8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ms-alert-title { font-size: 13.5px; font-weight: 600; }
    .ms-alert-sub { font-size: 12px; color: var(--ink-soft); margin-top: 1px; }

    .ms-legend { display:flex; gap:16px; flex-wrap:wrap; font-size:11.5px; color: var(--ink-soft); margin-top:10px; }
    .ms-legend span { display:flex; align-items:center; gap:5px; }
    .ms-legend i { width:8px; height:8px; border-radius:50%; display:inline-block; }
  `}</style>
);

/* ============================== SUBCOMPONENTS ============================ */

const StatCard = ({ icon, label, value, tint, sub }) => (
  <div className="ms-card ms-stat-card">
    <div className="ms-stat-icon" style={{ background: tint.soft, color: tint.solid }}>{icon}</div>
    <div className="ms-stat-value">{value}</div>
    <div className="ms-stat-label">{label}{sub ? <span style={{ color: tint.solid, marginLeft: 6 }}>{sub}</span> : null}</div>
  </div>
);

const StatusPill = ({ color, children }) => (
  <span className={`ms-pill ms-pill-${color}`}><span className="ms-pill-dot" />{children}</span>
);

const ShelfLifeBar = ({ expiryDate, mfgDate }) => {
  const { pctUsed, days } = getExpiryInfo(expiryDate, mfgDate);
  return (
    <div className="ms-shelf">
      <div className="ms-shelf-track">
        <div className="ms-shelf-marker" style={{ left: `${pctUsed}%` }} />
      </div>
      <div className="ms-shelf-label">{days < 0 ? `${Math.abs(days)}d expired` : `${days}d left`}</div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button className={`ms-nav-item${active ? " active" : ""}`} onClick={onClick}>
    {icon}<span>{label}</span>
    {badge ? <span className="ms-nav-badge">{badge}</span> : null}
  </button>
);

/* ================================ APP ==================================== */

export default function MediStockApp() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [role, setRole] = useState("Admin");
  const [view, setView] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [expiryFilter, setExpiryFilter] = useState("All");

  const [medModal, setMedModal] = useState(null); // {mode:'add'|'edit', data}
  const [supModal, setSupModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null); // {type, id, name}
  const [toast, setToast] = useState(null);

  const canEdit = role === "Admin" || role === "Pharmacist";
  const canDelete = role === "Admin";

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name || "Unknown";

  /* ---------- derived data ---------- */
  const enriched = useMemo(() => medicines.map((m) => ({
    ...m,
    expiry: getExpiryInfo(m.expiryDate, m.mfgDate),
    stock: getStockInfo(m.quantity, m.reorderLevel),
  })), [medicines]);

  const filtered = useMemo(() => enriched.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [m.name, m.batchNumber, m.category, supplierName(m.supplierId)]
      .some((f) => f.toLowerCase().includes(q));
    const matchesCat = categoryFilter === "All" || m.category === categoryFilter;
    const matchesStock = stockFilter === "All" || m.stock.status === stockFilter;
    const matchesExpiry = expiryFilter === "All" || m.expiry.status === expiryFilter;
    return matchesSearch && matchesCat && matchesStock && matchesExpiry;
  }), [enriched, search, categoryFilter, stockFilter, expiryFilter, suppliers]);

  const lowStockCount = enriched.filter((m) => m.stock.status !== "In stock").length;
  const expiringCount = enriched.filter((m) => m.expiry.status === "Critical" || m.expiry.status === "Near expiry").length;
  const expiredCount = enriched.filter((m) => m.expiry.status === "Expired").length;
  const outOfStockCount = enriched.filter((m) => m.stock.status === "Out of stock").length;
  const totalUnits = enriched.reduce((s, m) => s + m.quantity, 0);
  const alertCount = lowStockCount + expiringCount + expiredCount;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    enriched.forEach((m) => { map[m.category] = (map[m.category] || 0) + m.quantity; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [enriched]);

  const supplierStock = useMemo(() => suppliers.map((s) => ({
    name: s.name.split(" ")[0],
    units: enriched.filter((m) => m.supplierId === s.id).reduce((sum, m) => sum + m.quantity, 0),
  })), [suppliers, enriched]);

  const expiryQueue = useMemo(() =>
    [...enriched].sort((a, b) => a.expiry.days - b.expiry.days), [enriched]);

  const alerts = useMemo(() => {
    const list = [];
    enriched.forEach((m) => {
      if (m.expiry.status === "Expired") list.push({ type: "expired", medicine: m });
      else if (m.expiry.status === "Critical") list.push({ type: "expiring", medicine: m });
      if (m.stock.status === "Out of stock") list.push({ type: "out", medicine: m });
      else if (m.stock.status === "Low stock") list.push({ type: "low", medicine: m });
    });
    return list;
  }, [enriched]);

  /* ---------- handlers ---------- */
  const openAddMedicine = () => setMedModal({ mode: "add", data: {
    name: "", batchNumber: "", category: CATEGORIES[0], supplierId: suppliers[0]?.id || "",
    quantity: 0, reorderLevel: 10, mfgDate: "2026-01-01", expiryDate: "2027-01-01", price: 0, unit: UNITS[0],
  }});
  const openEditMedicine = (m) => setMedModal({ mode: "edit", data: { ...m } });

  const saveMedicine = (data) => {
    if (medModal.mode === "add") {
      setMedicines((prev) => [...prev, { ...data, id: uid("M") }]);
      showToast("Medicine added to inventory");
    } else {
      setMedicines((prev) => prev.map((m) => (m.id === data.id ? data : m)));
      showToast("Medicine updated");
    }
    setMedModal(null);
  };

  const openAddSupplier = () => setSupModal({ mode: "add", data: { name: "", contact: "", email: "", address: "", performance: 80 } });
  const openEditSupplier = (s) => setSupModal({ mode: "edit", data: { ...s } });

  const saveSupplier = (data) => {
    if (supModal.mode === "add") {
      setSuppliers((prev) => [...prev, { ...data, id: uid("S") }]);
      showToast("Supplier added");
    } else {
      setSuppliers((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      showToast("Supplier updated");
    }
    setSupModal(null);
  };

  const performDelete = () => {
    if (confirmDel.type === "medicine") {
      setMedicines((prev) => prev.filter((m) => m.id !== confirmDel.id));
      showToast("Medicine removed");
    } else {
      setSuppliers((prev) => prev.filter((s) => s.id !== confirmDel.id));
      showToast("Supplier removed");
    }
    setConfirmDel(null);
  };

  const runGlobalSearch = (e) => {
    if (e.key === "Enter") {
      setSearch(globalSearch);
      setView("inventory");
    }
  };

  /* ================================ RENDER ================================ */

  return (
    <div className="ms-app">
      <GlobalStyle />

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="ms-sidebar">
        <div className="ms-brand">
          <div className="ms-brand-mark"><Pill size={16} strokeWidth={2.4} /></div>
          <div>
            <div className="ms-brand-name">MediStock</div>
            <div className="ms-brand-sub">Inventory Platform</div>
          </div>
        </div>

        <nav className="ms-nav">
          <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NavItem icon={<Package size={16} />} label="Inventory" active={view === "inventory"} onClick={() => setView("inventory")} />
          <NavItem icon={<Truck size={16} />} label="Suppliers" active={view === "suppliers"} onClick={() => setView("suppliers")} />
          <NavItem icon={<Calendar size={16} />} label="Expiry Tracker" active={view === "expiry"} onClick={() => setView("expiry")} badge={expiringCount + expiredCount || null} />
          <NavItem icon={<Bell size={16} />} label="Alerts" active={view === "alerts"} onClick={() => setView("alerts")} badge={alertCount || null} />
          <NavItem icon={<ClipboardList size={16} />} label="Reports" active={view === "reports"} onClick={() => setView("reports")} />
        </nav>

        <div className="ms-sidebar-footer">
          <div className="ms-role-box"><ShieldCheck size={14} /> Signed in as <strong style={{ color: "#EAF3F1" }}>{role}</strong></div>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div className="ms-main">
        <header className="ms-topbar">
          <div className="ms-search">
            <Search size={15} />
            <input
              placeholder="Search medicines, batches, suppliers… (press Enter)"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={runGlobalSearch}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div className="ms-role-select" onClick={() => {
            const idx = ROLES.indexOf(role);
            setRole(ROLES[(idx + 1) % ROLES.length]);
          }} title="Click to switch role (demo)">
            <ShieldCheck size={14} /> {role} <ChevronDown size={13} />
          </div>
          <div className="ms-bell" onClick={() => setView("alerts")}>
            <Bell size={17} />
            {alertCount > 0 && <span className="ms-bell-dot" />}
          </div>
        </header>

        <main className="ms-content">
          {view === "dashboard" && (
            <DashboardView
              enriched={enriched} totalUnits={totalUnits} lowStockCount={lowStockCount}
              expiringCount={expiringCount} expiredCount={expiredCount} outOfStockCount={outOfStockCount}
              suppliers={suppliers} categoryBreakdown={categoryBreakdown} supplierStock={supplierStock}
              expiryQueue={expiryQueue} setView={setView}
            />
          )}

          {view === "inventory" && (
            <InventoryView
              filtered={filtered} search={search} setSearch={setSearch}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              stockFilter={stockFilter} setStockFilter={setStockFilter}
              expiryFilter={expiryFilter} setExpiryFilter={setExpiryFilter}
              supplierName={supplierName} canEdit={canEdit} canDelete={canDelete}
              openAddMedicine={openAddMedicine} openEditMedicine={openEditMedicine}
              setConfirmDel={setConfirmDel} exportCSV={exportCSV}
            />
          )}

          {view === "suppliers" && (
            <SuppliersView
              suppliers={suppliers} enriched={enriched} canEdit={canEdit} canDelete={canDelete}
              openAddSupplier={openAddSupplier} openEditSupplier={openEditSupplier} setConfirmDel={setConfirmDel}
            />
          )}

          {view === "expiry" && <ExpiryView expiryQueue={expiryQueue} supplierName={supplierName} />}

          {view === "alerts" && <AlertsView alerts={alerts} supplierName={supplierName} />}

          {view === "reports" && (
            <ReportsView medicines={medicines} suppliers={suppliers} enriched={enriched} exportCSV={exportCSV} showToast={showToast} />
          )}
        </main>
      </div>

      {/* ---------------- MODALS ---------------- */}
      {medModal && (
        <MedicineModal
          mode={medModal.mode} data={medModal.data} suppliers={suppliers}
          onCancel={() => setMedModal(null)} onSave={saveMedicine}
        />
      )}
      {supModal && (
        <SupplierModal
          mode={supModal.mode} data={supModal.data}
          onCancel={() => setSupModal(null)} onSave={saveSupplier}
        />
      )}
      {confirmDel && (
        <ConfirmModal
          message={`Remove ${confirmDel.name} permanently? This can't be undone.`}
          onCancel={() => setConfirmDel(null)} onConfirm={performDelete}
        />
      )}
      {toast && (
        <div className="ms-toast"><Check size={15} /> {toast}</div>
      )}
    </div>
  );
}

/* ============================ DASHBOARD VIEW ============================= */

function DashboardView({ enriched, totalUnits, lowStockCount, expiringCount, expiredCount, outOfStockCount, suppliers, categoryBreakdown, supplierStock, expiryQueue, setView }) {
  const soonest = expiryQueue.slice(0, 5);
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Overview</div>
          <div className="ms-page-title">Dashboard</div>
          <div className="ms-page-sub">Real-time snapshot of stock, expiry and supplier health.</div>
        </div>
      </div>

      <div className="ms-grid ms-stat-grid">
        <StatCard icon={<Package size={16} />} label="Medicines tracked" value={enriched.length} tint={{ soft: "var(--teal-100)", solid: "var(--teal-600)" }} />
        <StatCard icon={<TrendingUp size={16} />} label="Total stock units" value={totalUnits.toLocaleString()} tint={{ soft: "var(--teal-100)", solid: "var(--teal-600)" }} />
        <StatCard icon={<PackageX size={16} />} label="Low / out of stock" value={lowStockCount} sub={outOfStockCount ? `${outOfStockCount} out` : null} tint={{ soft: "var(--amber-soft)", solid: "var(--amber)" }} />
        <StatCard icon={<AlertTriangle size={16} />} label="Expiring within 90d" value={expiringCount} sub={expiredCount ? `${expiredCount} expired` : null} tint={{ soft: "var(--red-soft)", solid: "var(--red)" }} />
        <StatCard icon={<Users size={16} />} label="Active suppliers" value={suppliers.length} tint={{ soft: "var(--green-soft)", solid: "var(--green)" }} />
      </div>

      <div className="ms-grid ms-panel-grid">
        <div className="ms-card">
          <div className="ms-panel-title">Stock by supplier <span style={{ fontWeight: 400, color: "var(--ink-soft)", fontSize: 11.5 }}>units on hand</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={supplierStock} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1DFD2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5B6B62" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5B6B62" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E1DFD2" }} />
              <Bar dataKey="units" fill="#1E6F6E" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ms-card">
          <div className="ms-panel-title">Stock by category</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2}>
                {categoryBreakdown.map((c, i) => <Cell key={i} fill={CATEGORY_COLORS[c.name] || "#1E6F6E"} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E1DFD2" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="ms-legend">
            {categoryBreakdown.slice(0, 6).map((c) => (
              <span key={c.name}><i style={{ background: CATEGORY_COLORS[c.name] }} />{c.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="ms-card" style={{ marginTop: 14 }}>
        <div className="ms-panel-title">
          Next to expire
          <span onClick={() => setView("expiry")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--teal-600)", cursor: "pointer", fontWeight: 600 }}>
            View all <ArrowUpRight size={13} />
          </span>
        </div>
        <div className="ms-table-wrap" style={{ border: "none" }}>
          <table className="ms-table">
            <thead><tr><th>Medicine</th><th>Batch</th><th>Shelf life</th><th>Status</th></tr></thead>
            <tbody>
              {soonest.map((m) => (
                <tr key={m.id}>
                  <td className="ms-row-name">{m.name}</td>
                  <td className="ms-mono ms-row-sub">{m.batchNumber}</td>
                  <td><ShelfLifeBar expiryDate={m.expiryDate} mfgDate={m.mfgDate} /></td>
                  <td><StatusPill color={m.expiry.color}>{m.expiry.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ============================ INVENTORY VIEW ============================= */

function InventoryView({ filtered, search, setSearch, categoryFilter, setCategoryFilter, stockFilter, setStockFilter, expiryFilter, setExpiryFilter, supplierName, canEdit, canDelete, openAddMedicine, openEditMedicine, setConfirmDel, exportCSV }) {
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Manage</div>
          <div className="ms-page-title">Medicine Inventory</div>
          <div className="ms-page-sub">{filtered.length} medicine{filtered.length !== 1 ? "s" : ""} matching your filters.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="ms-btn ms-btn-secondary" onClick={() => exportCSV(filtered, [
            { key: "name", label: "Name" }, { key: "batchNumber", label: "Batch" }, { key: "category", label: "Category" },
            { key: "quantity", label: "Quantity" }, { key: "expiryDate", label: "Expiry Date" },
          ], "medistock_inventory.csv")}><Download size={14} /> Export CSV</button>
          {canEdit && <button className="ms-btn ms-btn-primary" onClick={openAddMedicine}><Plus size={14} /> Add medicine</button>}
        </div>
      </div>

      <div className="ms-filters">
        <div className="ms-search" style={{ maxWidth: 260 }}>
          <Search size={14} />
          <input placeholder="Search inventory…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="ms-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="ms-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="All">All stock levels</option>
          <option value="In stock">In stock</option>
          <option value="Low stock">Low stock</option>
          <option value="Out of stock">Out of stock</option>
        </select>
        <select className="ms-select" value={expiryFilter} onChange={(e) => setExpiryFilter(e.target.value)}>
          <option value="All">All expiry states</option>
          <option value="Fresh">Fresh</option>
          <option value="Near expiry">Near expiry</option>
          <option value="Critical">Critical</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th>Medicine</th><th>Category</th><th>Supplier</th><th>Stock</th><th>Shelf life</th><th>Price</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className="ms-row-name">{m.name}</div>
                  <div className="ms-row-sub ms-mono">{m.batchNumber}</div>
                </td>
                <td>{m.category}</td>
                <td className="ms-row-sub">{supplierName(m.supplierId)}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.quantity} <span className="ms-row-sub" style={{ fontWeight: 400 }}>{m.unit}</span></div>
                  <StatusPill color={m.stock.color}>{m.stock.status}</StatusPill>
                </td>
                <td><ShelfLifeBar expiryDate={m.expiryDate} mfgDate={m.mfgDate} /></td>
                <td className="ms-mono">{formatCurrency(m.price)}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    {canEdit && <button className="ms-btn-icon" onClick={() => openEditMedicine(m)}><Pencil size={13} /></button>}
                    {canDelete && <button className="ms-btn-icon" onClick={() => setConfirmDel({ type: "medicine", id: m.id, name: m.name })}><Trash2 size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}>
                <div className="ms-empty"><PackageX size={30} /><div>No medicines match these filters.</div></div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ============================ SUPPLIERS VIEW ============================= */

function SuppliersView({ suppliers, enriched, canEdit, canDelete, openAddSupplier, openEditSupplier, setConfirmDel }) {
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Manage</div>
          <div className="ms-page-title">Suppliers</div>
          <div className="ms-page-sub">{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""} on record.</div>
        </div>
        {canEdit && <button className="ms-btn ms-btn-primary" onClick={openAddSupplier}><Plus size={14} /> Add supplier</button>}
      </div>

      <div className="ms-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {suppliers.map((s) => {
          const items = enriched.filter((m) => m.supplierId === s.id);
          const perfColor = s.performance >= 85 ? "green" : s.performance >= 70 ? "amber" : "red";
          return (
            <div className="ms-card" key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="ms-row-name" style={{ fontSize: 15 }}>{s.name}</div>
                  <div className="ms-row-sub">{s.address}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {canEdit && <button className="ms-btn-icon" onClick={() => openEditSupplier(s)}><Pencil size={13} /></button>}
                  {canDelete && <button className="ms-btn-icon" onClick={() => setConfirmDel({ type: "supplier", id: s.id, name: s.name })}><Trash2 size={13} /></button>}
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                <div>{s.contact}</div>
                <div>{s.email}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div className="ms-row-sub">{items.length} medicine{items.length !== 1 ? "s" : ""} supplied</div>
                <StatusPill color={perfColor}>{s.performance}% performance</StatusPill>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============================= EXPIRY VIEW ================================ */

function ExpiryView({ expiryQueue, supplierName }) {
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Monitor</div>
          <div className="ms-page-title">Expiry Tracker</div>
          <div className="ms-page-sub">Every batch, ordered by remaining shelf life.</div>
        </div>
      </div>
      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead><tr><th>Medicine</th><th>Batch</th><th>Supplier</th><th>Mfg date</th><th>Expiry date</th><th>Shelf life</th><th>Status</th></tr></thead>
          <tbody>
            {expiryQueue.map((m) => (
              <tr key={m.id}>
                <td className="ms-row-name">{m.name}</td>
                <td className="ms-mono ms-row-sub">{m.batchNumber}</td>
                <td className="ms-row-sub">{supplierName(m.supplierId)}</td>
                <td className="ms-mono">{formatDate(m.mfgDate)}</td>
                <td className="ms-mono">{formatDate(m.expiryDate)}</td>
                <td><ShelfLifeBar expiryDate={m.expiryDate} mfgDate={m.mfgDate} /></td>
                <td><StatusPill color={m.expiry.color}>{m.expiry.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ms-legend">
        <span><i style={{ background: "var(--green)" }} /> Fresh — 90+ days</span>
        <span><i style={{ background: "var(--amber)" }} /> Near expiry — 31–90 days</span>
        <span><i style={{ background: "var(--red)" }} /> Critical / expired — ≤30 days or past date</span>
      </div>
    </>
  );
}

/* ============================== ALERTS VIEW =============================== */

function AlertsView({ alerts, supplierName }) {
  const meta = {
    expired: { icon: <CircleAlert size={15} />, bg: "var(--red-soft)", fg: "var(--red)", title: (m) => `${m.name} has expired`, sub: (m) => `Batch ${m.batchNumber} · expired ${formatDate(m.expiryDate)}` },
    expiring: { icon: <AlertTriangle size={15} />, bg: "var(--red-soft)", fg: "var(--red)", title: (m) => `${m.name} expires soon`, sub: (m) => `Batch ${m.batchNumber} · ${m.expiry.days} days remaining` },
    out: { icon: <PackageX size={15} />, bg: "var(--red-soft)", fg: "var(--red)", title: (m) => `${m.name} is out of stock`, sub: (m) => `Supplied by ${supplierName(m.supplierId)}` },
    low: { icon: <Package size={15} />, bg: "var(--amber-soft)", fg: "var(--amber)", title: (m) => `${m.name} is running low`, sub: (m) => `${m.quantity} ${m.unit}s left · reorder at ${m.reorderLevel}` },
  };
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Stay informed</div>
          <div className="ms-page-title">Alerts</div>
          <div className="ms-page-sub">{alerts.length} active alert{alerts.length !== 1 ? "s" : ""} across inventory.</div>
        </div>
      </div>
      <div className="ms-card" style={{ padding: 0 }}>
        {alerts.length === 0 ? (
          <div className="ms-empty"><PackageCheck size={30} /><div>All clear — no active alerts.</div></div>
        ) : alerts.map((a, i) => {
          const cfg = meta[a.type];
          return (
            <div className="ms-alert-item" key={i}>
              <div className="ms-alert-icon" style={{ background: cfg.bg, color: cfg.fg }}>{cfg.icon}</div>
              <div>
                <div className="ms-alert-title">{cfg.title(a.medicine)}</div>
                <div className="ms-alert-sub">{cfg.sub(a.medicine)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============================== REPORTS VIEW =============================== */

function ReportsView({ medicines, suppliers, enriched, exportCSV, showToast }) {
  const reports = [
    {
      title: "Full inventory report", desc: "Every medicine with stock, batch and expiry data.",
      action: () => { exportCSV(medicines, [
        { key: "name", label: "Name" }, { key: "batchNumber", label: "Batch" }, { key: "category", label: "Category" },
        { key: "supplierId", label: "Supplier ID" }, { key: "quantity", label: "Quantity" }, { key: "reorderLevel", label: "Reorder Level" },
        { key: "mfgDate", label: "Mfg Date" }, { key: "expiryDate", label: "Expiry Date" }, { key: "price", label: "Price" },
      ], "medistock_full_inventory.csv"); showToast("Inventory report downloaded"); },
    },
    {
      title: "Low-stock & expiry report", desc: "Items that need reordering or are close to expiry.",
      action: () => { const rows = enriched.filter((m) => m.stock.status !== "In stock" || m.expiry.color !== "green");
        exportCSV(rows, [
          { key: "name", label: "Name" }, { key: "batchNumber", label: "Batch" }, { key: "quantity", label: "Quantity" },
          { key: "expiryDate", label: "Expiry Date" },
        ], "medistock_attention_needed.csv"); showToast("Attention-needed report downloaded"); },
    },
    {
      title: "Supplier directory", desc: "Contact details and performance scores for all suppliers.",
      action: () => { exportCSV(suppliers, [
        { key: "name", label: "Name" }, { key: "contact", label: "Contact" }, { key: "email", label: "Email" },
        { key: "address", label: "Address" }, { key: "performance", label: "Performance %" },
      ], "medistock_suppliers.csv"); showToast("Supplier directory downloaded"); },
    },
  ];
  return (
    <>
      <div className="ms-page-head">
        <div>
          <div className="ms-eyebrow">Export</div>
          <div className="ms-page-title">Reports &amp; Data Export</div>
          <div className="ms-page-sub">Download CSV reports for offline review or sharing.</div>
        </div>
      </div>
      <div className="ms-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {reports.map((r) => (
          <div className="ms-card" key={r.title}>
            <div className="ms-stat-icon" style={{ background: "var(--teal-100)", color: "var(--teal-600)", marginBottom: 12 }}>
              <ClipboardList size={16} />
            </div>
            <div className="ms-row-name" style={{ fontSize: 14.5, marginBottom: 4 }}>{r.title}</div>
            <div className="ms-row-sub" style={{ marginBottom: 16 }}>{r.desc}</div>
            <button className="ms-btn ms-btn-secondary" onClick={r.action}><Download size={13} /> Download CSV</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============================== MODALS ==================================== */

function MedicineModal({ mode, data, suppliers, onCancel, onSave }) {
  const [form, setForm] = useState(data);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }));
  return (
    <div className="ms-modal-overlay" onClick={onCancel}>
      <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ms-modal-head">
          <div className="ms-modal-title">{mode === "add" ? "Add medicine" : "Edit medicine"}</div>
          <button className="ms-btn-icon" onClick={onCancel}><X size={15} /></button>
        </div>

        <div className="ms-field"><label>Medicine name</label><input value={form.name} onChange={set("name")} placeholder="e.g. Paracetamol 500mg" /></div>
        <div className="ms-field-row">
          <div className="ms-field"><label>Batch number</label><input value={form.batchNumber} onChange={set("batchNumber")} placeholder="BN-XXXXX" /></div>
          <div className="ms-field"><label>Category</label>
            <select value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </div>
        </div>
        <div className="ms-field-row">
          <div className="ms-field"><label>Supplier</label>
            <select value={form.supplierId} onChange={set("supplierId")}>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </div>
          <div className="ms-field"><label>Unit</label>
            <select value={form.unit} onChange={set("unit")}>{UNITS.map((u) => <option key={u} value={u}>{u}</option>)}</select>
          </div>
        </div>
        <div className="ms-field-row">
          <div className="ms-field"><label>Quantity</label><input type="number" min="0" value={form.quantity} onChange={setNum("quantity")} /></div>
          <div className="ms-field"><label>Reorder level</label><input type="number" min="0" value={form.reorderLevel} onChange={setNum("reorderLevel")} /></div>
        </div>
        <div className="ms-field-row">
          <div className="ms-field"><label>Manufacturing date</label><input type="date" value={form.mfgDate} onChange={set("mfgDate")} /></div>
          <div className="ms-field"><label>Expiry date</label><input type="date" value={form.expiryDate} onChange={set("expiryDate")} /></div>
        </div>
        <div className="ms-field"><label>Price per unit (₹)</label><input type="number" min="0" step="0.01" value={form.price} onChange={setNum("price")} /></div>

        <div className="ms-modal-actions">
          <button className="ms-btn ms-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="ms-btn ms-btn-primary" disabled={!form.name || !form.batchNumber} onClick={() => onSave(form)}>
            {mode === "add" ? "Add medicine" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplierModal({ mode, data, onCancel, onSave }) {
  const [form, setForm] = useState(data);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="ms-modal-overlay" onClick={onCancel}>
      <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ms-modal-head">
          <div className="ms-modal-title">{mode === "add" ? "Add supplier" : "Edit supplier"}</div>
          <button className="ms-btn-icon" onClick={onCancel}><X size={15} /></button>
        </div>
        <div className="ms-field"><label>Supplier name</label><input value={form.name} onChange={set("name")} placeholder="e.g. MedSource Pharma" /></div>
        <div className="ms-field-row">
          <div className="ms-field"><label>Contact number</label><input value={form.contact} onChange={set("contact")} placeholder="+91 ..." /></div>
          <div className="ms-field"><label>Email</label><input value={form.email} onChange={set("email")} placeholder="contact@example.com" /></div>
        </div>
        <div className="ms-field"><label>Address</label><input value={form.address} onChange={set("address")} placeholder="Street, City, State" /></div>
        <div className="ms-field"><label>Performance score (%)</label><input type="number" min="0" max="100" value={form.performance} onChange={(e) => setForm((f) => ({ ...f, performance: Number(e.target.value) }))} /></div>
        <div className="ms-modal-actions">
          <button className="ms-btn ms-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="ms-btn ms-btn-primary" disabled={!form.name} onClick={() => onSave(form)}>
            {mode === "add" ? "Add supplier" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onCancel, onConfirm }) {
  return (
    <div className="ms-modal-overlay" onClick={onCancel}>
      <div className="ms-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="ms-modal-head">
          <div className="ms-modal-title">Confirm removal</div>
          <button className="ms-btn-icon" onClick={onCancel}><X size={15} /></button>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{message}</div>
        <div className="ms-modal-actions">
          <button className="ms-btn ms-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="ms-btn ms-btn-danger" onClick={onConfirm}><Trash2 size={13} /> Remove</button>
        </div>
      </div>
    </div>
  );
}
