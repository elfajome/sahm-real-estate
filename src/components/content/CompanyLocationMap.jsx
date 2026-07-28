import { useLocale } from '@/hooks/useLocale.js'
import { companyLocation, contactInfo } from '@/content/pages.js'

const MAP_HEIGHT = 'h-[260px] sm:h-[300px] lg:h-[320px]'

/**
 * Display-only company location map for the Contact Us page.
 *
 * Follows the same Google Maps Embed API strategy as
 * `src/components/property/MapEmbed.jsx` (lazy-loaded iframe, no extra
 * mapping dependency). Uses `companyLocation` coordinates when configured;
 * otherwise falls back to the company address from `contactInfo`.
 */
export function CompanyLocationMap({ className }) {
  const { t, locale } = useLocale()
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const lat = Number(companyLocation.lat)
  const lng = Number(companyLocation.lng)
  const hasCoords =
    Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)
  const address = (contactInfo[locale] ?? contactInfo.ar).address
  const query = hasCoords ? `${lat},${lng}` : address

  if (!apiKey || !query) {
    return (
      <div
        role="status"
        className={`flex ${MAP_HEIGHT} w-full items-center justify-center rounded-xl border border-dashed border-border bg-bg-light text-sm text-text-muted ${className ?? ''}`}
      >
        {t('contact.mapUnavailable')}
      </div>
    )
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}${hasCoords ? '&zoom=15' : ''}&language=${locale}`

  return (
    <iframe
      title={t('contact.mapTitle')}
      src={src}
      className={`${MAP_HEIGHT} w-full rounded-xl border-0 ${className ?? ''}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
