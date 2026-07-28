import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdOutlineCampaign,
  MdOutlineChat,
  MdOutlineHomeWork,
  MdOutlineLocalOffer,
} from '@/components/icons/index.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
// Data comes through the service façade — currently the persisted mock inbox.
// TODO(backend): flip the façade in src/services/index.js.
import { inboxService } from '@/services/index.js'
import { ROUTES } from '@/constants/routes.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { formatDateTime } from '@/utils/formatDate.js'
import { cn } from '@/utils/cn.js'

const TYPE_ICONS = {
  offer: MdOutlineLocalOffer,
  listing: MdOutlineHomeWork,
  system: MdOutlineCampaign,
  message: MdOutlineChat,
}

export default function NotificationsPage() {
  const { t, locale } = useLocale()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await inboxService.getNotifications()
        if (!cancelled) setItems(normalizeList(data))
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Clicking a notification marks it read; message notifications navigate to
  // the Messages page and open the linked conversation (latest message focused).
  const handleOpen = async (item) => {
    if (!item.read) {
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)))
      try {
        await inboxService.markNotificationRead(item.id)
      } catch {
        /* non-blocking — navigation still happens */
      }
    }
    if (item.conv_id != null) {
      navigate(`${ROUTES.PROFILE_MESSAGES}?conversation=${item.conv_id}`)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader title={t('profile.nav.notifications')} count={items.length || undefined} />
      {items.length === 0 ? (
        <ProfileEmptyState message={t('profile.emptyNotifications')} />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? MdOutlineCampaign
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className={cn(
                    'flex w-full gap-4 p-4 text-start transition hover:bg-bg-light',
                    !item.read && 'bg-sidebar-active/60',
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-text">{item.title}</p>
                      <time className="text-xs text-text-muted" dateTime={item.created_at}>
                        {formatDateTime(item.created_at, locale)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{item.body}</p>
                  </div>
                  {!item.read && (
                    <span
                      className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                      role="status"
                      aria-label={t('profile.unread')}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
