import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { loginPath } from '@/constants/routes.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'

export function ProtectedRoute() {
  const { isAuthenticated, hydrated } = useAuth()
  const location = useLocation()

  if (!hydrated) return <PageLoader fullScreen />

  if (!isAuthenticated) {
    const returnUrl = location.pathname + location.search
    return <Navigate to={loginPath(returnUrl)} replace />
  }

  return <Outlet />
}
