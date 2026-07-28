import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import { ROUTES } from '@/constants/routes.js'
import { getRouteMeta } from '@/router/routeConfig.js'

export function Breadcrumb() {
  const { pathname } = useLocation()
  const { t } = useLocale()

  if (pathname === ROUTES.HOME) return null

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = [{ path: ROUTES.HOME, label: t('breadcrumb.home') }]

  let acc = ''
  segments.forEach((seg) => {
    acc += `/${seg}`
    const meta = getRouteMeta(acc)
    const labelKey = meta.breadcrumb
    crumbs.push({
      path: acc,
      label: labelKey ? t(labelKey) : seg,
    })
  })

  return (
    <nav aria-label="Breadcrumb" className="bg-bg-light py-3">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm text-text-muted lg:px-6">
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === crumbs.length - 1 ? (
              <span className="text-text">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-primary">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
