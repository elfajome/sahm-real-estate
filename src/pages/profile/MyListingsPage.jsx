import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PropertyCard } from '@/components/property/PropertyCard.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useToast } from '@/components/ui/Toast.jsx'
// Shared favorites/compare toggle logic — the same hook as Home/Listings so
// the cards here behave exactly like every other Property Card.
import { usePropertyActions } from '@/hooks/usePropertyActions.js'
import { listingsService, userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { listingEditPath, ROUTES } from '@/constants/routes.js'

export default function MyListingsPage() {
  const { t } = useLocale()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getUserAqars()
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

  const handleDelete = async (postId) => {
    if (!window.confirm(t('profile.confirmDelete'))) return
    try {
      await listingsService.deleteAqar(postId)
      showToast(t('profile.deleted'))
      load()
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.nav.listings')}
        count={items.length || undefined}
        action={
          <Link to={ROUTES.LISTING_CREATE}>
            <Button size="sm">{t('nav.addProperty')}</Button>
          </Link>
        }
      />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyListings')}
          actionLabel={t('nav.addProperty')}
          actionTo={ROUTES.LISTING_CREATE}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => {
            const id = item.id ?? item.post_id
            return (
              <div key={id} className="flex flex-col">
                <PropertyCard
                  property={item}
                  isFavorite={isFavorite(id)}
                  isCompared={isCompared(id)}
                  onFavorite={toggleFavorite}
                  onCompare={toggleCompare}
                  onShare={(shareId) => share(shareId, item.title ?? item.name)}
                />
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(listingEditPath(id))}>
                    {t('profile.edit')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(id)}>
                    {t('profile.delete')}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
