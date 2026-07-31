import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthToken, getUserRoleFromToken, requireAuthRole } from './auth'
import StaffRoutes from './staff/StaffRoutes.jsx'

export default function StaffDashboard() {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/login')

  const result = requireAuthRole({ role: 'Staff', redirectTo: '/login' })

  if (!result.ok) return <Navigate to={result.redirectTo} replace />

  const role = getUserRoleFromToken(getAuthToken())

  return (
    <>
      <div style={{ display: 'none' }}>Role: {role || 'Unknown'}</div>
      <StaffRoutes />
    </>
  )

}

