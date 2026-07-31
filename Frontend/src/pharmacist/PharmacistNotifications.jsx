import NotificationsPage from '../admin/components/NotificationsPage.jsx'
import PharmacistLayout from './PharmacistLayout.jsx'
import {
  fetchPharmacistNotifications,
  markPharmacistNotificationRead,
  markPharmacistAllNotificationsRead
} from '../api.js'

export default function PharmacistNotifications() {
  return (
    <NotificationsPage
      layout={PharmacistLayout}
      fetchAll={fetchPharmacistNotifications}
      markRead={markPharmacistNotificationRead}
      markAllRead={markPharmacistAllNotificationsRead}
      backLink="/pharmacist/dashboard"
    />
  )
}

