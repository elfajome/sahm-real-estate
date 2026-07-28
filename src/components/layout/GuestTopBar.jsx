import { Link } from 'react-router-dom'
import { FaSignInAlt, FaUserPlus } from '@/components/icons/index.jsx'
import { ROUTES } from '@/constants/routes.js'
import { useLocale } from '@/hooks/useLocale.js'

/**
 * Slim strip above the Main Navigation. Per spec section 13 it is always
 * visible on desktop and hidden on tablet/mobile (the responsive layout
 * prioritizes vertical space on smaller screens).
 */
export function GuestTopBar() {
  const { t } = useLocale()

  return (
    <div className="hidden bg-primary text-lg py-3.5 text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-18">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.PRIVACY}>
            {t('nav.privacy')}
          </Link>
          <Link to={ROUTES.HELP}>
            {t('nav.help')}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center mx-3 gap-2.5 transition"
          >
            <FaUserPlus className="h-4 w-4" aria-hidden />
            {t('nav.login')}
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="flex items-center gap-2.5 transition"
          >
            <FaSignInAlt className="h-4 w-4" aria-hidden />
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </div>
  )
}
