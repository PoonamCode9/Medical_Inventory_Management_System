import NotificationsPage from './components/NotificationsPage.jsx'
import AdminLayout from './AdminLayout.jsx'
import {
  fetchAdminNotifications,
  markAdminNotificationRead,
  markAdminAllNotificationsRead
} from '../api.js'

export default function AdminNotifications() {
  return (
    <NotificationsPage
      layout={AdminLayout}
      fetchAll={fetchAdminNotifications}
      markRead={markAdminNotificationRead}
      markAllRead={markAdminAllNotificationsRead}
      backLink="/admin/dashboard"
    />
  )
}

