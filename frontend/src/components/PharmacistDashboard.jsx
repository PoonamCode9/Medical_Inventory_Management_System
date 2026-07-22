import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { InventoryView, MedicinesView, SuppliersView, SalesView } from './DashboardViews';

const CHART_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#14b8a6','#eab308'];
const API = 'http://localhost:8080';

export default function PharmacistDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('home');
  const [stats, setStats] = useState({
    totalMedicines: 0, totalInventoryItems: 0, totalSuppliers: 0,
    recentMedicines: [], recentInventoryItems: [], recentSuppliers: [],
    stockByMedicine: [], totalStock: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    fetch(`${API}/api/pharmacy/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setStats)
      .catch(() => {});
  }, []);

  const navItems = [
    { label: 'Home', icon: '🏠', view: 'home' },
    { label: 'Medicines', icon: '💊', view: 'medicine' },
    { label: 'Inventory', icon: '📊', view: 'inventory' },
    { label: 'Sales/ Purchase', icon: '🧾', view: 'sales' },
    { label: 'Suppliers', icon: '🚚', view: 'suppliers' },
  ];

  const username = user?.sub ?? 'Pharmacist';
  const initial = (username?.[0] ?? 'P').toUpperCase();

  const statCards = [
    { title: 'Medicines', value: stats.totalMedicines, subtitle: 'Products in catalog', icon: '💊', accent: 'from-emerald-500 to-teal-500' },
    { title: 'Inventory Items', value: stats.totalInventoryItems, subtitle: 'Stock entries', icon: '📦', accent: 'from-amber-500 to-orange-500' },
    { title: 'Suppliers', value: stats.totalSuppliers, subtitle: 'Active vendors', icon: '🚚', accent: 'from-fuchsia-500 to-purple-500' },
    { title: 'Total Units', value: stats.totalStock, subtitle: 'In stock', icon: '📊', accent: 'from-sky-500 to-indigo-500' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'inventory': return <InventoryView role="PHARMACIST" />;
      case 'suppliers': return <SuppliersView role="PHARMACIST" />;
      case 'sales': return <SalesView role="PHARMACIST" />;
      case 'medicine': return <MedicinesView role="PHARMACIST" />;
      case 'home':
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
              {statCards.map(card => (
                <div key={card.title} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-2xl text-white`}>{card.icon}</div>
                  <h3 className="text-slate-500 font-medium mt-4">{card.title}</h3>
                  <p className="text-4xl font-extrabold mt-2 text-slate-900">{card.value}</p>
                  <p className="text-sm text-slate-500 mt-2">{card.subtitle}</p>
                </div>
              ))}
            </div>

            {stats.stockByMedicine?.length > 0 && (
              <div className="grid md:grid-cols-2 gap-5 md:gap-6 mt-6 md:mt-8">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Stock Distribution</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.totalStock} units</span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={stats.stockByMedicine} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {stats.stockByMedicine.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Stock Summary</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.stockByMedicine.length} medicines</span>
                  </div>
                  <div className="space-y-3">
                    {stats.stockByMedicine.slice(0, 8).map(item => (
                      <div key={item.name} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className="text-sm font-bold text-slate-900">{item.value} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-5 md:gap-6 mt-6 md:mt-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">Recent Medicines</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Latest 5</span>
                </div>
                <ul className="space-y-3">
                  {stats.recentMedicines.length > 0 ? stats.recentMedicines.map(item => (
                    <li key={item.id} className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Batch: {item.batch} • Expires {item.expiration_date}</p>
                    </li>
                  )) : <li className="text-sm text-slate-500">No medicines found.</li>}
                </ul>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">Inventory Snapshot</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Latest 5</span>
                </div>
                <ul className="space-y-3">
                  {stats.recentInventoryItems.length > 0 ? stats.recentInventoryItems.map(item => (
                    <li key={item.id} className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">{item.medicine?.name}</p>
                      <p className="text-sm text-slate-500">Qty: {item.available_qty} • Supplier: {item.supplier}</p>
                    </li>
                  )) : <li className="text-sm text-slate-500">No inventory records found.</li>}
                </ul>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">Recent Suppliers</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Latest 5</span>
                </div>
                <ul className="space-y-3">
                  {stats.recentSuppliers.length > 0 ? stats.recentSuppliers.map(item => (
                    <li key={item.id} className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.email} • {item.address}</p>
                    </li>
                  )) : <li className="text-sm text-slate-500">No supplier records found.</li>}
                </ul>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="h-14 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <h1 className="font-bold text-xl text-slate-900">OM Medical</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white grid place-items-center font-semibold">{initial}</div>
              <div className="text-right leading-tight">
                <h3 className="font-semibold text-slate-900">{username}</h3>
                <p className="text-xs text-slate-500">Pharmacist</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2 rounded-xl transition shadow-sm text-sm font-bold">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => (
              <button key={item.label} onClick={() => setActiveView(item.view)}
                className={`w-full group flex items-center gap-3 px-4 rounded-2xl text-left transition ${activeView === item.view ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                <span className="w-9 h-9 rounded-xl grid place-items-center group-hover:bg-indigo-500/10 transition">
                  <span className="text-lg">{item.icon}</span>
                </span>
                <span className="font-semibold text-slate-700">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 text-xs text-slate-400 border-t border-slate-200">
            Signed in as <span className="text-slate-600 font-medium">{username}</span>
          </div>
        </aside>

        <main className="flex-1 p-5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Pharmacist Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">Stock and transaction overview</p>
            </div>
            {renderContent()}

            <div className="md:hidden mt-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map(item => (
                    <button key={item.label} onClick={() => setActiveView(item.view)}
                      className="rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition text-left">
                      <div className="text-lg">{item.icon}</div>
                      <div className="text-sm font-medium text-slate-900 mt-1">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 h-14 flex items-center justify-center text-slate-500 text-sm">
        &copy; 2026 OM Medical Inventory Management System
      </footer>
    </div>
  );
}
