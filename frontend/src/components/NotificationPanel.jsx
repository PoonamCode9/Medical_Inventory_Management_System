import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, CheckCheck, Trash2,
  AlertTriangle, Calendar, ShoppingCart,
  RefreshCw, BellOff, Loader2, ArrowRight,
} from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from '../services/api';

/* ── Helpers ─────────────────────────────────────────────────── */

const TYPE_CONFIG = {
  LOW_STOCK: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    label: 'Low Stock',
    dot: 'bg-amber-400',
    route: '/inventory?filter=lowStock',
    routeLabel: 'View low stock',
  },
  EXPIRY: {
    icon: Calendar,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    label: 'Expiry',
    dot: 'bg-rose-400',
    route: '/inventory?filter=expiring',
    routeLabel: 'View expiring items',
  },
  PURCHASE_ALERT: {
    icon: ShoppingCart,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    label: 'Purchase',
    dot: 'bg-sky-400',
    route: '/purchase-orders',
    routeLabel: 'View purchase orders',
  },
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── NotificationPanel ───────────────────────────────────────── */

export default function NotificationPanel({ onUnreadCountChange }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dismissing, setDismissing] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  // Position state for fixed panel
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const bellRef = useRef(null);
  const panelRef = useRef(null);

  /* Calculate panel position from the bell button */
  const updatePanelPos = useCallback(() => {
    if (!bellRef.current) return;
    const rect = bellRef.current.getBoundingClientRect();
    const panelWidth = 340;
    const panelHeight = 520;
    const viewportHeight = window.innerHeight;

    // Place to the right of bell, aligned top, but flip up if not enough room below
    const left = rect.right + 12;
    let top = rect.top;

    // If panel would overflow bottom, anchor to bottom of viewport
    if (top + panelHeight > viewportHeight - 16) {
      top = viewportHeight - panelHeight - 16;
    }

    // Clamp to viewport
    top = Math.max(8, top);

    setPanelPos({ top, left });
  }, []);

  /* Fetch unread count (for badge) — polling every 30 s */
  const refreshBadge = useCallback(() => {
    getUnreadCount()
      .then((res) => {
        const count = res.data?.count ?? 0;
        setUnreadCount(count);
        onUnreadCountChange?.(count);
      })
      .catch(() => {});
  }, [onUnreadCountChange]);

  /* Fetch full notification list */
  const loadNotifications = useCallback(() => {
    setLoading(true);
    getNotifications()
      .then((res) => setNotifications(res.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  /* Badge polling */
  useEffect(() => {
    refreshBadge();
    const interval = setInterval(refreshBadge, 30_000);
    return () => clearInterval(interval);
  }, [refreshBadge]);

  /* Load list when panel opens */
  useEffect(() => {
    if (open) {
      updatePanelPos();
      loadNotifications();
    }
  }, [open, updatePanelPos, loadNotifications]);

  /* Reposition on scroll / resize */
  useEffect(() => {
    if (!open) return;
    const handler = () => updatePanelPos();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [open, updatePanelPos]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  /* Actions */
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'READ' } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (_) {}
  };

  const handleDismiss = async (id) => {
    setDismissing(id);
    try {
      await dismissNotification(id);
      const dismissed = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (dismissed?.status === 'UNREAD') {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (_) {}
    setDismissing(null);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
      setUnreadCount(0);
    } catch (_) {}
    setMarkingAll(false);
  };

  /* Navigate on notification click — also marks as read and closes panel */
  const handleNotificationClick = async (n) => {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.PURCHASE_ALERT;
    if (!cfg.route) return;
    // Mark as read silently
    if (n.status === 'UNREAD') {
      try {
        await markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, status: 'READ' } : item))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_) {}
    }
    setOpen(false);
    navigate(cfg.route);
  };

  /* ── Panel content (portaled) ──────────────────────────────── */
  const panelContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Invisible backdrop to close on click-away */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            key="notif-panel"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[999] flex flex-col"
            style={{
              top: panelPos.top,
              left: panelPos.left,
              width: 340,
              maxHeight: 520,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-modal)',
            }}
          >
            {/* ── Header ─── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="badge text-rose-400 bg-rose-500/10 border-rose-500/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markingAll}
                    title="Mark all as read"
                    className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-all duration-150"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#38bdf8';
                      e.currentTarget.style.background = 'rgba(56,189,248,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {markingAll
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <CheckCheck className="w-3 h-3" />}
                    All read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--border-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Body ─── */}
            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading…</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                                  flex items-center justify-center">
                    <BellOff className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    All caught up!
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    No notifications right now.
                  </p>
                </div>
              ) : (
                <ul className="py-1.5">
                  <AnimatePresence initial={false}>
                    {notifications.map((n) => {
                      const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.PURCHASE_ALERT;
                      const Icon = cfg.icon;
                      const isUnread = n.status === 'UNREAD';
                      const isDismissing = dismissing === n.id;

                      return (
                        <motion.li
                          key={n.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="group relative mx-2 mb-1 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150"
                          style={{
                            background: isUnread ? 'rgba(14,165,233,0.05)' : 'transparent',
                            border: isUnread ? '1px solid rgba(14,165,233,0.1)' : '1px solid transparent',
                          }}
                          onClick={() => handleNotificationClick(n)}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.08)'; }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isUnread ? 'rgba(14,165,233,0.05)' : 'transparent';
                          }}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Icon */}
                            <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border ${cfg.bg} mt-0.5`}>
                              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 pr-14">
                              <p
                                className="text-[12px] leading-[1.5] break-words"
                                style={{
                                  color: isUnread ? 'var(--text-primary)' : 'var(--text-secondary)',
                                  fontWeight: isUnread ? 500 : 400,
                                }}
                              >
                                {n.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold"
                                  style={{ color: 'var(--text-muted)' }}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                  {cfg.label}
                                </span>
                                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                  · {timeAgo(n.createdAt)}
                                </span>
                                {/* Navigate hint — visible on hover */}
                                <span
                                  className="text-[10px] font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                  style={{ color: '#38bdf8' }}
                                >
                                  {cfg.routeLabel}
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>

                            {/* Unread dot */}
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1.5" />
                            )}
                          </div>

                          {/* Hover actions — stop propagation so they don't trigger navigation */}
                          <div className="absolute right-2 top-2 flex items-center gap-1
                                          opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            {isUnread && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}
                                title="Mark as read"
                                className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#38bdf8';
                                  e.currentTarget.style.background = 'rgba(56,189,248,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = 'var(--text-muted)';
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <CheckCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDismiss(n.id); }}
                              title="Dismiss"
                              disabled={isDismissing}
                              className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
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
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Trash2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* ── Footer ─── */}
            {notifications.length > 0 && (
              <div
                className="px-4 py-2.5 flex items-center justify-between flex-shrink-0"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={loadNotifications}
                  className="flex items-center gap-1 text-[10.5px] font-medium transition-all duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <>
      {/* Bell Button — stays in the sidebar flow */}
      <button
        ref={bellRef}
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 border border-transparent"
        style={{ color: open ? 'var(--text-primary)' : 'var(--text-muted)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--border-subtle)';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = open ? 'var(--text-primary)' : 'var(--text-muted)';
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-[3px] rounded-full
                         flex items-center justify-center text-[9px] font-bold text-white pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Panel — portaled to document.body for correct z-index stacking */}
      {ReactDOM.createPortal(panelContent, document.body)}
    </>
  );
}
