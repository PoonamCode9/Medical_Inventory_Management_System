import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import KpiCard from './components/KpiCard.jsx'
import QuickActions from './components/QuickActions.jsx'
import NotificationsCard from './components/NotificationsCard.jsx'
import { fetchAdminDashboardKpi, fetchAdminRecentNotifications, fetchAdminDashboardCharts } from '../api.js'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

function formatNumber(n) {
  if (n == null) return '0'
  return n.toLocaleString('en-IN')
}

function formatCurrency(n) {
  if (n == null) return '₹0'
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function DashboardHome() {
  const [kpi, setKpi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [chartsData, setChartsData] = useState(null)
  const [chartsLoading, setChartsLoading] = useState(true)

  useEffect(() => {
    fetchAdminDashboardKpi()
      .then(setKpi)
      .catch(console.error)
      .finally(() => setLoading(false))

    fetchAdminRecentNotifications()
      .then(setNotifications)
      .catch(() => {})

    fetchAdminDashboardCharts()
      .then(setChartsData)
      .catch(console.error)
      .finally(() => setChartsLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="bb-main-content">
          <section className="bb-kpi-row" aria-label="Key performance indicators">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bb-kpi-card bb-kpi-card--skeleton" aria-label="Loading">
                <div className="bb-kpi-top">
                  <div className="bb-kpi-icon" />
                  <div className="bb-trend bb-trend--up" />
                </div>
                <div className="bb-kpi-title" />
                <div className="bb-kpi-value" />
                <div className="bb-kpi-spark" />
              </div>
            ))}
          </section>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="bb-main-content">
        {/* SECTION 1: KPI CARDS */}
        <section className="bb-kpi-row" aria-label="Key performance indicators">
          <KpiCard
            title="Total Medicines"
            value={formatNumber(kpi?.totalMedicines)}
            trend="+0%"
            icon="pill"
            spark={[3, 3.2, 3.5, 3.8, 4.0, 4.1, 4.3, 4.5, 4.7, 4.9, 5.0, 5.1]}
          />
          <KpiCard
            title="Current Stock Units"
            value={formatNumber(kpi?.currentStockUnits)}
            trend="+0%"
            icon="stock"
            spark={[2.8, 2.9, 3.0, 3.1, 3.15, 3.2, 3.25, 3.3, 3.35, 3.4, 3.45, 3.5]}
          />
          <KpiCard
            title="Inventory Value"
            value={formatCurrency(kpi?.inventoryValue)}
            trend="+0%"
            icon="value"
            spark={[1, 1.1, 1.15, 1.2, 1.35, 1.33, 1.45, 1.5, 1.6, 1.65, 1.62, 1.72]}
          />
          <KpiCard
            title="Low Stock Items"
            value={formatNumber(kpi?.lowStockItems)}
            trend="0%"
            icon="low"
            spark={[6, 5.8, 5.6, 5.4, 5.2, 5.1, 5, 4.8, 4.7, 4.6, 4.4, 4.2]}
            trendTone="down"
          />
          <KpiCard
            title="Expiring Soon"
            value={formatNumber(kpi?.expiringSoon)}
            trend="0%"
            icon="exp"
            spark={[2.2, 2.25, 2.3, 2.35, 2.4, 2.5, 2.48, 2.52, 2.6, 2.62, 2.7, 2.75]}
          />
          <KpiCard
            title="Monthly Purchases"
            value={formatNumber(kpi?.monthlyPurchases)}
            trend="+0%"
            icon="buy"
            spark={[1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.45, 1.48, 1.55, 1.6, 1.62, 1.7]}
          />
        </section>

        {/* SECTION 2: CHARTS - Monthly Dispenses vs Purchases + Category Distribution */}
        {!chartsLoading && chartsData && (
          <section className="bb-chart-section" aria-label="Analytics charts">
            <div className="bb-analytics-grid">
              {/* Bar Chart - Monthly Dispenses vs Purchases */}
              <div className="bb-col-70">
                <div className="bb-chart-container">
                  <div className="bb-chart-header">
                    <div>
                      <div className="bb-chart-title">Monthly Dispenses vs Purchases</div>
                      <div className="bb-chart-sub">Comparison of dispensed vs purchased quantities per month</div>
                    </div>
                  </div>
                  <div className="bb-chart-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartsData.monthlyDispensesVsPurchases} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,.2)', boxShadow: '0 8px 24px rgba(2,6,23,.1)' }}
                          labelStyle={{ fontWeight: 1000, color: '#0f172a' }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: 8 }}
                          formatter={(value) => <span style={{ fontWeight: 700, color: '#334155', fontSize: 12 }}>{value}</span>}
                        />
                        <Bar dataKey="dispenses" name="Dispenses" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="purchases" name="Purchases" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pie Chart - Medicine Categories */}
              <div className="bb-col-30">
                <div className="bb-chart-container">
                  <div className="bb-chart-header">
                    <div>
                      <div className="bb-chart-title">Medicine Categories</div>
                      <div className="bb-chart-sub">Distribution across categories</div>
                    </div>
                  </div>
                  <div className="bb-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {chartsData.medicineCategoryDistribution && chartsData.medicineCategoryDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={chartsData.medicineCategoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="count"
                            nameKey="category"
                            label={({ category, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {chartsData.medicineCategoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [value, props.payload.category]}
                            contentStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,.2)', boxShadow: '0 8px 24px rgba(2,6,23,.1)' }}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                            formatter={(value, entry) => <span style={{ color: '#334155', fontSize: 11, fontWeight: 700 }}>{entry.payload?.category || value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ color: '#64748b', fontSize: 13, fontWeight: 700 }}>No category data available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: QUICK ACTIONS + NOTIFICATIONS */}
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
                  { label: 'Add Medicine', to: '/admin/medicines' },

                  { label: 'Create Purchase Order', to: '/admin/purchases/orders' },
                  { label: 'Add Supplier', to: '/admin/suppliers' },
                  { label: 'Add User', to: '/admin/users' },
                  { label: 'Stock Adjustment', to: '/admin/inventory/overview' },
                  { label: 'Generate Report', to: '/admin/reports' },
                ]}
              />
            </div>
          </div>
          <NotificationsCard
            notifications={notifications}
            viewAllLink="/admin/notifications"
            title="Recent Notifications"
          />
        </section>
      </div>
    </AdminLayout>
  )
}


