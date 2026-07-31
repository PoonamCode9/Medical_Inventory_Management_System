import NotificationsPage from '../admin/components/NotificationsPage.jsx'
import StaffLayout from './StaffLayout.jsx'
import {
  fetchStaffNotifications,
  markStaffNotificationRead,
  markStaffAllNotificationsRead
} from '../api.js'

export default function StaffNotifications() {
  return (
    <NotificationsPage
      layout={StaffLayout}
      fetchAll={fetchStaffNotifications}
      markRead={markStaffNotificationRead}
      markAllRead={markStaffAllNotificationsRead}
      backLink="/staff/dashboard"
    />
  )
}

