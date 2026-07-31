import { useNavigate } from 'react-router-dom'

export default function NotificationsCard({ notifications = [], viewAllLink, title = 'Recent Notifications' }) {
  const navigate = useNavigate()

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PO': return '📦'
      case 'LOW_STOCK':
      case 'OUT_OF_STOCK': return '⚠️'
      case 'EXPIRING': return '⏰'
      case 'TASK': return '✅'
      case 'MESSAGE': return '📩'
      default: return '🔔'
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

  const displayed = notifications.slice(0, 5)

  return (
    <div className="bb-card">
      <div className="bb-card-header">
        <div>
          <div className="bb-card-title">{title}</div>
          <div className="bb-card-sub">Stay updated with latest activities</div>
        </div>
        {viewAllLink && (
          <button
            type="button"
            className="bb-btn bb-btn--ghost bb-btn--sm"
            onClick={() => navigate(viewAllLink)}
          >
            View All
          </button>
        )}
      </div>
      <div className="bb-card-body">
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontWeight: 600 }}>
            No notifications yet
          </div>
        ) : (
          <div className="bb-activity">
            {displayed.map((n) => (
              <div key={n.id} className="bb-activity-item" style={{ opacity: n.read ? 0.6 : 1 }}>
                <div className="bb-activity-icon">{getTypeIcon(n.type)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="bb-activity-text" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.title}
                    </span>
                    {!n.read && (
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: '50%', background: '#3b82f6',
                          flexShrink: 0, display: 'inline-block'
                        }}
                      />
                    )}
                  </div>
                  <div className="bb-activity-text" style={{ fontWeight: 500, fontSize: 12, color: '#475569', marginTop: 2 }}>
                    {n.message}
                  </div>
                  <div className="bb-activity-time">{getTimeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

