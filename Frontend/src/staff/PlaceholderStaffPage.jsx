import StaffLayout from './StaffLayout.jsx'

export default function PlaceholderStaffPage({ title }) {
  return (
    <StaffLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">{title}</h1>
            <p className="bb-page-subtitle">Module UI will be added here (frontend-only for now).</p>
          </div>
        </div>

        <div className="bb-card bb-card-body">
          <div className="bb-muted">This is a placeholder screen.</div>
        </div>
      </div>
    </StaffLayout>
  )
}

