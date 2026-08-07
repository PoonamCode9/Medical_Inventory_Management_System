import React, { useState, useEffect, useContext } from 'react';
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
  Line
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
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Mail,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const HEALTH_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444']; // Good, Low, Critical, Out of Stock
const EXPIRES_COLORS = ['#991B1B', '#EF4444', '#F59E0B', '#10B981']; // Expired, 7 Days, 30 Days, Safe
const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444']; // Pending, Approved, Completed, Cancelled

export default function InventoryAnalytics() {
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState(15);
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

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshIntervalSec]);

  // Listen to write events to trigger immediate refresh
  useEffect(() => {
    const handleWriteSuccess = () => {
      fetchDashboardData();
    };
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-[12px]"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-[12px]"></div>
          <div className="h-64 bg-slate-100 rounded-[12px]"></div>
          <div className="h-64 bg-slate-100 rounded-[12px]"></div>
        </div>
      </div>
    );
  }

  // Pre-calculated metrics safely mapped
  const totalMeds = data?.totalMedicines || 0;
  const totalSuppliers = data?.suppliers || 0;
  const totalInvQuantity = data?.totalInventoryQuantity || 0;
  const totalInvValue = data?.inventoryValue || 0;
  const availableStock = data?.availableStock || 0;
  const lowStockMeds = data?.lowStock || 0;
  const outOfStockMeds = data?.outOfStock || 0;
  const nearExpiryMeds = data?.criticalMedicines || 0;
  const expiredMeds = data?.expiredMedicines || 0;
  const totalPurchaseOrders = data?.purchaseOrders || 0;
  const notificationsToday = data?.notificationsToday || 0;

  // Chart 1: Category distribution
  const categoryChartData = data?.categoryMetrics?.map(c => ({
    name: c.name,
    count: c.count
  })) || [];

  // Chart 2: Stock Health
  const stockHealthChartData = [
    { name: 'Good Stock', value: data?.goodStock || 0 },
    { name: 'Low Stock', value: data?.lowStock || 0 },
    { name: 'Critical Stock', value: data?.criticalStock || 0 },
    { name: 'Out of Stock', value: data?.outOfStock || 0 }
  ].filter(item => item.value > 0);

  // Chart 3: Expiry Analytics
  const expiryChartData = [
    { name: 'Expired', value: data?.expiredMedicines || 0 },
    { name: 'Expiring 7 Days', value: data?.expiring7Days || 0 },
    { name: 'Expiring 30 Days', value: data?.expiring30Days || 0 },
    { name: 'Safe', value: data?.safeMedicines || 0 }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Control Board */}
      <div className="flex flex-wrap justify-between items-center bg-slate-900 text-white p-4 rounded-[12px] shadow-lg gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-500 p-2 rounded-[8px] animate-pulse">
            <Activity className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-teal-400">Enterprise Monitoring Console</h2>
            <p className="text-[10px] text-slate-350">
              Live Connection Status: <span className="text-emerald-400 font-bold">Stable</span> | Last Sync: {lastUpdatedTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-[8px] border border-slate-700">
            <span className="text-slate-400 mr-1">Auto Refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="focus:outline-none transition-colors text-teal-400 hover:text-teal-350 cursor-pointer"
            >
              {autoRefresh ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-slate-500" />}
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-700 text-slate-900 font-extrabold px-3 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-md border-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 1. Executive KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Medicines */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Package className="w-12 h-12 text-slate-900" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Total Medicines</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-850">{totalMeds}</span>
            <span className="text-[9px] block text-slate-400 font-semibold mt-1">Unique catalog entries</span>
          </div>
        </div>

        {/* Total Suppliers */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-12 h-12 text-slate-900" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Total Suppliers</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-850">{totalSuppliers}</span>
            <span className="text-[9px] block text-emerald-650 font-semibold mt-1">Active global labs</span>
          </div>
        </div>

        {/* Total Inventory Items */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Layers className="w-12 h-12 text-slate-900" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Total Items</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-850">{totalInvQuantity}</span>
            <span className="text-[9px] block text-slate-400 font-semibold mt-1">Cumulative product count</span>
          </div>
        </div>

        {/* Current Inventory Value */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-teal-600">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-12 h-12 text-teal-600" />
          </div>
          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">Inventory Value</span>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-teal-700">₹{totalInvValue.toLocaleString('en-IN')}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Total valuation cost</span>
          </div>
        </div>

        {/* Available Stock */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-emerald-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Available Stock</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">{availableStock}</span>
            <span className="text-[9px] block text-slate-400 font-semibold mt-1">Healthy stock lines</span>
          </div>
        </div>

        {/* Low Stock Medicines */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-amber-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Low Stock</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-600">{lowStockMeds}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Below minimum target</span>
          </div>
        </div>

        {/* Out of Stock Medicines */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <AlertOctagon className="w-12 h-12 text-red-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider">Out Of Stock</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-red-650">{outOfStockMeds}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Zero units remaining</span>
          </div>
        </div>

        {/* Near Expiry Medicines */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-rose-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Clock className="w-12 h-12 text-rose-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Near Expiry</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-rose-600">{nearExpiryMeds}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Expiring within 30d</span>
          </div>
        </div>

        {/* Expired Medicines */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-red-850">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Calendar className="w-12 h-12 text-red-800" />
          </div>
          <span className="text-[10px] uppercase font-bold text-red-900 tracking-wider">Expired Medicines</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-red-800">{expiredMeds}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Require immediate disposal</span>
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-12 h-12 text-slate-900" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Purchase Orders</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-850">{totalPurchaseOrders}</span>
            <span className="text-[9px] block text-slate-400 font-semibold mt-1">Total orders created</span>
          </div>
        </div>

        {/* Notifications Today */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Bell className="w-12 h-12 text-blue-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Alerts Today</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-blue-600">{notificationsToday}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Generated alerts today</span>
          </div>
        </div>

        {/* Email Notifications Sent */}
        <div className="bg-white border border-slate-150 p-4 rounded-[12px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-l-4 border-l-indigo-500">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Mail className="w-12 h-12 text-indigo-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider">Emails Dispatched</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-indigo-600">{data?.emailNotificationsSent || 0}</span>
            <span className="text-[9px] block text-slate-450 font-semibold mt-1">Admin/Pharmacist alerts</span>
          </div>
        </div>
      </div>

      {/* 2. Category Distribution, 3. Stock Health & 4. Expiry Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Product Distribution Chart */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Medicine distribution by category</h3>
            {categoryChartData.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12 text-center h-56">
                <Package className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-bold">No category data mapped.</p>
              </div>
            ) : (
              <div className="h-64 font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ left: -25, right: 5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#0F766E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Stock Health Analytics Pie Chart */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Stock Health Analytics</h3>
            {stockHealthChartData.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12 text-center h-56">
                <AlertOctagon className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-bold">No active stock lines mapped.</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockHealthChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {stockHealthChartData.map((entry, index) => {
                        let colorIndex = 0;
                        if (entry.name === 'Good Stock') colorIndex = 0;
                        else if (entry.name === 'Low Stock') colorIndex = 1;
                        else if (entry.name === 'Critical Stock') colorIndex = 2;
                        else if (entry.name === 'Out of Stock') colorIndex = 3;
                        return <Cell key={`cell-${index}`} fill={HEALTH_COLORS[colorIndex]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Expiry Analytics Doughnut Chart */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Expiry status analytics</h3>
            {expiryChartData.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12 text-center h-56">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-bold">No expiry dates set.</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expiryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {expiryChartData.map((entry, index) => {
                        let colorIndex = 3;
                        if (entry.name === 'Expired') colorIndex = 0;
                        else if (entry.name === 'Expiring 7 Days') colorIndex = 1;
                        else if (entry.name === 'Expiring 30 Days') colorIndex = 2;
                        else if (entry.name === 'Safe') colorIndex = 3;
                        return <Cell key={`cell-${index}`} fill={EXPIRES_COLORS[colorIndex]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} medicines`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Purchase Order Analytics & 6. Supplier Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Order Analytics */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchase Order Analytics</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 font-sans text-center">
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Total Orders</span>
              <span className="block text-lg font-extrabold text-slate-800">{totalPurchaseOrders}</span>
            </div>
            
            <div className="bg-amber-50 border border-amber-150 p-3 rounded-[8px]">
              <span className="block text-[8px] font-bold text-amber-500 uppercase">Pending</span>
              <span className="block text-lg font-extrabold text-amber-600">{data?.pendingPurchaseOrders || 0}</span>
              <span className="block text-[8px] text-amber-400 font-semibold">
                {totalPurchaseOrders > 0 ? `${Math.round(((data?.pendingPurchaseOrders || 0) / totalPurchaseOrders) * 100)}%` : '0%'}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-150 p-3 rounded-[8px]">
              <span className="block text-[8px] font-bold text-blue-500 uppercase">Approved</span>
              <span className="block text-lg font-extrabold text-blue-600">{data?.approvedPurchaseOrders || 0}</span>
              <span className="block text-[8px] text-blue-400 font-semibold">
                {totalPurchaseOrders > 0 ? `${Math.round(((data?.approvedPurchaseOrders || 0) / totalPurchaseOrders) * 100)}%` : '0%'}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-[8px]">
              <span className="block text-[8px] font-bold text-emerald-600 uppercase">Completed</span>
              <span className="block text-lg font-extrabold text-emerald-600">{data?.completedPurchaseOrders || 0}</span>
              <span className="block text-[8px] text-emerald-500 font-semibold">
                {totalPurchaseOrders > 0 ? `${Math.round(((data?.completedPurchaseOrders || 0) / totalPurchaseOrders) * 100)}%` : '0%'}
              </span>
            </div>

            <div className="bg-rose-50 border border-rose-150 p-3 rounded-[8px]">
              <span className="block text-[8px] font-bold text-rose-500 uppercase">Cancelled</span>
              <span className="block text-lg font-extrabold text-rose-600">{data?.cancelledPurchaseOrders || 0}</span>
              <span className="block text-[8px] text-rose-450 font-semibold">
                {totalPurchaseOrders > 0 ? `${Math.round(((data?.cancelledPurchaseOrders || 0) / totalPurchaseOrders) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Supplier Analytics */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Supplier Analytics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sans text-xs">
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Total / Active / Inactive</span>
              <span className="text-base font-extrabold text-slate-800">
                {totalSuppliers} <span className="text-slate-400 font-medium">/</span> <span className="text-emerald-600">{data?.activeSuppliers || 0}</span> <span className="text-slate-400 font-medium">/</span> <span className="text-red-500">{data?.inactiveSuppliers || 0}</span>
              </span>
            </div>

            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Top Performing Supplier</span>
              <span className="text-xs font-extrabold text-slate-850 truncate block" title={data?.topPerformingSupplier}>
                {data?.topPerformingSupplier || 'N/A'}
              </span>
              <span className="text-[8px] text-teal-600 block">Highest completed procurement value</span>
            </div>

            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Largest Catalog Supplier</span>
              <span className="text-xs font-extrabold text-slate-850 truncate block" title={data?.supplierHighestMedicines}>
                {data?.supplierHighestMedicines || 'N/A'}
              </span>
              <span className="text-[8px] text-teal-600 block">Supplies most diverse medicines</span>
            </div>

            <div className="border-t border-slate-100 pt-3 md:col-span-3">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Average Purchase Order Value</span>
              <span className="text-sm font-extrabold text-slate-850">
                ₹{Math.round(data?.averagePurchaseVolume || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[8px] text-slate-450 block">Average valuation cost per PO</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Notification Analytics & 8. Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Analytics */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notification Analytics</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-blue-500 uppercase">Today's Alerts</span>
              <span className="block text-base font-extrabold text-blue-600">{notificationsToday}</span>
            </div>

            <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-red-500 uppercase">Unread</span>
              <span className="block text-base font-extrabold text-red-655">{data?.unreadNotifications || 0}</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-emerald-600 uppercase">Read</span>
              <span className="block text-base font-extrabold text-emerald-700">{data?.readNotifications || 0}</span>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-rose-800 uppercase">Expiry Alerts</span>
              <span className="block text-base font-extrabold text-rose-600">{data?.expiryNotifications || 0}</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-amber-500 uppercase">Low Stock Alerts</span>
              <span className="block text-base font-extrabold text-amber-600">{data?.lowStockNotifications || 0}</span>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-[8px] flex flex-col justify-center">
              <span className="block text-[9px] font-bold text-indigo-550 uppercase">Procurements</span>
              <span className="block text-base font-extrabold text-indigo-700">{data?.purchaseNotifications || 0}</span>
            </div>
          </div>
        </div>

        {/* 8. Recent Activity Timeline */}
        <div className="bg-white border border-slate-150 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recent Activity Timeline</h3>
          
          <div className="flex-1 max-h-64 overflow-y-auto pr-1 space-y-4 font-sans text-xs">
            {data?.recentStockLogs && data.recentStockLogs.length > 0 ? (
              data.recentStockLogs.map((log, index) => {
                const qtyDiff = log.newQuantity - log.oldQuantity;
                const date = log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : '';
                const time = log.updatedAt ? new Date(log.updatedAt).toLocaleTimeString() : '';
                return (
                  <div key={log.stockLogId} className="flex space-x-3 relative">
                    {index < data.recentStockLogs.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-slate-100"></div>
                    )}
                    <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center font-extrabold text-[8px] border-2 ${
                      log.action === 'STOCK_IN' ? 'bg-teal-50 border-teal-500 text-teal-600' :
                      log.action === 'STOCK_OUT' ? 'bg-rose-50 border-rose-500 text-rose-600' :
                      'bg-amber-50 border-amber-500 text-amber-600'
                    }`}>
                      {log.action === 'STOCK_IN' ? 'IN' : log.action === 'STOCK_OUT' ? 'OUT' : 'ADJ'}
                    </div>
                    <div className="flex-1 space-y-0.5 bg-slate-50 p-2.5 rounded-[8px] border border-slate-150">
                      <div className="flex justify-between items-baseline">
                        <span className="font-extrabold text-slate-800">{log.medicine?.medicineName || 'Unknown Medicine'}</span>
                        <span className="text-[9px] text-slate-450 font-bold">{date} {time}</span>
                      </div>
                      <p className="text-slate-500 font-medium">
                        Action: <span className="font-bold text-slate-700">{log.action}</span> | Shifts: <span className="font-bold text-slate-850">{qtyDiff >= 0 ? `+${qtyDiff}` : qtyDiff} units</span>
                      </p>
                      <p className="text-[10px] text-slate-405 font-semibold">
                        Logged by: <span className="text-teal-700 font-bold">{log.user?.email || 'System Agent'}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 font-bold">
                No recent activities logged in timeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
