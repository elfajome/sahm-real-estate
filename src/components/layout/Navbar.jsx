import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiMenu, FiX } from '@/components/icons/index.jsx'
import { ROUTES, loginPath } from '@/constants/routes.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import { Button } from '@/components/ui/Button.jsx'
import { cn } from '@/utils/cn.js'
import logo from '@/assets/logo sahm.png'

const navLinks = [
  { key: 'home', route: ROUTES.HOME, labelKey: 'nav.home' },
  { key: 'listings', route: ROUTES.LISTINGS, labelKey: 'nav.listings' },
  { key: 'services', route: ROUTES.SERVICES, labelKey: 'nav.services' },
  { key: 'about', route: ROUTES.ABOUT, labelKey: 'nav.about' },
  { key: 'contact', route: ROUTES.CONTACT, labelKey: 'nav.contact' },
]

export function Navbar() {
  const { t, toggleLocale } = useLocale()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  // Close the drawer with Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleAddProperty = () => {
    closeMenu()
    if (isAuthenticated) navigate(ROUTES.LISTING_CREATE)
    else navigate(loginPath(ROUTES.LISTING_CREATE))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex container items-center justify-between gap-4 px-4 py-4 lg:px-18">
        <Link to={ROUTES.HOME} onClick={closeMenu}>
          <img src={logo} className="h-15 cursor-pointer" alt="logo sahm" />
        </Link>

        {/* Desktop navigation (unchanged) */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = pathname === link.route
            return (
              <Link
                key={link.key}
                to={link.route}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium transition lg:text-lg hover:text-accent',
                  isActive ? 'font-semibold text-primary' : 'text-text',
                )}
              >
                {t(link.labelKey)}
              </Link>
            )
          })}
        </nav>

        {/* Tablet & mobile: Logo + Language Switch + Hamburger only */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded cursor-pointer border border-border px-3.5 py-2 text-md font-medium text-text hover:bg-bg-light"
          >
            {t('nav.lang')}
          </button>
          <Button type="button" size="md" className="hidden! cursor-pointer lg:inline-flex!" onClick={handleAddProperty}>
            {t('nav.addProperty')}
          </Button>
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-text transition hover:bg-bg-light lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={t('nav.menu')}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Drawer overlay */}
      <div
        className={cn(
          'fixed inset-0 z-80 bg-black/40 transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Navigation Drawer */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        className={cn(
          'fixed inset-y-0 inset-e-0 z-120 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
          menuOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <img src={logo} className="h-12" alt="logo sahm" />
          <button
            type="button"
            onClick={closeMenu}
            aria-label={t('common.close')}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-text transition hover:bg-bg-light"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
          {navLinks.map((link) => {
            const isActive = pathname === link.route
            return (
              <Link
                key={link.key}
                to={link.route}
                onClick={closeMenu}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-bg-light hover:text-accent',
                  isActive ? 'font-semibold text-primary' : 'text-text',
                )}
              >
                {t(link.labelKey)}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <Button type="button" size="md" className="w-full cursor-pointer" onClick={handleAddProperty}>
            {t('nav.addProperty')}
          </Button>
        </div>
      </aside>
    </header>
  )
}
