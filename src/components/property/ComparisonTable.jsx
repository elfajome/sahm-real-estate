import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/formatPrice.js'
import { useLocale } from '@/hooks/useLocale.js'
import { listingDetailPath } from '@/constants/routes.js'
import { IconArea, IconBed, IconClose, IconSale } from '@/components/icons/index.jsx'

/**
 * Comparison table — a fixed header row (Image / Price / Bedrooms / Area)
 * followed by ONE horizontal row per compared property. The header and every
 * row share the exact same grid template, so all columns stay perfectly
 * aligned no matter how many properties are compared (comparison is
 * unlimited — the table simply grows with the list).
 *
 * Fixed columns: the image column has a fixed width and the three value
 * columns split the remaining space equally, each with a minimum width.
 * Below the table's minimum width the wrapper scrolls horizontally
 * (tablet/mobile) — rows NEVER stack into cards.
 *
 * RTL/LTR: the grid follows the document direction, so the image column sits
 * at the inline-start (right in RTL, left in LTR) and the whole layout
 * mirrors automatically — one single implementation for both directions.
 */
const GRID =
  'grid grid-cols-[13rem_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(9rem,1fr)] items-center gap-4'

function ValueCell({ children }) {
  return (
    <div role="cell" className="flex items-center justify-center gap-1.5 text-center">
      {children}
    </div>
  )
}

export function ComparisonTable({ items, onRemove }) {
  const { t, locale } = useLocale()

  if (!items.length) return null

  return (
    <div className="overflow-x-auto pb-2">
      <div role="table" aria-label={t('profile.nav.compare')} className="min-w-184 space-y-4">
        {/* Fixed header row — the column titles every property row aligns with. */}
        <div
          role="row"
          className={`${GRID} rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-white`}
        >
          <span role="columnheader">{t('profile.compare.image')}</span>
          <span role="columnheader" className="text-center">
            {t('profile.compare.price')}
          </span>
          <span role="columnheader" className="text-center">
            {t('profile.compare.bedrooms')}
          </span>
          <span role="columnheader" className="text-center">
            {t('profile.compare.space')}
          </span>
        </div>

        {items.map((item) => {
          const id = item.id ?? item.post_id
          const image = item.image ?? item.images?.[0]?.url ?? item.images?.[0]
          const title = item.title ?? item.name ?? '—'
          return (
            <div
              key={id}
              role="row"
              className={`${GRID} rounded-xl border border-border bg-bg-light p-5 text-sm`}
            >
              {/* Image column — property image with the remove action below it. */}
              <div role="cell">
                <Link
                  to={listingDetailPath(id)}
                  aria-label={title}
                  className="block overflow-hidden rounded-lg bg-white"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover"
                    />
                  ) : (
                    <span className="flex aspect-4/3 w-full items-center justify-center text-border">
                      <IconSale className="h-10 w-10" />
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  aria-label={`${t('listings.removeFromCompare')}: ${title}`}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <IconClose className="h-3 w-3" />
                  {t('listings.removeFromCompare')}
                </button>
              </div>

              <ValueCell>
                <span className="font-bold text-primary">
                  {formatPrice(item.price ?? 0, locale)}
                </span>
              </ValueCell>

              <ValueCell>
                <IconBed className="h-4 w-4 text-accent" />
                <span className="text-text">{item.room_no ?? '—'}</span>
              </ValueCell>

              <ValueCell>
                <IconArea className="h-4 w-4 text-accent" />
                <span className="text-text">{item.space != null ? `${item.space} m²` : '—'}</span>
              </ValueCell>
            </div>
          )
        })}
      </div>
    </div>
  )
}
