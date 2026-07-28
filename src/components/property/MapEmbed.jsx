import { useLocale } from '@/hooks/useLocale.js'

export function MapEmbed({ lat, lng, className }) {
  const { t } = useLocale()
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const latitude = Number(lat)
  const longitude = Number(lng)
  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude) && (latitude !== 0 || longitude !== 0)

  if (!apiKey || !hasCoords) {
    return (
      <div
        className={`flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-bg-light text-sm text-text-muted ${className ?? ''}`}
      >
        {t('listings.mapUnavailable')}
      </div>
    )
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=14`

  return (
    <iframe
      title={t('listings.location')}
      src={src}
      className={`aspect-[16/9] w-full rounded-xl border-0 ${className ?? ''}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
