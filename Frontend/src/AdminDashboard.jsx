import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { requireAuthRole } from './auth'

import AdminRoutes from './admin/AdminRoutes.jsx'

export default function AdminDashboard() {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/login')

  useEffect(() => {
    const result = requireAuthRole({ role: 'Admin', redirectTo: '/login' })
    if (!result.ok) {
      setRedirectTo(result.redirectTo)
      setShouldRedirect(true)
    }
  }, [])

  if (shouldRedirect) return <Navigate to={redirectTo} replace />

  return <AdminRoutes />
}

