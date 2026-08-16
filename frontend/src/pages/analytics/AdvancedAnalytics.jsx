import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';

const COLORS = ['#0F766E', '#0891B2', '#7C3AED', '#DC2626', '#D97706', '#059669', '#1D4ED8', '#BE185D'];

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-[8px] shadow-lg p-3 text-xs font-sans">
        {label && <p className="font-bold text-slate-700 mb-1">{label}</p>}
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color || '#0F766E' }} className="font-semibold">
            {e.name}: {prefix}{typeof e.value === 'number' ? e.value.toLocaleString('en-IN') : e.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdvancedAnalytics() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterExpiry, setFilterExpiry] = useState('');

  useEffect(() => {
    const load = async () => {
      const [c, s] = await Promise.all([
        api.get('/api/categories').catch(() => ({ data: { data: [] } })),
        api.get('/api/suppliers').catch(() => ({ data: { data: [] } }))
      ]);
      setCategories(c.data?.data || []);
      setSuppliers(s.data?.data || []);
    };
    load();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (filterCategory) params.append('categoryId', filterCategory);
      if (filterSupplier) params.append('supplierId', filterSupplier);
      if (filterStock) params.append('stockStatus', filterStock);
      if (filterExpiry) params.append('expiryStatus', filterExpiry);
      const res = await api.get(`/api/analytics/dashboard?${params.toString()}`);
      if (res.data?.success) setData(res.data.analytics);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate(''); setEndDate(''); setFilterCategory('');
    setFilterSupplier(''); setFilterStock(''); setFilterExpiry('');
  };

  const a = data || {};

  // Chart data
  const categoryData = (a.inventoryByCategory || []).map(c => ({ name: c.name, count: c.count, quantity: c.quantity }));
  const monthlyData = (a.monthlyStockMovementChart || []).map(m => ({ month: m.month, stockIn: m.stockIn, stockOut: m.stockOut }));
  const weeklyData = (a.weeklyInventoryTrend || []).map(w => ({ date: w.date?.slice(5), qty: w.quantity }));
  const supplierData = (a.supplierContribution || []).map(s => ({ name: s.name?.length > 12 ? s.name.slice(0, 12) + '…' : s.name, value: s.value }));
  const expiryData = (a.expiryStatus || []).filter(e => e.count > 0).map(e => ({ name: e.name, value: e.count }));
  const poData = (a.purchaseOrdersByStatus || []).filter(p => p.count > 0).map(p => ({ name: p.name, value: p.count }));

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-xs text-gray-500">Filter-driven deep-dive across inventory, stock movements, expiry & procurement.</p>
        </div>
        <button
          id="analytics-run-btn"
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-[8px] cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Run Analysis
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">From Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">To Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700 min-w-[130px]">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Supplier</label>
            <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700 min-w-[130px]">
              <option value="">All Suppliers</option>
              {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Status</label>
            <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700">
              <option value="">All</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry Status</label>
            <select value={filterExpiry} onChange={e => setFilterExpiry(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700/30 text-gray-700">
              <option value="">All</option>
              <option value="EXPIRED">Expired</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="VALID">Valid</option>
            </select>
          </div>
          <button onClick={handleReset}
            className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-slate-50 text-xs font-bold rounded-[8px] cursor-pointer">
            Reset
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-[12px]" />)}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {[
              { label: 'Medicines', value: a.totalMedicines || 0, color: 'text-teal-700' },
              { label: 'Suppliers', value: a.totalSuppliers || 0, color: 'text-blue-700' },
              { label: 'Categories', value: a.totalCategories || 0, color: 'text-indigo-700' },
              { label: 'Users', value: a.totalUsers || 0, color: 'text-purple-700' },
              { label: 'Low Stock', value: a.lowStockMedicines || 0, color: 'text-amber-600' },
              { label: 'Out of Stock', value: a.outOfStockMedicines || 0, color: 'text-red-600' },
              { label: 'Expiring Soon', value: a.expiringSoonMedicines || 0, color: 'text-orange-600' },
              { label: 'Expired', value: a.expiredMedicines || 0, color: 'text-red-800' },
              { label: 'Total Orders', value: a.totalPurchaseOrders || 0, color: 'text-slate-700' },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-slate-150 p-3 rounded-[12px] shadow-sm text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-400">{k.label}</span>
                <span className={`block text-lg font-extrabold ${k.color} mt-1`}>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Inventory Value + Growth */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Inventory Value', value: `₹${Number(a.totalInventoryValue || 0).toLocaleString('en-IN')}`, color: 'bg-teal-50 border-teal-200 text-teal-800' },
              { label: 'Avg Medicine Price', value: `₹${Number(a.averageMedicinePrice || 0).toFixed(2)}`, color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Inventory Growth', value: `${Number(a.inventoryGrowthPercentage || 0).toFixed(1)}%`, color: (a.inventoryGrowthPercentage || 0) >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800' },
            ].map((k, i) => (
              <div key={i} className={`p-4 rounded-[12px] border text-center ${k.color}`}>
                <span className="block text-[10px] font-bold uppercase opacity-70">{k.label}</span>
                <span className="block text-2xl font-extrabold mt-1">{k.value}</span>
              </div>
            ))}
          </div>

          {/* Monthly Stock Movement */}
          <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Monthly Stock Movement (Last 6 Months)</h3>
            {monthlyData.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-10">No stock movement data for selected filters.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                    <Bar dataKey="stockIn" name="Stock In" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stockOut" name="Stock Out" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Weekly Trend + Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Weekly Trend */}
            <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">7-Day Inventory Level Trend</h3>
              {weeklyData.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-10">No weekly trend data.</p>
              ) : (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ left: -5, right: 5 }}>
                      <defs>
                        <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0F766E" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="date" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                      <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="qty" name="Total Units" stroke="#0F766E" strokeWidth={2.5} fill="url(#weekGrad)" dot={{ fill: '#0F766E', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Category Bar */}
            <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Inventory by Category (Qty)</h3>
              {categoryData.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-10">No category data.</p>
              ) : (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 5, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                      <XAxis type="number" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="quantity" name="Quantity" radius={[0, 4, 4, 0]}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Expiry Status + PO Status + Supplier Contribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Expiry Pie */}
            <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Expiry Status</h3>
              {expiryData.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-10">No expiry data.</p>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expiryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={3}>
                        {expiryData.map((e, i) => {
                          const c = e.name === 'Expired' ? '#EF4444' : e.name === 'Expiring Soon' ? '#F59E0B' : '#10B981';
                          return <Cell key={i} fill={c} />;
                        })}
                      </Pie>
                      <Tooltip formatter={v => [`${v} items`]} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* PO Status Pie */}
            <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Purchase Order Status</h3>
              {poData.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-10">No PO data.</p>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={poData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={3}>
                        {poData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={v => [`${v} orders`]} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Supplier Contribution */}
            <div className="bg-white border border-slate-150 rounded-[12px] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Supplier Contribution</h3>
              {supplierData.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-10">No supplier data.</p>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierData} layout="vertical" margin={{ left: 0, right: 25 }}>
                      <XAxis type="number" tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} />
                      <YAxis type="category" dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} width={70} />
                      <Tooltip formatter={v => [`${v} medicines`]} />
                      <Bar dataKey="value" name="Medicines" radius={[0, 4, 4, 0]}>
                        {supplierData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Today's & Weekly Movement */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Today's Stock In", value: a.todayStockIn || 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { label: "Today's Stock Out", value: a.todayStockOut || 0, color: 'text-red-600 bg-red-50 border-red-200' },
              { label: '7-Day Movement', value: a.weeklyStockMovement || 0, color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { label: '30-Day Movement', value: a.monthlyStockMovement || 0, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
            ].map((k, i) => (
              <div key={i} className={`p-4 rounded-[12px] border text-center ${k.color}`}>
                <span className="block text-[9px] font-bold uppercase opacity-70">{k.label}</span>
                <span className="block text-2xl font-extrabold mt-1">{k.value}</span>
              </div>
            ))}
          </div>

          {/* Extreme Stock Medicine + Supplier Leaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Highest Stock Medicine', value: a.highestStockMedicine?.medicineName || 'N/A', sub: a.highestStockMedicine?.quantity != null ? `${a.highestStockMedicine.quantity} units` : '', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { label: 'Lowest Stock Medicine', value: a.lowestStockMedicine?.medicineName || 'N/A', sub: a.lowestStockMedicine?.quantity != null ? `${a.lowestStockMedicine.quantity} units` : '', color: 'bg-red-50 border-red-200 text-red-800' },
              { label: 'Top Medicine Supplier', value: a.supplierHighestMedicines?.supplierName || 'N/A', sub: 'Most catalog items', color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Top Purchase Supplier', value: a.supplierHighestPurchases?.supplierName || 'N/A', sub: 'Most purchase orders', color: 'bg-teal-50 border-teal-200 text-teal-800' },
            ].map((k, i) => (
              <div key={i} className={`p-4 rounded-[12px] border ${k.color}`}>
                <span className="block text-[9px] font-bold uppercase opacity-70 mb-1">{k.label}</span>
                <span className="block text-sm font-extrabold truncate">{k.value}</span>
                {k.sub && <span className="block text-[10px] font-semibold opacity-70 mt-0.5">{k.sub}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
