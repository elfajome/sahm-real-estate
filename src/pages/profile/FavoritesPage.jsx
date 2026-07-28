import { useCallback, useEffect, useState } from 'react'
import { PropertyCard } from '@/components/property/PropertyCard.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
// Shared favorites/compare toggle logic — the same hook as Home/Listings so
// the cards here behave exactly like every other Property Card.
import { usePropertyActions } from '@/hooks/usePropertyActions.js'
import { userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { ROUTES } from '@/constants/routes.js'

export default function FavoritesPage() {
  const { t } = useLocale()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    try {
      const data = await userService.getFavorites()
      setItems(normalizeList(data))
    } catch {
      setItems([])
    } finally {
      if (showSpinner) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Toggling the heart on a card also refreshes this list, so a property
  // removed from favorites disappears immediately (silent refresh, no spinner).
  const handleFavorite = async (id) => {
    await toggleFavorite(id)
    load(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader title={t('profile.nav.favorites')} count={items.length || undefined} />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyFavorites')}
          actionLabel={t('profile.browseListings')}
          actionTo={ROUTES.LISTINGS}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => {
            const id = item.id ?? item.post_id
            return (
              <PropertyCard
                key={id}
                property={item}
                isFavorite={isFavorite(id)}
                isCompared={isCompared(id)}
                onFavorite={handleFavorite}
                onCompare={toggleCompare}
                onShare={(shareId) => share(shareId, item.title ?? item.name)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
