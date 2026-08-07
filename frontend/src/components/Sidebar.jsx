import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../services/api';
import {
  PackageOpen,
  LayoutDashboard,
  Package,
  Tag,
  Truck,
  UserPlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  ShoppingCart,
  Bell,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard, roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
  { to: '/inventory',     label: 'Inventory',        icon: Package,          roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart,    roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/reports',       label: 'Reports',          icon: BarChart2,        roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
  { to: '/notifications', label: 'Notifications',    icon: Bell,             roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
  { to: '/categories',    label: 'Categories',       icon: Tag,              roles: ['ADMIN'] },
  { to: '/suppliers',     label: 'Suppliers',        icon: Truck,            roles: ['ADMIN', 'PHARMACIST'] },
  { to: '/users',         label: 'Users',            icon: UserPlus,         roles: ['ADMIN', 'PHARMACIST'] },
];

const roleColors = {
  ADMIN:      { dot: 'bg-purple-400', pill: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  PHARMACIST: { dot: 'bg-sky-400',    pill: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  STAFF:      { dot: 'bg-emerald-400',pill: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [navUnread, setNavUnread] = useState(0);

  // Poll unread count for the sidebar badge
  useEffect(() => {
    const fetchCount = () => {
      getUnreadCount()
        .then((res) => setNavUnread(res.data?.count ?? 0))
        .catch(() => {});
    };
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));
  const rc = roleColors[user?.role] || roleColors.STAFF;

  // Avatar initials
  const initials = user?.username?.slice(0, 2).toUpperCase() || '?';

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 236 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="sidebar-bg relative flex flex-col h-screen sticky top-0 flex-shrink-0"
      style={{ borderRight: '1px solid var(--border-nav)' }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="h-14 flex items-center px-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border-nav)' }}>
        <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center border border-sky-500/25 flex-shrink-0">
          <PackageOpen className="w-4 h-4 text-sky-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <span className="font-extrabold text-[15px] tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, var(--text-primary), #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                MediStock
              </span>
              <span className="block text-[10px] font-medium mt-0 -mt-0.5"
                style={{ color: 'var(--text-muted)' }}>
                Inventory Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[3.6rem] w-6 h-6 rounded-full flex items-center justify-center z-30 transition-all duration-200"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>

      {/* ── Nav section label ─────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-5 pb-1"
          >
            <span className="section-label text-[10px]">Navigation</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav Items ─────────────────────────────────── */}
      <nav className={`flex-1 py-2 ${collapsed ? 'px-2' : 'px-3'} space-y-0.5 overflow-hidden overflow-y-auto`}>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl transition-all duration-200 group relative
               ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
               ${isActive
                 ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                 : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--border-subtle)]'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sky-400 rounded-r-full" />
                )}

                {/* Icon wrapper — relative for badge positioning */}
                <span className="relative flex-shrink-0">
                  <item.icon
                    className={`transition-colors
                      ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}
                      ${isActive ? 'text-sky-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}
                    `}
                  />
                  {/* Unread badge on Notifications nav item */}
                  {item.to === '/notifications' && navUnread > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-[3px] rounded-full flex items-center justify-center text-[8px] font-bold text-white pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
                    >
                      {navUnread > 99 ? '99+' : navUnread}
                    </span>
                  )}
                </span>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[13.5px] font-medium whitespace-nowrap flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Unread count label (expanded sidebar only) */}
                {!collapsed && item.to === '/notifications' && navUnread > 0 && (
                  <span
                    className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: isActive ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.10)',
                      color: '#f87171',
                    }}
                  >
                    {navUnread}
                  </span>
                )}

                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded-lg text-xs font-medium
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-card)',
                    }}>
                    {item.label}
                    {item.to === '/notifications' && navUnread > 0 && (
                      <span className="ml-1.5 text-[9px] font-bold text-red-400">({navUnread})</span>
                    )}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────── */}
      <div className={`flex-shrink-0 ${collapsed ? 'px-2' : 'px-3'} pb-4 pt-2 space-y-1`}
        style={{ borderTop: '1px solid var(--border-nav)' }}>

        {/* Notifications */}
        <div className={`flex items-center ${collapsed ? 'justify-center px-0 py-1' : 'gap-3 px-1 py-1'}`}>
          <NotificationPanel />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] font-medium whitespace-nowrap"
                style={{ color: 'var(--text-muted)' }}
              >
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle collapsed={collapsed} />

        {/* User info block */}
        <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 rounded-xl font-bold text-xs flex items-center justify-center border
            ${collapsed ? 'w-8 h-8' : 'w-8 h-8'}
            bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border-sky-500/20 text-sky-400`}>
            {initials}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.username}
                </p>
                <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border ${rc.pill}`}>
                  {user?.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 w-full rounded-xl text-[13px] font-medium transition-all duration-200 group border border-transparent
            ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
          `}
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign out
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 rounded-lg text-xs font-medium
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}>
              Sign out
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
