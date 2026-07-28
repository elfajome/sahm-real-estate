import { Link, useLocation, useNavigate } from 'react-router-dom'
import { profileNav } from '@/constants/profileNav.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import { cn } from '@/utils/cn.js'
import { ROUTES } from '@/constants/routes.js'
import { MdLogout } from '@/components/icons/index.jsx'

export function ProfileSidebar() {
  const { pathname } = useLocation()
  const { t } = useLocale()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <nav className="overflow-hidden rounded-lg border border-border bg-white" aria-label="Profile">
        <ul>
          {profileNav.map((item) => {
            const active = pathname === item.route
            const Icon = item.icon

            return (
              <li key={item.key}>
                <Link
                  to={item.route}
                  className={cn(
                    'flex items-center gap-3 border-s-4 border-transparent px-4 py-3 text-sm font-medium transition',
                    active
                      ? 'border-s-primary bg-sidebar-active text-primary'
                      : 'text-text hover:bg-bg-light',
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-start text-sm font-medium text-red-600 hover:bg-bg-light transition"
        >
          <MdLogout className="h-5 w-5 shrink-0" />
          <span>{t('nav.logout')}</span>
        </button>
      </nav>
    </aside>
  )
}