export function getAuthToken() {
  return localStorage.getItem('authToken')
}

export function decodeJwtPayload(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payloadBase64Url = parts[1]
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payloadJson = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )

    return JSON.parse(payloadJson)
  } catch {
    return null
  }
}

export function getUserRoleFromToken(token = getAuthToken()) {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  return payload?.role ?? null
}

export function requireAuthRole({ role, redirectTo = '/login' } = {}) {
  const token = getAuthToken()
  const userRole = getUserRoleFromToken(token)

  if (!token || !userRole) return { ok: false, redirectTo }

  if (role && userRole !== role) return { ok: false, redirectTo }

  return { ok: true, role: userRole }
}

export function getDefaultDashboardPath() {
  const userRole = getUserRoleFromToken()
  if (userRole === 'Admin') return '/admin/dashboard'
  if (userRole === 'Pharmacist') return '/pharmacist/dashboard'
  if (userRole === 'Supplier') return '/supplier/dashboard'
  if (userRole === 'Staff') return '/staff/dashboard'
  return '/login'

}
