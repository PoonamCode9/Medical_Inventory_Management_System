import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import {
  Bell, CheckCheck, Trash2, AlertTriangle, Calendar,
  ShoppingCart, BellOff, Loader2, ArrowRight, RefreshCw,
} from 'lucide-react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from '../services/api';

/* ── Type config ──────────────────────────────────────────── */
const TYPE_CONFIG = {
  LOW_STOCK: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    label: 'Low Stock',
    dot: 'bg-amber-400',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    route: '/inventory?filter=lowStock',
    routeLabel: 'View low stock items',
  },
  EXPIRY: {
    icon: Calendar,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    label: 'Expiry',
    dot: 'bg-rose-400',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    route: '/inventory?filter=expiring',
    routeLabel: 'View expiring items',
  },
  PURCHASE_ALERT: {
    icon: ShoppingCart,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    label: 'Purchase',
    dot: 'bg-sky-400',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    route: '/purchase-orders',
    routeLabel: 'View purchase orders',
  },
};

const TABS = [
  { key: 'all',           label: 'All' },
  { key: 'unread',        label: 'Unread' },
  { key: 'LOW_STOCK',     label: 'Low Stock' },
  { key: 'EXPIRY',        label: 'Expiry' },
  { key: 'PURCHASE_ALERT', label: 'Purchase' },
];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Skeleton row ──────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="flex items-start gap-4 px-6 py-4 animate-pulse">
    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/4 rounded-lg" style={{ background: 'var(--border-subtle)' }} />
      <div className="h-3 w-1/2 rounded-lg"   style={{ background: 'var(--border-subtle)' }} />
    </div>
    <div className="h-3 w-16 rounded-lg flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />
  </div>
);

/* ── Page ──────────────────────────────────────────────────── */
const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState('all');
  const [dismissingId, setDismissingId]   = useState(null);
  const [markingAll, setMarkingAll]       = useState(false);
  const [dismissingAll, setDismissingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Derived lists ───────────────────────────────────────── */
  const filtered = notifications.filter((n) => {
    if (activeTab === 'all')    return true;
    if (activeTab === 'unread') return n.status === 'UNREAD';
    return n.type === activeTab;
  });

  const tabCount = (key) => {
    if (key === 'all')    return notifications.length;
    if (key === 'unread') return notifications.filter((n) => n.status === 'UNREAD').length;
    return notifications.filter((n) => n.type === key).length;
  };

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  /* ── Actions ─────────────────────────────────────────────── */
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'READ' } : n))
      );
    } catch (_) {}
  };

  const handleDismiss = async (id) => {
    setDismissingId(id);
    try {
      await dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_) {}
    setDismissingId(null);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
    } catch (_) {}
    setMarkingAll(false);
  };

  const handleDismissAll = async () => {
    setDismissingAll(true);
    try {
      const toDelete = filtered.map((n) => n.id);
      await Promise.allSettled(toDelete.map((id) => dismissNotification(id)));
      setNotifications((prev) => prev.filter((n) => !toDelete.includes(n.id)));
    } catch (_) {}
    setDismissingAll(false);
  };

  const handleNotificationClick = async (n) => {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.PURCHASE_ALERT;
    if (n.status === 'UNREAD') {
      try {
        await markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, status: 'READ' } : item))
        );
      } catch (_) {}
    }
    if (cfg.route) navigate(cfg.route);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">

        {/* ── Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-indigo-400" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-[3px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading…' : `${notifications.length} total · ${unreadCount} unread`}
              </p>
            </div>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={load}
              className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                style={{ color: '#38bdf8' }}
              >
                {markingAll
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <CheckCheck className="w-3.5 h-3.5" />}
                Mark all read
              </button>
            )}

            {filtered.length > 0 && (
              <button
                onClick={handleDismissAll}
                disabled={dismissingAll}
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                style={{ color: '#f87171' }}
              >
                {dismissingAll
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />}
                Dismiss {activeTab === 'all' ? 'all' : 'shown'}
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Filter Tabs ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="flex items-center gap-1 mb-6 p-1 rounded-2xl overflow-x-auto"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-default)' }}
        >
          {TABS.map((tab) => {
            const count = tabCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{
                      background: isActive
                        ? (tab.key === 'unread' ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.12)')
                        : 'var(--border-default)',
                      color: isActive
                        ? (tab.key === 'unread' ? '#f87171' : '#38bdf8')
                        : 'var(--text-muted)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Notification List ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          {loading ? (
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {[0, 1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <BellOff className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'all'
                    ? 'No notifications'
                    : `No ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} notifications`}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {activeTab === 'unread' ? 'All caught up!' : 'Check back later.'}
                </p>
              </div>
            </motion.div>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {filtered.map((n, idx) => {
                  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.PURCHASE_ALERT;
                  const Icon = cfg.icon;
                  const isUnread = n.status === 'UNREAD';
                  const isDismissing = dismissingId === n.id;

                  return (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group relative overflow-hidden"
                      style={{
                        borderBottom: idx < filtered.length - 1
                          ? '1px solid var(--border-subtle)'
                          : 'none',
                      }}
                    >
                      {/* Unread left accent bar */}
                      {isUnread && (
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky-400 z-10" />
                      )}

                      <div
                        className="flex items-start gap-4 px-6 py-4 cursor-pointer transition-all duration-150"
                        style={{ background: isUnread ? 'rgba(14,165,233,0.03)' : 'transparent' }}
                        onClick={() => handleNotificationClick(n)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.06)'; }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isUnread ? 'rgba(14,165,233,0.03)' : 'transparent';
                        }}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${cfg.bg}`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p
                              className="text-sm leading-relaxed break-words flex-1"
                              style={{
                                color: isUnread ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: isUnread ? 500 : 400,
                              }}
                            >
                              {n.message}
                            </p>
                            <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {timeAgo(n.createdAt)}
                            </span>
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                            <span className={`badge text-[10px] ${cfg.badgeColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1 inline-block`} />
                              {cfg.label}
                            </span>

                            {isUnread && (
                              <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                                Unread
                              </span>
                            )}

                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {formatDate(n.createdAt)}
                            </span>

                            <span
                              className="text-[11px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-auto"
                              style={{ color: '#38bdf8' }}
                            >
                              {cfg.routeLabel}
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div
                          className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isUnread && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              title="Mark as read"
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={{ color: 'var(--text-muted)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#38bdf8';
                                e.currentTarget.style.background = 'rgba(56,189,248,0.10)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDismiss(n.id)}
                            disabled={isDismissing}
                            title="Dismiss"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#f87171';
                              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-muted)';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {isDismissing
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        {/* Footer summary */}
        {!loading && filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-xs mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Showing {filtered.length} of {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </motion.p>
        )}

      </div>
    </Layout>
  );
};

export default Notifications;
