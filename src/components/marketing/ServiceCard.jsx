import { useNavigate } from 'react-router-dom'
import { listingsPathWithParams, ROUTES, loginPath } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { TabIcon } from '@/components/icons/index.jsx'

const VARIANT_KEYS = {
  sale: 'sale',
  rent: 'rent',
  land: 'land',
  construction: 'construction',
}

/**
 * Fully clickable service category card: icon > title > description (spec §55).
 * Construction routes by auth state; other categories filter the listings page.
 */
export function ServiceCard({ title, description, statusId, variant = 'sale', statuses = [] }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleClick = () => {
    if (variant === 'construction') {
      if (isAuthenticated) navigate(ROUTES.CONSTRUCTION_CREATE)
      else navigate(loginPath(ROUTES.CONSTRUCTION_CREATE))
      return
    }
    const id = statusId ?? statuses.find((s) => s.id)?.id
    navigate(id ? listingsPathWithParams({ aqar_status: id }) : ROUTES.LISTINGS)
  }

  const iconKey = VARIANT_KEYS[variant] ?? 'sale'

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative group w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-white text-center shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
    >
      <div className="px-6 pb-4 pt-6">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition duration-200 group-hover:bg-accent group-hover:text-white">
          <TabIcon tabKey={iconKey} className="h-8 w-8" />
        </span>
        <span className="block font-semibold text-text transition duration-200 group-hover:text-accent">
          {title}
        </span>
        {description && (
          <span className="mt-1.5 block text-xs leading-relaxed text-text-muted line-clamp-2">
            {description}
          </span>
        )}
      </div>
      <span className="absolute bottom-0 left-0 h-1 w-full bg-accent/30 transition duration-200 group-hover:bg-accent" />
    </button>
  )
}
