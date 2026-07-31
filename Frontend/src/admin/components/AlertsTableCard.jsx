import { useState } from 'react'

export default function AlertsTableCard({ title, columns, rows, viewAllLabel }) {
  const [toast, setToast] = useState(null)

  return (
    <div className="bb-card bb-card--tight">
      <div className="bb-card-header bb-card-header--row">
        <div>
          <div className="bb-card-title">{title}</div>
          <div className="bb-card-sub">Priority actions for the next 7–30 days</div>
        </div>
        <button
          type="button"
          className="bb-btn bb-btn--ghost bb-btn--sm"
          onClick={() => setToast('View All clicked (mock)')}
        >
          {viewAllLabel}
        </button>
      </div>

      {toast && <div className="bb-toast">{toast}</div>}

      <div className="bb-card-body">
        <div className="bb-table-wrap bb-table-wrap--compact">
          <table className="bb-table bb-table--compact">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  {r.map((cell, i) => (
                    <td key={i}>
                      {typeof cell === 'string' && cell.includes('Critical') ? (
                        <span className="bb-status bb-status--danger">{cell}</span>
                      ) : i === 3 && title.includes('Low Stock') && typeof cell === 'string' ? (
                        <span className={cell.includes('Critical') ? 'bb-status bb-status--danger' : 'bb-status bb-status--warn'}>{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

