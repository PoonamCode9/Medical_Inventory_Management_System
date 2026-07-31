import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StaffLayout from './StaffLayout.jsx'
import KpiCard from '../admin/components/KpiCard.jsx'
import QuickActions from '../admin/components/QuickActions.jsx'
import NotificationsCard from '../admin/components/NotificationsCard.jsx'
import { fetchStaffTaskCounts, fetchStaffRecentNotifications } from '../api.js'

export default function StaffDashboardHome() {
  const [taskCounts, setTaskCounts] = useState({ pending: 0, completed: 0 })
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchStaffTaskCounts()
      .then(setTaskCounts)
      .catch(() => {})
    fetchStaffRecentNotifications()
      .then(setNotifications)
      .catch(() => {})
  }, [])

  return (
    <StaffLayout>
      <div className="bb-main-content">
        <section
          className="bb-kpi-row"
          aria-label="Key performance indicators"
        >
          <KpiCard
            title="Received Today"
            value="0"
            trend="+0%"
            icon="truck"
            spark={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
          />
          <KpiCard
            title="Low Stock Medicines"
            value="0"
            trend="0%"
            icon="low"
            spark={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
            trendTone="down"
          />
          <KpiCard
            title="Damaged Items"
            value="7"
            trend="+1.0%"
            icon="out"
            spark={[2, 2.1, 2.0, 2.15, 2.2, 2.18, 2.25, 2.3, 2.35, 2.32, 2.4, 2.45]}
          />
          <KpiCard
            title="Tasks Assigned"
            value={String(taskCounts.pending)}
            trend={`${taskCounts.completed} completed`}
            icon="file"
            spark={[1.2, 1.25, 1.3, 1.35, 1.4, 1.48, 1.5, 1.55, 1.6, 1.62, 1.7, 1.75]}
          />
        </section>

        <section className="bb-two-col" aria-label="Quick actions">
          <div className="bb-card">
            <div className="bb-card-header">
              <div>
                <div className="bb-card-title">Quick Actions</div>
                <div className="bb-card-sub">Common workflows at your fingertips</div>
              </div>
            </div>
            <div className="bb-card-body">
              <QuickActions
                actions={[
                  { label: 'My Tasks', to: '/staff/dashboard/tasks' },
                  {
                    label: 'Receive Inventory',
                    to: '/staff/dashboard/receive-inventory',
                  },
                  {
                    label: 'Stock Update',
                    to: '/staff/dashboard/stock-adjust',
                  },
                  { label: 'Alerts', to: '/staff/dashboard/alerts' },
                ]}
              />
            </div>
          </div>

          <div className="bb-card">
            <div className="bb-card-header">
              <div>
                <div className="bb-card-title">My Tasks</div>
                <div className="bb-card-sub">Track your assigned tasks</div>
              </div>
            </div>
            <div className="bb-card-body">
              <div
                style={{
                  display: 'flex', gap: 16, cursor: 'pointer',
                  padding: 8
                }}
                onClick={() => navigate('/staff/dashboard/tasks')}
              >
                <div
                  style={{
                    flex: 1, background: 'rgba(245,158,11,0.1)',
                    borderRadius: 14, padding: 16, textAlign: 'center',
                    border: '1px solid rgba(245,158,11,0.2)'
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 1000, color: '#b45309' }}>
                    {taskCounts.pending}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginTop: 4 }}>
                    Pending
                  </div>
                </div>
                <div
                  style={{
                    flex: 1, background: 'rgba(16,185,129,0.1)',
                    borderRadius: 14, padding: 16, textAlign: 'center',
                    border: '1px solid rgba(16,185,129,0.2)'
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 1000, color: '#059669' }}>
                    {taskCounts.completed}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#047857', marginTop: 4 }}>
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NotificationsCard
            notifications={notifications}
            viewAllLink="/staff/dashboard/notifications"
            title="Recent Notifications"
          />
        </section>
      </div>
    </StaffLayout>
  )
}

