import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { requireAuthRole } from './auth'

import PharmacistRoutes from './pharmacist/PharmacistRoutes.jsx'

export default function PharmacistDashboard() {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/login')

  useEffect(() => {
    const result = requireAuthRole({ role: 'Pharmacist', redirectTo: '/login' })
    if (!result.ok) {
      setRedirectTo(result.redirectTo)
      setShouldRedirect(true)
    }
  }, [])

  if (shouldRedirect) return <Navigate to={redirectTo} replace />

  return <PharmacistRoutes />
}

