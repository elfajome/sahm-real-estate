import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listingDetailPath } from '@/constants/routes.js'
import { formatPrice } from '@/utils/formatPrice.js'
import { useLocale } from '@/hooks/useLocale.js'
import {
  IconArea,
  IconBath,
  IconBed,
  IconCompare,
  IconHeart,
  IconLocation,
  IconSale,
  IconShare,
} from '@/components/icons/index.jsx'
import { PropertyRibbon } from './PropertyRibbon.jsx'
import { cn } from '@/utils/cn.js'

function ActionButton({ label, onClick, active = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full shadow-md transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95',
        active
          ? 'bg-accent text-white hover:bg-white hover:text-accent'
          : 'bg-black/50 text-white hover:bg-white hover:text-accent',
      )}
    >
      {children}
    </button>
  )
}

function MetaItem({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-4 w-4 text-accent" />
      {children}
    </span>
  )
}

/**
 * Shared Property Card — the single card layout reused across the platform
 * (Home, Listings, Favorites, Compare, My Listings). Spec §98–§120.
 *
 * variant="grid" (default): vertical card.
 * variant="list": horizontal card — image on the inline-start side (right in
 * RTL), info on the other side. Same data and behavior in both variants;
 * only the presentation changes.
 *
 * `isFavorite` / `isCompared` drive the immediate icon state of the overlay
 * actions (filled/accent when active), so toggling reflects instantly.
 *
 * The diagonal "التثبيت" corner ribbon renders ONLY when `showRibbon` is set
 * by the caller (Home page Featured Properties section) AND the property data
 * marks the item as featured (`isFeatured` / backend `pin`). It never appears
 * in normal listings, search results, or any other section.
 *
 * The image never scales on hover — only the action overlay animates,
 * using an opacity transition. On touch devices the overlay stays visible.
 */
export function PropertyCard({
  property,
  variant = 'grid',
  showOverlay = true,
  showRibbon = false,
  isFavorite = false,
  isCompared = false,
  onFavorite,
  onCompare,
  onShare,
}) {
  const { locale, t } = useLocale()
  const [imageFailed, setImageFailed] = useState(false)
  const isList = variant === 'list'

  const id = property.id ?? property.post_id
  const image = property.image ?? property.images?.[0]?.url ?? property.images?.[0]
  const title = property.title ?? property.name ?? '—'
  const location = property.area?.name ?? property.location ?? '—'
  const hasActions = showOverlay && (onFavorite || onCompare || onShare)
  // Featured flag from the property data (`isFeatured`, or the backend `pin`).
  const isFeaturedProperty = Boolean(property.isFeatured ?? Number(property.pin) === 1)

  const stop = (event, handler) => {
    event.preventDefault()
    event.stopPropagation()
    handler?.(id)
  }

  return (
    <Link
      to={listingDetailPath(id)}
      className={cn(
        'group h-full overflow-hidden rounded-xl border border-border bg-white shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        isList ? 'flex flex-col sm:flex-row' : 'block',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-bg-light',
          isList
            ? 'aspect-[16/10] w-full sm:aspect-[4/3] sm:w-72 sm:shrink-0 md:w-80'
            : 'aspect-[16/10]',
        )}
      >
        {showRibbon && isFeaturedProperty && <PropertyRibbon />}
        {image && !imageFailed ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-border">
            <IconSale className="h-12 w-12" />
          </div>
        )}

        {hasActions && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:bg-black/20 pointer-coarse:opacity-100">
            {onFavorite && (
              <ActionButton
                label={isFavorite ? t('profile.removeFavorite') : t('listings.addToFavorites')}
                active={isFavorite}
                onClick={(e) => stop(e, onFavorite)}
              >
                <IconHeart className="h-5 w-5" />
              </ActionButton>
            )}
            {onCompare && (
              <ActionButton
                label={isCompared ? t('listings.removeFromCompare') : t('listings.addToCompare')}
                active={isCompared}
                onClick={(e) => stop(e, onCompare)}
              >
                <IconCompare className="h-5 w-5" />
              </ActionButton>
            )}
            {onShare && (
              <ActionButton label={t('listings.share')} onClick={(e) => stop(e, onShare)}>
                <IconShare className="h-5 w-5" />
              </ActionButton>
            )}
          </div>
        )}
      </div>

      <div className={cn('p-4', isList && 'flex min-w-0 flex-1 flex-col justify-center sm:p-5')}>
        <p className="text-lg font-bold text-primary">{formatPrice(property.price ?? 0, locale)}</p>
        <h3 className={cn('mt-1 line-clamp-2 font-semibold text-text', !isList && 'min-h-12')}>
          {title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
          <IconLocation className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate">{location}</span>
        </p>
        {isList && property.description && (
          <p className="mt-2 line-clamp-2 text-sm text-text-muted">{property.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3 text-xs text-text-muted">
          {property.room_no != null && <MetaItem icon={IconBed}>{property.room_no}</MetaItem>}
          {property.bathroom_no != null && <MetaItem icon={IconBath}>{property.bathroom_no}</MetaItem>}
          {property.space != null && <MetaItem icon={IconArea}>{property.space} m²</MetaItem>}
        </div>
      </div>
    </Link>
  )
}
