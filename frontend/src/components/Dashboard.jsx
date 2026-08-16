import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion'

import Swal from 'sweetalert2'
import { Tooltip } from 'react-tooltip'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { InventoryView, MedicinesView, SalesView, SuppliersView, UsersView, ExpiryView } from './DashboardViews';
import { API_BASE } from '../config';

const CHART_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#14b8a6','#eab308'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, type: 'spring', stiffness: 120, damping: 16 } }),
};

const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Administrator',
//     title: 'Admin Dashboard',
//     subtitle: 'Live inventory and system overview',
    api: `${API_BASE}/api/admin/dashboard/stats`,
    nav: [
      { label: 'Home', icon: '/icon.png', view: 'home' },
      { label: 'Users', icon: '/total.png', view: 'users' },
      { label: 'Medicine', icon: '/medicines.png', view: 'medicine' },
      { label: 'Inventory', icon: '/Inventory-maintenance_25374.png', view: 'inventory' },
      { label: 'Sales/ Purchase', icon: '/purchase.png', view: 'sales' },
      { label: 'Expiry', icon: '/report.png', view: 'expiry' },
      { label: 'Suppliers', icon: '/supplier.png', view: 'suppliers' },
    ],
    statCards: (s) => [
      { title: 'Total Users', value: s.totalUsers ?? 0, subtitle: 'Registered accounts', icon: '/total.png', accent: 'from-indigo-500 to-blue-500' },
      { title: 'Medicines', value: s.totalMedicines ?? 0, subtitle: 'Products in catalog', icon: '/medicines.png', accent: 'from-emerald-500 to-teal-500' },
      { title: 'Inventory Items', value: s.totalInventoryItems ?? 0, subtitle: 'Stock entries tracked', icon: '/Inventory-maintenance_25374.png', accent: 'from-amber-500 to-orange-500' },
      { title: 'Suppliers', value: s.totalSuppliers ?? 0, subtitle: 'Active vendors', icon: '/supplier.png', accent: 'from-fuchsia-500 to-purple-500' },
    ],
  },
  PHARMACIST: {
    label: 'Pharmacist',
//     title: 'Pharmacist Dashboard',
//     subtitle: 'Stock and transaction overview',
    api: `${API_BASE}/api/pharmacy/dashboard/stats`,
    nav: [
      { label: 'Home', icon: '/icon.png', view: 'home' },
      { label: 'Medicine', icon: '/medicines.png', view: 'medicine' },
      { label: 'Inventory', icon: '/Inventory-maintenance_25374.png', view: 'inventory' },
      { label: 'Sales/ Purchase', icon: '/purchase.png', view: 'sales' },
      { label: 'Expiry', icon: '/report.png', view: 'expiry' },
      { label: 'Suppliers', icon: '/supplier.png', view: 'suppliers' },
    ],
    statCards: (s) => [
      { title: 'Medicines', value: s.totalMedicines ?? 0, subtitle: 'Products in catalog', icon: '/medicines.png', accent: 'from-emerald-500 to-teal-500' },
      { title: 'Inventory Items', value: s.totalInventoryItems ?? 0, subtitle: 'Stock entries', icon: '/Inventory-maintenance_25374.png', accent: 'from-amber-500 to-orange-500' },
      { title: 'Suppliers', value: s.totalSuppliers ?? 0, subtitle: 'Active vendors', icon: '/supplier.png', accent: 'from-fuchsia-500 to-purple-500' },
      { title: 'Total Units', value: s.totalStock ?? 0, subtitle: 'In stock', icon: '/total.png', accent: 'from-sky-500 to-indigo-500' },
    ],
  },
  STAFF: {
    label: 'Staff',
//     title: 'Staff Dashboard',
//     subtitle: 'View inventory and medicines',
    api: `${API_BASE}/api/pharmacy/dashboard/stats`,
    nav: [
      { label: 'Home', icon: '/icon.png', view: 'home' },
      { label: 'Medicine', icon: '/medicines.png', view: 'medicine' },
      { label: 'Inventory', icon: '/Inventory-maintenance_25374.png', view: 'inventory' },
      { label: 'Expiry', icon: '/report.png', view: 'expiry' },
      { label: 'Suppliers', icon: '/supplier.png', view: 'suppliers' },
    ],
    statCards: (s) => [
      { title: 'Medicines', value: s.totalMedicines ?? 0, subtitle: 'Products in catalog', icon: '/medicines.png', accent: 'from-emerald-500 to-teal-500' },
      { title: 'Inventory Items', value: s.totalInventoryItems ?? 0, subtitle: 'Stock entries', icon: '/Inventory-maintenance_25374.png', accent: 'from-amber-500 to-orange-500' },
      { title: 'Suppliers', value: s.totalSuppliers ?? 0, subtitle: 'Active vendors', icon: '/supplier.png', accent: 'from-fuchsia-500 to-purple-500' },
      { title: 'Total Units', value: s.totalStock ?? 0, subtitle: 'In stock', icon: '/total.png', accent: 'from-sky-500 to-indigo-500' },
    ],
  },
};

function StatCard({ card, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      key={card.title}
      custom={i}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, boxShadow: '0 16px 40px -12px rgba(0,0,0,0.14)' }}
      layout
      className="group bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 transition relative overflow-hidden"
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.accent} opacity-10 group-hover:opacity-20 transition`} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider truncate">{card.title}</h3>
          <motion.p
            className="text-3xl md:text-4xl font-extrabold mt-3 text-slate-900 leading-none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 80, damping: 12 }}
          >
            {card.value}
          </motion.p>
          <p className="text-sm text-slate-500 mt-3">{card.subtitle}</p>
        </div>
        <motion.div
          className={`shrink-0 rounded-2xl bg-gradient-to-br ${card.accent} p-3 md:p-4 text-white shadow-lg`}
          whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <img src={card.icon} alt="" className="w-6 h-6 md:w-7 md:h-7 brightness-0 invert" />
        </motion.div>
      </div>
      <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${card.accent} group-hover:w-full transition-all duration-500`} />
    </motion.div>
  );
}

function InViewSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const role = user?.role ?? 'STAFF';
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.STAFF;
  const [activeView, setActiveView] = useState('home');
  const [stats, setStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    fetch(cfg.api, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error(`Request failed with status ${res.status}`); return res.json(); })
      .then((data) => setStats(data))
      .catch((err) => console.error('Dashboard stats error:', err));
  }, [cfg.api]);

  const username = user?.sub ?? cfg.label;
  const initial = (username?.[0] ?? 'A').toUpperCase();
  const statCards = cfg.statCards(stats);
  const navItems = cfg.nav;

  const renderContent = () => {
    switch (activeView) {
      case 'users': return <UsersView />;
      case 'medicine': return <MedicinesView role={role} />;
      case 'inventory': return <InventoryView role={role} onNavigate={setActiveView} />;
      case 'sales': return <SalesView role={role} />;
      case 'suppliers': return <SuppliersView role={role} />;
      case 'expiry': return <ExpiryView role={role} />;
      case 'home':
      default:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {statCards.map((card, i) => (
                <StatCard key={card.title} card={card} i={i} />
              ))}
            </div>

            {stats.stockByMedicine?.length > 0 && (
              <InViewSection className="grid md:grid-cols-2 gap-5 md:gap-6 mt-6 md:mt-8">
                <motion.div
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
                  whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.08)' }}
                  layout
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Stock Distribution</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.totalStock} units</span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={stats.stockByMedicine} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {stats.stockByMedicine.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
                <motion.div
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
                  whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.08)' }}
                  layout
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Stock Summary</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stats.stockByMedicine.length} medicines</span>
                  </div>
                  <div className="space-y-3">
                    {stats.stockByMedicine.slice(0, 8).map((item, i) => (
                      <motion.div
                        key={item.name}
                        className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 80, damping: 16 }}
                      >
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className="text-sm font-bold text-slate-900">{item.value} units</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </InViewSection>
            )}

            {stats.profitSales?.length > 0 && (
              <InViewSection className="mt-6 md:mt-8">
                <motion.div
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
                  whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.08)' }}
                  layout
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Purchases vs Sales</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Last {stats.profitSales.length} months</span>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.profitSales} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <RechartsTooltip
                        formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, name]}
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 13 }} iconType="circle" />
                      <Line type="monotone" dataKey="purchases" name="Purchases (₹)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} animationDuration={1200} />
                      <Line type="monotone" dataKey="sales" name="Sales (₹)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6 }} animationDuration={1200} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </InViewSection>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Tooltip id="dash-tooltip" place="top" className="!text-xs !font-medium !rounded-lg !px-3 !py-1.5" />
      <motion.header
        className="fixed top-0 left-0 right-0 h-14 bg-slate-900/90 backdrop-blur border-b border-slate-700 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        layout
      >
        <div className="h-full flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <motion.img
              src="/icon.png"
              alt="OM Medical"
              className="h-8 w-8 rounded-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              data-tooltip-id="dash-tooltip"
              data-tooltip-content="OM Medical System"
            />
            <div className="leading-tight">
              <h1 className="font-bold text-lg md:text-xl text-white">OM Medical</h1>
            </div>
            <motion.div
              className="hidden sm:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
            >
              <span className="text-xl">💊</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-3">
              <motion.div
                className="w-8 h-8 rounded-full bg-white text-slate-600 grid place-items-center font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {initial}
              </motion.div>

              <div className="text-right leading-tight">
                <h3 className="font-semibold text-white">{username}</h3>
                <p className="text-xs text-slate-300">{cfg.label}</p>
              </div>
            </div>

            <motion.button
              onClick={async () => {
                const result = await Swal.fire({ title: 'Logout?', icon: 'question', showCancelButton: true, confirmButtonColor: '#e11d48', confirmButtonText: 'Logout' });
                if (result.isConfirmed) onLogout();
              }}
              className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2 rounded-xl transition shadow-sm text-sm font-bold"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 pt-14">
        <motion.aside
          className="hidden md:flex w-50 bg-slate-900/90 backdrop-blur border-r border-slate-700 flex-col"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          layout
        >
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                layout
              >
                <button
                  onClick={() => setActiveView(item.view)}
                  className={`w-full group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left transition-all duration-200 ${
                    activeView === item.view
                      ? 'bg-indigo-500/20 border border-indigo-500/30 shadow-md'
                      : 'hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <motion.span
                    layout
                    className={`w-9 h-9 rounded-xl grid place-items-center transition-all duration-200 ${
                      activeView === item.view
                        ? 'bg-indigo-500/60 text-white shadow-md'
                        : 'group-hover:bg-indigo-500/50 text-slate-600'
                    }`}
                  >
                    <motion.img
                      src={item.icon}
                      className={`w-5 h-5 transition-opacity duration-200 ${activeView === item.view ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </motion.span>
                  <motion.span
                    className={`font-semibold text-sm ${activeView === item.view ? 'text-indigo-300' : 'text-slate-300'}`}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {item.label}
                  </motion.span>
                </button>
              </motion.div>
            ))}
          </nav>
          <motion.div
            className="p-4 text-xs text-slate-500 border-t border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Signed in as <span className="text-slate-300 font-medium">{username}</span>
          </motion.div>
        </motion.aside>

        <motion.main
          className="flex-1 p-5"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          key={activeView}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 14 }}
            >
              <h2 className="text-2xl font-bold text-slate-900">{cfg.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{cfg.subtitle}</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={activeView} variants={pageTransition} initial="initial" animate="animate" exit="exit">
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            <div className="md:hidden mt-6">
              <motion.div
                className="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.label}
                      onClick={() => setActiveView(item.view)}
                      className="rounded-2xl border border-slate-200 p-3 hover:bg-slate-800 transition text-left"
                      whileHover={{ scale: 1.03, borderColor: '#6366f1' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img src={item.icon} alt="" className="w-5 h-5 mb-1 opacity-70 brightness-0 invert" />
                      <div className="text-sm font-medium text-slate-100 mt-1">{item.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>

      <motion.footer
        className="bg-slate-900/90 backdrop-blur border-b border-slate-700 z-50 h-14 flex items-center justify-center text-slate-50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        &copy; 2026 OM Medical Inventory Management System
      </motion.footer>
    </div>
  );
}
