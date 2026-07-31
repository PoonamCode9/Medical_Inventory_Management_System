import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotificationsPage({
  layout: Layout,
  fetchAll,
  markRead,
  markAllRead,
  backLink
}) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAll()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to load notifications', e)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [fetchAll])

  useEffect(() => {
    load()
  }, [load])

  const handleMarkRead = async (id) => {
    try {
      await markRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (e) {
      console.error('Failed to mark as read', e)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (e) {
      console.error('Failed to mark all as read', e)
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'PO': return { label: 'PO', style: 'bb-status bb-status--ok' }
      case 'LOW_STOCK': return { label: 'Low Stock', style: 'bb-status bb-status--warn' }
      case 'OUT_OF_STOCK': return { label: 'Out of Stock', style: 'bb-status bb-status--danger' }
      case 'EXPIRING': return { label: 'Expiring', style: 'bb-status bb-status--warn' }
      case 'TASK': return { label: 'Task', style: 'bb-status bb-status--ok' }
      case 'MESSAGE': return { label: 'Message', style: 'bb-status' }
      default: return { label: type, style: 'bb-status' }
    }
  }

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Layout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Notifications</h1>
            <p className="bb-page-subtitle">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          <div className="bb-page-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="bb-btn bb-btn--primary"
                onClick={handleMarkAllRead}
              >
                Mark All as Read
              </button>
            )}
            <button
              type="button"
              className="bb-btn"
              onClick={() => navigate(backLink || '..')}
            >
              Back
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bb-card">
            <div className="bb-card-body" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
              Loading notifications...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bb-card">
            <div className="bb-card-body" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>No notifications yet</div>
              <div style={{ marginTop: 8, fontSize: 13 }}>Notifications will appear here when triggered</div>
            </div>
          </div>
        ) : (
          <div className="bb-card">
            <div className="bb-table-wrap">
              <table className="bb-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => {
                    const badge = getTypeBadge(n.type)
                    return (
                      <tr key={n.id} style={{ background: n.read ? undefined : 'rgba(59, 130, 246, 0.04)' }}>
                        <td>
                          {n.read ? (
                            <span className="bb-status bb-status--ok">Read</span>
                          ) : (
                            <span className="bb-status bb-status--warn">Unread</span>
                          )}
                        </td>
                        <td>
                          <span className={badge.style}>{badge.label}</span>
                        </td>
                        <td style={{ maxWidth: 300 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{n.message}</div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#64748b' }}>
                          {getTimeAgo(n.createdAt)}
                          <div style={{ fontSize: 11 }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                        </td>
                        <td>
                          <div className="bb-table-actions">
                            {!n.read && (
                              <button
                                type="button"
                                className="bb-link-btn"
                                onClick={() => handleMarkRead(n.id)}
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

