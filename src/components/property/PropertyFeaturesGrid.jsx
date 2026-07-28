import { useLocale } from '@/hooks/useLocale.js'
import {
  IconArea,
  IconBath,
  IconBed,
  IconFloor,
  IconGarage,
  IconHall,
} from '@/components/icons/index.jsx'

const features = [
  { key: 'room_no', icon: IconBed, labelKey: 'listings.features.rooms' },
  { key: 'bathroom_no', icon: IconBath, labelKey: 'listings.features.bathrooms' },
  { key: 'hall_no', icon: IconHall, labelKey: 'listings.features.halls' },
  { key: 'garage_no', icon: IconGarage, labelKey: 'listings.features.garages' },
  { key: 'space', icon: IconArea, labelKey: 'listings.features.space', suffix: ' m²' },
  { key: 'floor', icon: IconFloor, labelKey: 'listings.features.floor' },
]

export function PropertyFeaturesGrid({ item }) {
  const { t } = useLocale()

  const visible = features.filter(({ key }) => {
    const val = item?.[key]
    return val != null && val !== '' && val !== '0' && val !== 0
  })

  if (visible.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {visible.map(({ key, icon: Icon, labelKey, suffix = '' }) => (
        <div
          key={key}
          className="flex items-center gap-2 rounded-lg border border-border bg-bg-light px-3 py-2 text-sm"
        >
          <span className="text-accent" aria-hidden>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-text-muted">{t(labelKey)}</p>
            <p className="font-semibold text-text">
              {item[key]}
              {suffix}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
