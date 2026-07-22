import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/api';
import { motion } from 'framer-motion';
import {
  Package, AlertTriangle, Calendar, Layers,
  Activity, ArrowRight, Tag, Truck,
  ShieldAlert, Search, Sun, Moon, Monitor, Check
} from 'lucide-react';

/* ── Theme Panel ──────────────────────────────────── */
const THEME_OPTIONS = [
  { value: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Deep space interface',      accent: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-500/10 border-indigo-500/20', iconColor: 'text-indigo-400' },
  { value: 'light',  label: 'Light',  icon: Sun,     desc: 'Clean, bright workspace',   accent: 'from-amber-400 to-orange-500',  bg: 'bg-amber-500/10 border-amber-500/20',  iconColor: 'text-amber-400' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Follows your OS preference', accent: 'from-sky-500 to-cyan-400',      bg: 'bg-sky-500/10 border-sky-500/20',      iconColor: 'text-sky-400' },
];

const ThemePanel = () => {
  const { theme, changeTheme } = useTheme();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-label">Appearance</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {THEME_OPTIONS.map(({ value, label, icon: Icon, desc, bg, iconColor, accent }, i) => {
          const isActive = theme === value;
          return (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => changeTheme(value)}
              className={`relative glass-card rounded-2xl p-4 text-left transition-all duration-300 overflow-hidden
                ${isActive
                  ? 'border-sky-500/35 shadow-lg shadow-sky-500/10'
                  : 'hover:border-[var(--border-input)] hover:-translate-y-0.5'
                }`}
              style={{ border: `1px solid ${isActive ? 'rgba(56,189,248,0.35)' : 'var(--border-subtle)'}` }}
            >
              {isActive && (
                <motion.div layoutId="theme-bar" className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent}`} />
              )}
              <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ── Dashboard ────────────────────────────────────── */
const Dashboard = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setStatsLoading(true);
    getDashboardStats(10, 30)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const roleCards = {
    ADMIN: [
      { label: 'Categories',    desc: 'Manage medicine categories and classifications.', icon: Tag,        color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',  path: '/categories' },
      { label: 'Suppliers',     desc: 'Manage supplier contacts and partnerships.',      icon: Truck,      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', path: '/suppliers' },
      { label: 'Inventory',     desc: 'Add, edit, and manage medicines across batches.', icon: Layers,     color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',   path: '/inventory' },
      { label: 'Low Stock',     desc: 'View medicines running below threshold.',         icon: ShieldAlert,color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',      path: '/inventory?filter=lowStock' },
      { label: 'Expiring Soon', desc: 'View medicines expiring within 30 days.',         icon: Calendar,  color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',        path: '/inventory?filter=expiring' },
    ],
    PHARMACIST: [
      { label: 'Inventory',     desc: 'Manage stock levels and add new medicines.',      icon: Package,    color: 'bg-sky-500/10 border-sky-500/20 text-sky-400',            path: '/inventory' },
      { label: 'Low Stock',     desc: 'View medicines running below threshold.',         icon: ShieldAlert,color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',      path: '/inventory?filter=lowStock' },
      { label: 'Expiring Soon', desc: 'View medicines expiring within 30 days.',         icon: Calendar,  color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',        path: '/inventory?filter=expiring' },
      { label: 'Suppliers',     desc: 'View and manage supplier records.',               icon: Truck,      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', path: '/suppliers' },
    ],
    STAFF: [
      { label: 'Browse Inventory', desc: 'Search medicines and check quantities.',    icon: Search,     color: 'bg-sky-500/10 border-sky-500/20 text-sky-400',            path: '/inventory' },
      { label: 'Low Stock',        desc: 'View medicines running below threshold.',   icon: ShieldAlert,color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',      path: '/inventory?filter=lowStock' },
      { label: 'Expiring Soon',    desc: 'View medicines expiring within 30 days.',  icon: Activity,   color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',        path: '/inventory?filter=expiring' },
    ],
  };

  const quickActions = roleCards[user?.role] || roleCards.STAFF;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto">

        {/* ── Hero Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.09) 0%, rgba(99,102,241,0.05) 100%)',
            border: '1px solid rgba(14,165,233,0.14)',
          }}
        >
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10), transparent 70%)', transform: 'translate(35%, -45%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="section-label mb-1.5">{greeting}</p>
              <h1 className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.username} <span className="text-sky-400">👋</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Your MediStock workspace is ready. Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Live Statistics ──────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-label">Live Statistics</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Updated just now</span>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse" style={{ border: '1px solid var(--border-subtle)' }}>
                  <div className="w-11 h-11 rounded-xl mb-5" style={{ background: 'var(--border-subtle)' }} />
                  <div className="h-9 w-14 rounded-lg mb-2" style={{ background: 'var(--border-subtle)' }} />
                  <div className="h-3 w-28 rounded" style={{ background: 'var(--border-subtle)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard icon={Package}       value={stats?.totalMedicines ?? '—'} label="Total Medicines"  sublabel="Active inventory records"  color="sky"   delay={0}    onClick={() => navigate('/inventory')} />
              <StatCard icon={AlertTriangle} value={stats?.lowStockCount  ?? '—'} label="Low Stock Alerts" sublabel="Quantity at or below 10"    color="amber" delay={0.08} onClick={() => navigate('/inventory?filter=lowStock')} />
              <StatCard icon={Calendar}      value={stats?.expiringCount  ?? '—'} label="Expiring Soon"    sublabel="Within the next 30 days"    color="rose"  delay={0.16} onClick={() => navigate('/inventory?filter=expiring')} />
            </div>
          )}
        </div>

        {/* ── Appearance / Theme ──────────────────────── */}
        <ThemePanel />

        {/* ── Quick Access ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-label">Quick Access</h2>
            <span className="badge text-sky-400 bg-sky-500/10 border-sky-500/20">{user?.role}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.07 }}
                onClick={() => navigate(action.path)}
                className="glass-card rounded-2xl p-5 cursor-pointer group transition-all duration-250 hover:-translate-y-0.5 hover-glow"
                style={{ border: '1px solid var(--border-subtle)' }}
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center border mb-4`}>
                  <action.icon className="w-[18px] h-[18px]" />
                </div>
                <h3 className="font-bold text-[13.5px] mb-1" style={{ color: 'var(--text-primary)' }}>
                  {action.label}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {action.desc}
                </p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Open
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
