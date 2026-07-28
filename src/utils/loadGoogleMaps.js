const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }

let loadPromise = null

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
}

export function loadGoogleMaps() {
  const apiKey = getGoogleMapsApiKey()
  if (!apiKey) return Promise.reject(new Error('Missing Google Maps API key'))

  if (window.google?.maps) return Promise.resolve(window.google.maps)

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=ar`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google?.maps) resolve(window.google.maps)
        else reject(new Error('Google Maps failed to load'))
      }
      script.onerror = () => reject(new Error('Google Maps script failed to load'))
      document.head.appendChild(script)
    })
  }

  return loadPromise
}

export { DEFAULT_CENTER }
