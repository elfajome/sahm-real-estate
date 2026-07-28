import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MdOutlinePerson } from '@/components/icons/index.jsx'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { cn } from '@/utils/cn.js'

/**
 * Profile dashboard layout.
 *
 * Desktop (lg+): the existing sidebar, unchanged.
 * Tablet/mobile: the sidebar is hidden — a floating profile button (fixed,
 * vertically centered on the right edge, always visible while scrolling)
 * opens a slide-in panel that reuses the SAME ProfileSidebar component, so
 * no layout or functionality is duplicated. Clicking outside closes it.
 */
export function DashboardLayout() {
  const { t } = useLocale()
  const { pathname } = useLocation()
  const [panelOpen, setPanelOpen] = useState(false)

  // Navigating to another profile page closes the panel automatically.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPanelOpen(false)
  }, [pathname])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop sidebar — unchanged on lg+, hidden on tablet/mobile */}
        <div className="hidden lg:block">
          <ProfileSidebar />
        </div>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Floating profile button — tablet/mobile only */}
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        aria-label={t('profile.openPanel')}
        aria-expanded={panelOpen}
        className="fixed right-0 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-l-xl bg-primary text-white shadow-lg transition-colors hover:bg-accent lg:hidden"
      >
        <MdOutlinePerson className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Slide-in panel — reuses the existing ProfileSidebar */}
      <div
        className={cn('fixed inset-0 z-50 lg:hidden', !panelOpen && 'pointer-events-none')}
        role="dialog"
        aria-modal="true"
        aria-hidden={!panelOpen}
        inert={!panelOpen}
      >
        {/* Clicking outside (the overlay) closes the panel */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-300',
            panelOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setPanelOpen(false)}
          aria-hidden
        />
        <aside
          className={cn(
            'absolute right-0 top-0 h-full w-[min(100%,320px)] overflow-y-auto bg-white p-4 shadow-xl transition-transform duration-300 ease-out',
            panelOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <ProfileSidebar />
        </aside>
      </div>
    </div>
  )
}
