import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import {
  CgProfile,
  FaRegMessage,
  IoIosLogOut,
  IoNotificationsCircleOutline,
} from '@/components/icons/index.jsx'

export function AuthenticatedTopBar() {
  const { t } = useLocale()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="bg-primary text-lg py-3.5 text-white">
      <div className="mx-auto lg:flex container items-center justify-between px-4 py-2 lg:px-18">
        <div className="flex items-center gap-4 mb-3 lg:mb-0">
          <Link to={ROUTES.PRIVACY}>
            {t('nav.privacy')}
          </Link>
          <Link to={ROUTES.HELP}>
            {t('nav.help')}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.PROFILE_INFO}
            className="opacity-90 hover:opacity-100"
            aria-label={t('nav.profile')}
          >
            <span className="text-3xl"><CgProfile /></span>
          </Link>
          {/* Notifications & Messages pages are reached from HERE only — the
              Profile Sidebar no longer lists them. Same routes, no duplicated
              pages or navigation logic. */}
          <Link
            to={ROUTES.PROFILE_NOTIFICATIONS}
            className="opacity-90 hover:opacity-100"
            aria-label={t('profile.nav.notifications')}
            title={t('profile.nav.notifications')}
          >
            <span className="text-4xl"><IoNotificationsCircleOutline /></span>
          </Link>
          <Link
            to={ROUTES.PROFILE_MESSAGES}
            className="opacity-90 hover:opacity-100"
            aria-label={t('profile.nav.messages')}
            title={t('profile.nav.messages')}
          >
            <span className="text-2xl"><FaRegMessage className="mt-1" /></span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100"
          >
            <span aria-hidden className="text-2xl mr-2 bg-white text-primary p-1 rounded-full"><IoIosLogOut /></span>
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
