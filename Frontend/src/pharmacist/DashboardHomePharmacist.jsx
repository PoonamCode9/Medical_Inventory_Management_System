import { useEffect, useState } from 'react'
import KpiCard from '../admin/components/KpiCard.jsx'
import QuickActions from '../admin/components/QuickActions.jsx'
import NotificationsCard from '../admin/components/NotificationsCard.jsx'
import PharmacistLayout from './PharmacistLayout.jsx'
import { fetchPharmacistDashboardKpi, fetchPharmacistRecentNotifications, fetchPharmacistDashboardCharts } from '../api.js'
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

export default function DashboardHomePharmacist() {
  const [kpi, setKpi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [chartsData, setChartsData] = useState(null)
  const [chartsLoading, setChartsLoading] = useState(true)

  useEffect(() => {
    fetchPharmacistDashboardKpi()
      .then(setKpi)
      .catch(console.error)
      .finally(() => setLoading(false))

    fetchPharmacistRecentNotifications()
      .then(setNotifications)
      .catch(() => {})

    fetchPharmacistDashboardCharts()
      .then(setChartsData)
      .catch(console.error)
      .finally(() => setChartsLoading(false))
  }, [])

  if (loading) {
    return (
      <PharmacistLayout>
        <div className="bb-main-content">
          <section className="bb-kpi-row" aria-label="Key performance indicators">
            {[...Array(5)].map((_, i) => (
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
      </PharmacistLayout>
    )
  }

  return (
    <PharmacistLayout>
      <div className="bb-main-content">
        <section className="bb-kpi-row" aria-label="Key performance indicators">
          <KpiCard
            title="Total Medicines"
            value={formatNumber(kpi?.totalMedicines)}
            trend="+0%"
            icon="pill"
            spark={[3, 4, 4.3, 4.8, 5.2, 5.1, 5.5, 5.7, 6.1, 6.4, 6.2, 6.6]}
          />
          {/* <KpiCard
            title="Inventory Value"
            value={formatCurrency(kpi?.inventoryValue)}
            trend="+0%"
            icon="value"
            spark={[1, 1.1, 1.15, 1.2, 1.35, 1.33, 1.45, 1.5, 1.6, 1.65, 1.62, 1.72]}
          /> */}
          <KpiCard
            title="Low Stock Items"
            value={formatNumber(kpi?.lowStockItems)}
            trend="0%"
            icon="low"
            spark={[6, 5.8, 5.6, 5.4, 5.2, 5.1, 5, 4.8, 4.7, 4.6, 4.4, 4.2]}
            trendTone="down"
          />
          <KpiCard
            title="Expiring Medicines"
            value={formatNumber(kpi?.expiringSoon)}
            trend="0%"
            icon="exp"
            spark={[2.2, 2.25, 2.3, 2.35, 2.4, 2.5, 2.48, 2.52, 2.6, 2.62, 2.7, 2.75]}
          />
          <KpiCard
            title="Total Sales"
            value={formatNumber(kpi?.monthlyPurchases)}
            trend="+0%"
            icon="buy"
            spark={[1, 1.1, 1.15, 1.2, 1.35, 1.33, 1.45, 1.5, 1.6, 1.65, 1.62, 1.72]}
          />
        </section>

        {/* SECTION 2: CHARTS - Top Selling Medicines + Category Distribution */}
        {!chartsLoading && chartsData && (
          <section className="bb-chart-section" aria-label="Analytics charts">
            <div className="bb-analytics-grid">
              {/* Horizontal Bar Chart - Top 5 Selling Medicines */}
              <div className="bb-col-70">
                <div className="bb-chart-container">
                  <div className="bb-chart-header">
                    <div>
                      <div className="bb-chart-title">Top Selling Medicines</div>
                      <div className="bb-chart-sub">Most dispensed medicines by quantity</div>
                    </div>
                  </div>
                  <div className="bb-chart-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartsData.topSellingMedicines}
                        layout="vertical"
                        margin={{ top: 8, right: 16, left: 16, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="medicineName"
                          width={180}
                          tick={{ fontSize: 11, fontWeight: 600 }}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,.2)', boxShadow: '0 8px 24px rgba(2,6,23,.1)' }}
                          labelStyle={{ fontWeight: 1000, color: '#0f172a' }}
                          formatter={(value, name, props) => [value, props.payload.medicineName]}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: 8 }}
                          formatter={() => <span style={{ fontWeight: 700, color: '#334155', fontSize: 12 }}>Total Dispensed</span>}
                        />
                        <Bar
                          dataKey="totalQuantityDispensed"
                          name="Total Dispensed"
                          fill="#2563eb"
                          radius={[0, 4, 4, 0]}
                          maxBarSize={24}
                          label={{ position: 'right', fontSize: 11, fontWeight: 700, fill: '#475569' }}
                        />
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
                <div className="bb-card-sub">Dispense, update stock, and process requests</div>
              </div>
            </div>
            <div className="bb-card-body">
              <QuickActions
                actions={[
                  { label: 'Dispense Medicine', to: '/pharmacist/dispensing' },
                  { label: 'Search Medicine', to: '/pharmacist/search' },
                  { label: 'Stock Update', to: '/pharmacist/inventory' },
                  { label: 'Create Purchase Request', to: '/pharmacist/purchase-requests' },
                  { label: 'Return Products', to: '/pharmacist/returns' },
                ]}
              />
            </div>
          </div>
          <NotificationsCard
            notifications={notifications}
            viewAllLink="/pharmacist/notifications"
            title="Recent Notifications"
          />
        </section>
      </div>
    </PharmacistLayout>
  )
}

