import { useCallback, useEffect, useState } from 'react'
import { PropertyCard } from '@/components/property/PropertyCard.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Badge } from '@/components/ui/Badge.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
// Shared favorites/compare toggle logic — the same hook as Home/Listings so
// the cards here behave exactly like every other Property Card.
import { usePropertyActions } from '@/hooks/usePropertyActions.js'
import { userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { ROUTES } from '@/constants/routes.js'

function formatDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString()
}

export default function PurchasesPage() {
  const { t } = useLocale()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getPurchases()
      setItems(normalizeList(data))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader title={t('profile.nav.purchases')} count={items.length || undefined} />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyPurchases')}
          actionLabel={t('profile.browseListings')}
          actionTo={ROUTES.LISTINGS}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => {
            const id = item.id ?? item.post_id
            const date = formatDate(item.created_at ?? item.date ?? item.purchased_at)

            return (
              <div key={id} className="space-y-2">
                {date && (
                  <Badge variant="default" className="text-xs">
                    {t('profile.purchaseDate')}: {date}
                  </Badge>
                )}
                <PropertyCard
                  property={item}
                  isFavorite={isFavorite(id)}
                  isCompared={isCompared(id)}
                  onFavorite={toggleFavorite}
                  onCompare={toggleCompare}
                  onShare={(shareId) => share(shareId, item.title ?? item.name)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
