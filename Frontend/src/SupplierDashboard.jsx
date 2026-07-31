import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { requireAuthRole } from './auth'
import SupplierRoutes from './supplier/SupplierRoutes.jsx'

export default function SupplierDashboard() {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/login')

  useEffect(() => {
    const result = requireAuthRole({ role: 'Supplier', redirectTo: '/login' })
    if (!result.ok) {
      setRedirectTo(result.redirectTo)
      setShouldRedirect(true)
    }
  }, [])

  if (shouldRedirect) return <Navigate to={redirectTo} replace />

  return <SupplierRoutes />
}

