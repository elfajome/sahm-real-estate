import { useEffect, useState } from 'react'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { InvoiceTable } from '@/components/profile/InvoiceTable.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { ROUTES } from '@/constants/routes.js'

export default function InvoicesPage() {
  const { t } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await userService.getPurchases()
        setItems(normalizeList(data))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader title={t('profile.nav.invoices')} count={items.length || undefined} />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyInvoices')}
          actionLabel={t('profile.browseListings')}
          actionTo={ROUTES.LISTINGS}
        />
      ) : (
        <InvoiceTable items={items} />
      )}
    </div>
  )
}
