import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  Package,
  Users,
  Layers,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Calendar,
  ShoppingBag,
  Bell,
  Activity,
  RefreshCw,
  Mail,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileText,
  BarChart2,
  Heart,
  Zap
} from 'lucide-react';

const HEALTH_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];
const EXPIRES_COLORS = ['#991B1B', '#EF4444', '#F59E0B', '#10B981'];
const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];
const SUPPLIER_BAR_COLORS = ['#0F766E', '#0891B2', '#7C3AED', '#DC2626', '#D97706', '#059669', '#1D4ED8', '#BE185D'];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-[8px] shadow-lg p-3 text-xs font-sans">
        {label && <p className="font-bold text-slate-700 mb-1">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Health Score Gauge Component
const HealthGauge = ({ score, label, color, icon: Icon, hasData = true }) => {
  if (!hasData) {
    return (
      <div className="flex flex-col items-center p-4 rounded-[12px] border bg-slate-50 border-slate-200 text-slate-400">
        <div className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-full">
          <Icon className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[9px] font-extrabold uppercase text-slate-400 text-center px-1">No Data</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-2 text-slate-400">{label}</span>
      </div>
    );
  }

  const pct = Math.min(Math.max(Math.round(score), 0), 100);
  const strokeColor = pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
  const bgColor = pct >= 75 ? 'bg-emerald-50 border-emerald-100' : pct >= 50 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100';
  const textColor = pct >= 75 ? 'text-emerald-700' : pct >= 50 ? 'text-amber-700' : 'text-red-700';
  const labelColor = pct >= 75 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className={`flex flex-col items-center p-4 rounded-[12px] border ${bgColor}`}>
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke={strokeColor} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-4 h-4 ${textColor} mb-0.5`} />
          <span className={`text-sm font-extrabold ${textColor}`}>{pct}%</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${labelColor}`}>{label}</span>
    </div>
  );
};

export default function InventoryAnalytics() {
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshIntervalSec] = useState(15);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/dashboard/summary');
      if (res.data && res.data.success) {
        setData(res.data.data);
        setLastUpdatedTime(new Date());
      } else {
        triggerToast('Failed to retrieve dashboard analytics.', 'DANGER');
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      triggerToast('Error connecting to Inventory Analytics Service.', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchDashboardData, refreshIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshIntervalSec]);

  useEffect(() => {
    const handleWriteSuccess = () => fetchDashboardData();
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => window.removeEventListener('api-write-success', handleWriteSuccess);
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-14 bg-slate-200 rounded-[12px] w-full mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-[12px]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-100 rounded-[12px]"></div>
          <div className="h-72 bg-slate-100 rounded-[12px]"></div>
          <div className="h-72 bg-slate-100 rounded-[12px]"></div>
        </div>
      </div>
    );
  }

  // Pre-calculated metrics
  const totalMeds = data?.totalMedicines || 0;
  const totalSuppliers = data?.suppliers || 0;
  const totalInvQuantity = data?.totalInventoryQuantity || 0;
  const totalInvValue = data?.inventoryValue || 0;
  const availableStock = data?.availableStock || 0;
  const lowStockMeds = data?.lowStock || 0;
  const outOfStockMeds = data?.outOfStock || 0;
  const criticalStockMeds = data?.criticalStock || 0;
  const nearExpiryMeds = data?.criticalMedicines || 0;
  const expiredMeds = data?.expiredMedicines || 0;
  const totalPurchaseOrders = data?.purchaseOrders || 0;
  const notificationsToday = data?.notificationsToday || 0;

  // Chart data
  const categoryChartData = data?.categoryMetrics?.map(c => ({ name: c.name, count: c.count })) || [];
  const stockHealthChartData = [
    { name: 'Good Stock', value: data?.goodStock || 0 },
    { name: 'Low Stock', value: data?.lowStock || 0 },
    { name: 'Critical', value: data?.criticalStock || 0 },
    { name: 'Out of Stock', value: data?.outOfStock || 0 }
  ].filter(item => item.value > 0);

  const expiryChartData = [
    { name: 'Expired', value: data?.expiredMedicines || 0 },
    { name: 'Expiring 7 Days', value: data?.expiring7Days || 0 },
    { name: 'Expiring 30 Days', value: data?.expiring30Days || 0 },
    { name: 'Safe', value: data?.safeMedicines || 0 }
  ].filter(item => item.value > 0);

  const poStatusData = [
    { name: 'Pending', value: data?.pendingPurchaseOrders || 0, color: '#F59E0B' },
    { name: 'Approved', value: data?.approvedPurchaseOrders || 0, color: '#3B82F6' },
    { name: 'Completed', value: data?.completedPurchaseOrders || 0, color: '#10B981' },
    { name: 'Cancelled', value: data?.cancelledPurchaseOrders || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const stockInOutChartData = [
    { name: 'Stock In', quantity: data?.totalStockIn || 0, fill: '#10B981' },
    { name: 'Stock Out', quantity: data?.totalStockOut || 0, fill: '#EF4444' }
  ];

  // Monthly purchases — sorted by month label
  const monthlyData = (data?.monthlyPurchases || [])
    .slice(-6) // show last 6 months max
    .map(m => ({
      month: m.month ? m.month.substring(5) : '', // e.g. "08" from "2026-08"
      fullMonth: m.month,
      amount: Math.round(m.amount)
    }));

  // Supplier performance — top 8, sorted by totalValue desc
  const supplierPerfData = (data?.supplierPerformance || [])
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
    .slice(0, 8)
    .map(s => ({
      name: s.supplierName?.length > 12 ? s.supplierName.substring(0, 12) + '…' : s.supplierName,
      fullName: s.supplierName,
      orders: s.purchaseCount,
      value: Math.round(s.totalValue || 0)
    }));

  // Supplier inventory value — top 6
  const supplierInvData = (data?.supplierInventoryValue || [])
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
    .slice(0, 6)
    .map(s => ({
      name: s.supplierName?.length > 14 ? s.supplierName.substring(0, 14) + '…' : s.supplierName,
      value: Math.round(s.totalValue || 0)
    }));

  // Health scores
  const inventoryScore = Math.round(data?.inventoryHealthScore || 0);
  const stockScore = Math.round(data?.stockHealthIndicator || 0);
  const expiryScore = Math.round(data?.expiryHealthIndicator || 0);
  const supplierScore = Math.round(data?.supplierHealthIndicator || 0);
  const overallScore = Math.round((inventoryScore + stockScore + expiryScore + supplierScore) / 4);

  return (
    <div className="space-y-6 font-sans">
      {/* ── Command Center Banner ── */}
      <div className="flex flex-wrap justify-between items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 rounded-[14px] shadow-lg gap-4 border border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-500 p-2.5 rounded-[10px] shadow-md">
            <Activity className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-teal-400">Enterprise Monitoring Console</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Live Connection: <span className="text-emerald-400 font-bold">Stable</span>
              &nbsp;|&nbsp; Last Sync: <span className="text-slate-200 font-semibold">{lastUpdatedTime.toLocaleTimeString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          {/* Overall Score pill */}
          <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px] border ${overallScore >= 75 ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : overallScore >= 50 ? 'bg-amber-900/40 border-amber-700 text-amber-300' : 'bg-red-900/40 border-red-700 text-red-300'}`}>
            <Heart className="w-3.5 h-3.5" />
            <span>Health: <b>{overallScore}%</b></span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-700/60 px-3 py-1.5 rounded-[8px] border border-slate-600">
            <span className="text-slate-300 mr-1">Auto</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="focus:outline-none transition-colors text-teal-400 hover:text-teal-300 cursor-pointer"
              id="analytics-autorefresh-toggle"
            >
              {autoRefresh ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-slate-500" />}
            </button>
          </div>

          <button
            id="analytics-sync-btn"
            onClick={fetchDashboardData}
            className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-slate-900 font-extrabold px-3 py-1.5 rounded-[8px] cursor-pointer transition-all shadow-md border-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Section 1: KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Medicines', value: totalMeds, sub: 'Unique catalog entries', icon: Package, accent: '' },
          { label: 'Total Suppliers', value: totalSuppliers, sub: `${data?.activeSuppliers || 0} active`, icon: Users, accent: '' },
          { label: 'Inventory Units', value: totalInvQuantity.toLocaleString('en-IN'), sub: 'Cumulative product count', icon: Layers, accent: '' },
          { label: 'Inventory Value', value: `₹${Number(totalInvValue).toLocaleString('en-IN')}`, sub: 'Total valuation cost', icon: DollarSign, accent: 'teal' },
          { label: 'Available Stock', value: availableStock, sub: 'Healthy lines', icon: CheckCircle, accent: 'emerald' },
          { label: 'Low Stock', value: lowStockMeds, sub: 'Below min threshold', icon: AlertTriangle, accent: 'amber' },
          { label: 'Critical Stock', value: criticalStockMeds, sub: 'Critical levels', icon: Zap, accent: 'orange' },
          { label: 'Out of Stock', value: outOfStockMeds, sub: 'Zero units', icon: AlertOctagon, accent: 'red' },
          { label: 'Near Expiry', value: nearExpiryMeds, sub: 'Expiring ≤ 30 days', icon: Clock, accent: 'rose' },
          { label: 'Expired', value: expiredMeds, sub: 'Require disposal', icon: Calendar, accent: 'crimson' },
          { label: 'Purchase Orders', value: totalPurchaseOrders, sub: 'Total orders', icon: ShoppingBag, accent: '' },
          { label: 'Alerts Today', value: notificationsToday, sub: 'System alerts', icon: Bell, accent: 'blue' },
        ].map((kpi, i) => {
          const accentMap = {
            teal: { border: 'border-l-teal-600', text: 'text-teal-700', label: 'text-teal-800' },
            emerald: { border: 'border-l-emerald-500', text: 'text-emerald-600', label: 'text-emerald-800' },
            amber: { border: 'border-l-amber-500', text: 'text-amber-600', label: 'text-amber-800' },
            orange: { border: 'border-l-orange-500', text: 'text-orange-600', label: 'text-orange-800' },
            red: { border: 'border-l-red-500', text: 'text-red-600', label: 'text-red-800' },
            rose: { border: 'border-l-rose-500', text: 'text-rose-600', label: 'text-rose-800' },
            crimson: { border: 'border-l-red-800', text: 'text-red-800', label: 'text-red-900' },
            blue: { border: 'border-l-blue-500', text: 'text-blue-600', label: 'text-blue-800' },
          };
          const ac = accentMap[kpi.accent] || { border: '', text: 'text-slate-850', label: 'text-slate-500' };
          const Icon = kpi.icon;
          return (
            <div key={i} className={`bg-white border border-slate-150 p-3.5 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group ${kpi.accent ? 'border-l-4 ' + ac.border : ''}`}>
              <div className="absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.12] group-hover:scale-110 transition-all">
                <Icon className="w-12 h-12 text-slate-900" />
              </div>
              <span className={`text-[9.5px] uppercase font-bold tracking-wider ${ac.label || 'text-slate-450'}`}>{kpi.label}</span>
              <div className="mt-2">
                <span className={`text-xl font-extrabold ${ac.text}`}>{kpi.value}</span>
                <span className="text-[9px] block text-slate-400 font-semibold mt-0.5">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section 2: Health Scorecards ── */}
      <div className="bg-white border border-slate-150 rounded-[14px] shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Health Scorecards</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time composite health indicators across all inventory dimensions</p>
          </div>
          {(totalMeds > 0 || totalSuppliers > 0) ? (
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px] border text-xs font-bold ${overallScore >= 75 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : overallScore >= 50 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Overall System Health: {overallScore}%</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[8px] border text-xs font-bold bg-slate-100 border-slate-200 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Overall System Health: No data available</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <HealthGauge score={inventoryScore} label="Inventory Health" color="emerald" icon={Package} hasData={totalMeds > 0} />
          <HealthGauge score={stockScore} label="Stock Health" color="teal" icon={Layers} hasData={totalMeds > 0} />
          <HealthGauge score={expiryScore} label="Expiry Health" color="amber" icon={Calendar} hasData={totalMeds > 0} />
          <HealthGauge score={supplierScore} label="Supplier Health" color="blue" icon={Users} hasData={totalSuppliers > 0} />
        </div>
      </div>

      {/* ── Section 3: Category | Stock | Expiry Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Category Bar Chart */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm flex flex-col min-h-[340px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Medicine Distribution by Category</h3>
          {categoryChartData.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1 text-center">
              <Package className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-bold">No category data mapped.</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ left: -20, right: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Medicines" fill="#0F766E" radius={[5, 5, 0, 0]}>
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SUPPLIER_BAR_COLORS[index % SUPPLIER_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Stock Health Pie */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm flex flex-col min-h-[340px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Stock Health Analytics</h3>
          {stockHealthChartData.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1 text-center">
              <AlertOctagon className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-bold">No active stock lines mapped.</p>
            </div>
          ) : (
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockHealthChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={85} paddingAngle={3}>
                    {stockHealthChartData.map((entry, index) => {
                      const ci = entry.name === 'Good Stock' ? 0 : entry.name === 'Low Stock' ? 1 : entry.name === 'Critical' ? 2 : 3;
                      return <Cell key={`cell-${index}`} fill={HEALTH_COLORS[ci]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} items`, 'Count']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expiry Doughnut */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm flex flex-col min-h-[340px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Expiry Status Analytics</h3>
          {expiryChartData.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1 text-center">
              <Clock className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-bold">No expiry data found.</p>
            </div>
          ) : (
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expiryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={85} paddingAngle={4}>
                    {expiryChartData.map((entry, index) => {
                      const ci = entry.name === 'Expired' ? 0 : entry.name === 'Expiring 7 Days' ? 1 : entry.name === 'Expiring 30 Days' ? 2 : 3;
                      return <Cell key={`cell-${index}`} fill={EXPIRES_COLORS[ci]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} medicines`, 'Count']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 4: Monthly Purchase Trend (Area) + PO Status (Bar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-3 bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Purchase Trend</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Procurement spend over the last 6 months</p>
            </div>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          {monthlyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <BarChart2 className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-bold">No purchase trend data yet.</p>
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ left: -5, right: 10 }}>
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip prefix="₹" />} />
                  <Area type="monotone" dataKey="amount" name="Procurement Spend" stroke="#0F766E" strokeWidth={2.5} fill="url(#tealGrad)" dot={{ fill: '#0F766E', r: 4 }} activeDot={{ r: 6, fill: '#0F766E' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Purchase Order Status */}
        <div className="lg:col-span-2 bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock Movement (In vs Out)</h3>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockInOutChartData} margin={{ left: -15, right: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v} units`, 'Quantity']} />
                  <Bar dataKey="quantity" name="Units" radius={[5, 5, 0, 0]}>
                    {stockInOutChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-around text-center text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Stock In</span>
              <span className="block text-sm font-extrabold text-emerald-600">+{data?.totalStockIn || 0}</span>
            </div>
            <div className="border-r border-slate-100"></div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Stock Out</span>
              <span className="block text-sm font-extrabold text-red-600">-{data?.totalStockOut || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Supplier Performance (Horizontal Bar) + Inventory Value by Supplier ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Supplier PO Performance */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Supplier PO Performance</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Top suppliers by procurement value (₹)</p>
            </div>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          {supplierPerfData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Users className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-bold">No supplier data available.</p>
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierPerfData} layout="vertical" margin={{ left: 5, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} width={80} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = supplierPerfData.find(s => s.name === payload[0]?.payload?.name);
                      return (
                        <div className="bg-white border border-slate-200 rounded-[8px] shadow-lg p-3 text-xs">
                          <p className="font-bold text-slate-800 mb-1">{d?.fullName || payload[0]?.payload?.name}</p>
                          <p className="text-teal-700 font-semibold">Value: ₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}</p>
                          <p className="text-slate-500 font-semibold">Orders: {d?.orders}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="value" name="Procurement Value" radius={[0, 5, 5, 0]}>
                    {supplierPerfData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SUPPLIER_BAR_COLORS[index % SUPPLIER_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Supplier Inventory Value */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Value by Supplier</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Current stock valuation breakdown</p>
            </div>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          {supplierInvData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <DollarSign className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-bold">No valuation data available.</p>
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierInvData} layout="vertical" margin={{ left: 5, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} width={80} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Inventory Value']} />
                  <Bar dataKey="value" name="Inventory Value" radius={[0, 5, 5, 0]}>
                    {supplierInvData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#0891B2', '#7C3AED', '#DC2626', '#D97706', '#059669', '#1D4ED8'][index % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 6: Notification Analytics + Supplier KPIs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Notification Analytics */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notification Analytics</h3>
            <Bell className="w-4 h-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Today's Alerts", value: notificationsToday, bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', lbl: 'text-blue-500' },
              { label: 'Unread', value: data?.unreadNotifications || 0, bg: 'bg-red-50 border-red-100', text: 'text-red-600', lbl: 'text-red-500' },
              { label: 'Read', value: data?.readNotifications || 0, bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', lbl: 'text-emerald-600' },
              { label: 'Expiry Alerts', value: data?.expiryNotifications || 0, bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600', lbl: 'text-rose-500' },
              { label: 'Low Stock', value: data?.lowStockNotifications || 0, bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', lbl: 'text-amber-500' },
              { label: 'Procurement', value: data?.purchaseNotifications || 0, bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-700', lbl: 'text-indigo-500' },
            ].map((n, i) => (
              <div key={i} className={`p-3 rounded-[10px] border text-center ${n.bg}`}>
                <span className={`block text-[9px] font-bold uppercase tracking-wide ${n.lbl}`}>{n.label}</span>
                <span className={`block text-xl font-extrabold ${n.text} mt-0.5`}>{n.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Emails Dispatched</span>
              <span className="block text-base font-extrabold text-indigo-700">{data?.emailNotificationsSent || 0}</span>
            </div>
            <Mail className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Supplier KPIs */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Supplier Intelligence</h3>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="col-span-1 p-3 bg-slate-50 border border-slate-100 rounded-[10px] text-center">
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Total</span>
              <span className="block text-xl font-extrabold text-slate-800 mt-0.5">{totalSuppliers}</span>
            </div>
            <div className="col-span-1 p-3 bg-emerald-50 border border-emerald-100 rounded-[10px] text-center">
              <span className="block text-[9px] font-bold text-emerald-600 uppercase">Active</span>
              <span className="block text-xl font-extrabold text-emerald-700 mt-0.5">{data?.activeSuppliers || 0}</span>
            </div>
            <div className="col-span-1 p-3 bg-red-50 border border-red-100 rounded-[10px] text-center">
              <span className="block text-[9px] font-bold text-red-500 uppercase">Inactive</span>
              <span className="block text-xl font-extrabold text-red-600 mt-0.5">{data?.inactiveSuppliers || 0}</span>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between p-3 bg-teal-50/60 border border-teal-100 rounded-[10px]">
              <div>
                <span className="block text-[9px] font-bold text-teal-600 uppercase">Top Performing Supplier</span>
                <span className="block font-extrabold text-slate-800 mt-0.5 text-sm">{data?.topPerformingSupplier || 'N/A'}</span>
                <span className="text-[9px] text-teal-500 font-semibold">Highest completed procurement value</span>
              </div>
              <TrendingUp className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            </div>
            <div className="flex items-start justify-between p-3 bg-blue-50/60 border border-blue-100 rounded-[10px]">
              <div>
                <span className="block text-[9px] font-bold text-blue-600 uppercase">Largest Catalog Supplier</span>
                <span className="block font-extrabold text-slate-800 mt-0.5 text-sm">{data?.supplierHighestMedicines || 'N/A'}</span>
                <span className="text-[9px] text-blue-500 font-semibold">Supplies most diverse medicines</span>
              </div>
              <Package className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[10px] flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Avg Purchase Order Value</span>
                <span className="block text-base font-extrabold text-slate-800 mt-0.5">₹{Math.round(data?.averagePurchaseVolume || 0).toLocaleString('en-IN')}</span>
              </div>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 7: Recent Activity Timeline + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recent Activity Timeline</h3>
          <div className="max-h-72 overflow-y-auto pr-1 space-y-3 font-sans text-xs">
            {data?.recentStockLogs && data.recentStockLogs.length > 0 ? (
              data.recentStockLogs.map((log, index) => {
                const qtyDiff = log.newQuantity - log.oldQuantity;
                const date = log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : '';
                const time = log.updatedAt ? new Date(log.updatedAt).toLocaleTimeString() : '';
                const actionConfig = {
                  STOCK_IN: { bg: 'bg-teal-50 border-teal-400', dot: 'bg-teal-500', badge: 'text-teal-700 bg-teal-100', label: 'IN' },
                  STOCK_OUT: { bg: 'bg-rose-50 border-rose-400', dot: 'bg-rose-500', badge: 'text-rose-700 bg-rose-100', label: 'OUT' },
                };
                const ac = actionConfig[log.action] || { bg: 'bg-amber-50 border-amber-400', dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-100', label: 'ADJ' };
                return (
                  <div key={log.stockLogId || index} className="flex space-x-3 relative">
                    {index < data.recentStockLogs.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-12px] w-[2px] bg-slate-100"></div>
                    )}
                    <div className={`w-[20px] h-[20px] mt-0.5 rounded-full flex items-center justify-center font-extrabold text-[7px] border-2 flex-shrink-0 ${ac.badge} border-current`}>
                      {ac.label}
                    </div>
                    <div className={`flex-1 p-2.5 rounded-[8px] border ${ac.bg} space-y-0.5`}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-extrabold text-slate-800 truncate">{log.medicine?.medicineName || 'Unknown Medicine'}</span>
                        <span className="text-[9px] text-slate-450 font-bold whitespace-nowrap">{date} {time}</span>
                      </div>
                      <p className="text-slate-600 font-semibold">
                        <span className="font-bold text-slate-800">{log.action}</span> &nbsp;·&nbsp;
                        Qty: <span className="font-bold">{qtyDiff >= 0 ? `+${qtyDiff}` : qtyDiff}</span>
                        &nbsp;→&nbsp; Now: <span className="font-bold">{log.newQuantity}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        By: <span className="text-teal-700 font-bold">{log.user?.email || 'System Agent'}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 font-bold flex flex-col items-center">
                <Activity className="w-8 h-8 text-slate-200 mb-2" />
                No recent activities logged in timeline.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-150 p-5 rounded-[14px] shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
          <div className="flex-1 space-y-2.5">
            {[
              { label: 'Register Medicine', sub: 'Add new drug to catalog', to: '/medicines/new', color: 'bg-teal-50 border-teal-200 hover:bg-teal-100', text: 'text-teal-800', icon: Package },
              { label: 'Add Supplier', sub: 'Register vendor/lab', to: '/suppliers/new', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100', text: 'text-blue-800', icon: Users },
              { label: 'Create Purchase Order', sub: 'Initiate procurement', to: '/purchase-orders/new', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100', text: 'text-indigo-800', icon: ShoppingBag },
              { label: 'Stock In', sub: 'Receive inventory', to: '/inventory', color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', text: 'text-emerald-800', icon: TrendingUp },
              { label: 'View Reports', sub: 'Export PDF/Excel', to: '/reports', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100', text: 'text-amber-800', icon: FileText },
              { label: 'Notifications', sub: 'View all system alerts', to: '/notifications', color: 'bg-rose-50 border-rose-200 hover:bg-rose-100', text: 'text-rose-800', icon: Bell },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  to={action.to}
                  className={`flex items-center justify-between p-2.5 rounded-[10px] border ${action.color} transition-all group cursor-pointer`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-[6px] ${action.color} border border-current/20`}>
                      <Icon className={`w-3.5 h-3.5 ${action.text}`} />
                    </div>
                    <div>
                      <span className={`block text-[11px] font-extrabold ${action.text}`}>{action.label}</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">{action.sub}</span>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 ${action.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
