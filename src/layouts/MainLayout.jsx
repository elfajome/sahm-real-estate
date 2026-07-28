import { Outlet } from 'react-router-dom'
import { GuestTopBar } from '@/components/layout/GuestTopBar.jsx'
import { AuthenticatedTopBar } from '@/components/layout/AuthenticatedTopBar.jsx'
import { Navbar } from '@/components/layout/Navbar.jsx'
import { Breadcrumb } from '@/components/layout/Breadcrumb.jsx'
import { Footer } from '@/components/layout/Footer.jsx'
import { ToastProvider } from '@/components/ui/Toast.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'

export function MainLayout() {
  const { isAuthenticated, hydrated } = useAuth()

  if (!hydrated) return <PageLoader fullScreen />

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        {isAuthenticated ? <AuthenticatedTopBar /> : <GuestTopBar />}
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}
