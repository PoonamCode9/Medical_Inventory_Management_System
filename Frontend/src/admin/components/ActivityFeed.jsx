export default function ActivityFeed({ items = [] }) {
  return (
    <div className="bb-activity">
      {items.map((it, idx) => {
        const icon = (() => {
          switch (it.type) {
            case 'medicine':
              return '💊'
            case 'po':
              return '✅'
            case 'adjust':
              return '🧾'
            case 'supplier':
              return '🏢'
            case 'user':
              return '👤'
            default:
              return '•'
          }
        })()

        return (
          <div key={idx} className="bb-activity-item">
            <div className="bb-activity-icon">{icon}</div>
            <div className="bb-activity-body">
              <div className="bb-activity-text">{it.text}</div>
              <div className="bb-activity-time">{it.time}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

