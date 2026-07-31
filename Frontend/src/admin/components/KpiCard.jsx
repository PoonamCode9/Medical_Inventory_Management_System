export default function KpiCard({ title, value, trend, trendTone = 'up', icon, spark = [] }) {
  const trendClass = trendTone === 'down' ? 'bb-trend bb-trend--down' : 'bb-trend bb-trend--up'

  // Map simple icon types to inline SVGs (no extra deps)
  const iconSvg = (() => {
    switch (icon) {
      case 'pill':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 14l-4 4" />
            <path d="M14 10l6-6" />
            <rect x="3" y="11" width="14" height="6" rx="3" transform="rotate(-45 10 14)" />
          </svg>
        )
      case 'value':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1v22" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H7" />
          </svg>
        )
      case 'low':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M14 7h7v7" />
          </svg>
        )
      case 'out':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 8l8 8" />
          </svg>
        )
      case 'exp':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4" />
            <path d="M19.4 5.6l-2.8 2.8" />
            <path d="M22 12h-4" />
            <path d="M19.4 18.4l-2.8-2.8" />
            <path d="M12 22v-4" />
            <path d="M4.6 18.4l2.8-2.8" />
            <path d="M2 12h4" />
            <path d="M4.6 5.6l2.8 2.8" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      case 'buy':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.8 10.5a2 2 0 002 1.8h8.6a2 2 0 001.9-1.5L22 7H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        )
      case 'stock':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        )
      default:
        return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
    }
  })()

  const max = Math.max(...spark, 1)
  const min = Math.min(...spark, 0)
  const range = Math.max(max - min, 1)

  const points = spark
    .map((v, i) => {
      const x = (i / Math.max(1, spark.length - 1)) * 100
      const y = 100 - ((v - min) / range) * 80 - 10
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <div className="bb-kpi-card" role="group" aria-label={title}>
      <div className="bb-kpi-top">
        <div className="bb-kpi-icon">{iconSvg}</div>
        <div className={trendClass}>{trend}</div>
      </div>
      <div className="bb-kpi-title">{title}</div>
      <div className="bb-kpi-value">{value}</div>
      <div className="bb-kpi-spark">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

