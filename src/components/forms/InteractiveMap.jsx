import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { DEFAULT_CENTER, loadGoogleMaps } from '@/utils/loadGoogleMaps.js'

function parseCoord(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export function InteractiveMap({ lat, lng, onChange, className }) {
  const { t } = useLocale()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return

        const latitude = parseCoord(lat)
        const longitude = parseCoord(lng)
        const hasCoords = latitude != null && longitude != null && (latitude !== 0 || longitude !== 0)
        const center = hasCoords ? { lat: latitude, lng: longitude } : DEFAULT_CENTER

        const map = new maps.Map(containerRef.current, {
          center,
          zoom: hasCoords ? 14 : 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        mapRef.current = map

        const updateMarker = (position) => {
          if (markerRef.current) {
            markerRef.current.setMap(null)
          }
          markerRef.current = new maps.Marker({ map, position })
        }

        if (hasCoords) updateMarker(center)

        map.addListener('click', (event) => {
          const position = event.latLng.toJSON()
          updateMarker(position)
          onChange?.({ lat: String(position.lat), lng: String(position.lng) })
        })
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return

    const latitude = parseCoord(lat)
    const longitude = parseCoord(lng)
    const hasCoords = latitude != null && longitude != null && (latitude !== 0 || longitude !== 0)
    if (!hasCoords) return

    const position = { lat: latitude, lng: longitude }
    map.panTo(position)

    if (markerRef.current) {
      markerRef.current.setPosition(position)
    } else {
      markerRef.current = new window.google.maps.Marker({ map, position })
    }
  }, [lat, lng])

  if (error) {
    return (
      <div
        className={`flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-bg-light text-sm text-text-muted ${className ?? ''}`}
      >
        {t('listings.mapUnavailable')}
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={containerRef} className="aspect-[16/9] w-full rounded-xl border border-border" />
      <p className="mt-2 text-xs text-text-muted">{t('propertyForm.mapClickHint')}</p>
    </div>
  )
}
