import { InteractiveMap } from '@/components/forms/InteractiveMap.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { getGoogleMapsApiKey } from '@/utils/loadGoogleMaps.js'

/**
 * Large full-width map area used to pick the Real Estate location.
 *
 * - With a Google Maps key: interactive click-to-pick map (InteractiveMap
 *   keeps the existing marker / pan / click logic).
 * - Without a key: a localized fallback state rendered inside the SAME
 *   dimensions, so the map area never collapses.
 */
export function MapPicker({ lat, lng, onChange }) {
  const { t } = useLocale()
  const hasApiKey = Boolean(getGoogleMapsApiKey())

  if (!hasApiKey) {
    return (
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg-light p-6 text-center">
        <p className="text-sm font-medium text-text-muted">{t('listings.mapUnavailable')}</p>
        <p className="text-xs text-text-muted">{t('propertyForm.mapHint')}</p>
      </div>
    )
  }

  return <InteractiveMap lat={lat} lng={lng} onChange={onChange} />
}
