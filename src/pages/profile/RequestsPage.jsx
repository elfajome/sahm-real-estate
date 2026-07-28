import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Badge } from '@/components/ui/Badge.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { userService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { ROUTES } from '@/constants/routes.js'
import { IconConstruction } from '@/components/icons/index.jsx'

function formatDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString()
}

export default function RequestsPage() {
  const { t } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getUserConstructions()
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
      <ProfilePageHeader
        title={t('profile.nav.requests')}
        count={items.length || undefined}
        action={
          <Link to={ROUTES.CONSTRUCTION_CREATE}>
            <Button size="sm" variant="outline">
              {t('footer.requestConstruction')}
            </Button>
          </Link>
        }
      />
      {items.length === 0 ? (
        <ProfileEmptyState
          message={t('profile.emptyRequests')}
          actionLabel={t('footer.requestConstruction')}
          actionTo={ROUTES.CONSTRUCTION_CREATE}
        />
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const id = item.id ?? item.post_id
            const image = item.image ?? item.images?.[0]?.url ?? item.images?.[0]
            const typeName = item.construction_type?.name ?? item.type?.name
            const date = formatDate(item.created_at ?? item.date)

            return (
              <article
                key={id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:flex-row"
              >
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-bg-light sm:w-40">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-border">
                      <IconConstruction className="h-10 w-10" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-text">{item.title ?? item.name ?? '—'}</h3>
                    {typeName && <Badge variant="accent">{typeName}</Badge>}
                  </div>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-text-muted">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-muted">
                    {item.space != null && (
                      <span>
                        {item.space} m²
                      </span>
                    )}
                    {item.area?.name && <span>{item.area.name}</span>}
                    {date && (
                      <span>
                        {t('profile.requestDate')}: {date}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
