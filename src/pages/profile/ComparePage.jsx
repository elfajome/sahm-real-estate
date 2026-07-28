import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ComparisonTable } from '@/components/property/ComparisonTable.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { listingsService, userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { ROUTES } from '@/constants/routes.js'

export default function ComparePage() {
  const { t } = useLocale()
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getCompares()
      setItems(normalizeList(data))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const handleRemove = async (postId) => {
    try {
      await listingsService.toggleCompare(postId)
      showToast(t('common.removedFromCompare'))
      load()
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.nav.compare')}
        count={items.length || undefined}
        action={
          items.length > 0 ? (
            <Link to={ROUTES.LISTINGS}>
              <Button size="sm" variant="outline">
                {t('profile.browseListings')}
              </Button>
            </Link>
          ) : null
        }
      />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyCompare')}
          actionLabel={t('profile.browseListings')}
          actionTo={ROUTES.LISTINGS}
        />
      ) : (
        <ComparisonTable items={items} onRemove={handleRemove} />
      )}
    </div>
  )
}
