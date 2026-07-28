import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdArrowForward, MdSend } from '@/components/icons/index.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { UserAvatar } from '@/components/ui/UserAvatar.jsx'
import { useLocale } from '@/hooks/useLocale.js'
// Chat data comes through the service façade — currently the persisted mock
// inbox following the Postman chat endpoints. TODO(backend): flip the façade
// in src/services/index.js.
import { inboxService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { formatDateTime } from '@/utils/formatDate.js'
import { cn } from '@/utils/cn.js'

/**
 * Messages — WhatsApp-Desktop-style two-pane inbox.
 *
 * URL driven so other features deep-link into it without coupling:
 *   ?user=<id>          → open (or create — never duplicate) the conversation
 *                         with that user (Contact Owner button)
 *   ?conversation=<id>  → open an existing conversation (notifications)
 */
export default function MessagesPage() {
  const { t, locale } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  const refreshConversations = useCallback(async () => {
    try {
      const data = await inboxService.getConversations()
      setConversations(normalizeList(data))
    } catch {
      setConversations([])
    }
  }, [])

  const openConversation = useCallback(
    async (convId) => {
      setLoadingMessages(true)
      try {
        const data = await inboxService.getConversationMessages(convId)
        setActive(data?.conversation ?? null)
        setMessages(normalizeList(data?.messages))
      } catch {
        setActive(null)
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
      // Opening marks incoming messages as read — refresh the unread badges.
      refreshConversations()
    },
    [refreshConversations],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ownerId = searchParams.get('user')
      let targetId = searchParams.get('conversation')
      if (ownerId) {
        try {
          // The duplicate-prevention rule lives in the service layer —
          // this returns the existing conversation or a brand new one.
          const conv = await inboxService.newConversation(ownerId)
          if (conv?.id != null) targetId = String(conv.id)
        } catch {
          targetId = null
        }
        if (cancelled) return
        // Normalize the URL — the effect re-runs with the conversation id.
        setSearchParams(targetId ? { conversation: targetId } : {}, { replace: true })
        return
      }
      await refreshConversations()
      if (cancelled) return
      if (targetId) await openConversation(targetId)
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [searchParams, setSearchParams, refreshConversations, openConversation])

  // Always focus the latest message (WhatsApp behavior).
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loadingMessages])

  const handleSend = async (event) => {
    event.preventDefault()
    const body = text.trim()
    if (!body || sending || !active) return
    setSending(true)
    try {
      const result = await inboxService.sendMessage({
        message: body,
        conv_id: active.id,
        receiver: active.user?.id,
      })
      // Update immediately after sending.
      if (result?.message) setMessages((prev) => [...prev, result.message])
      setText('')
      refreshConversations()
    } catch {
      /* keep the draft so the user can retry */
    } finally {
      setSending(false)
    }
  }

  const handleBack = () => {
    setActive(null)
    setMessages([])
    setSearchParams({}, { replace: true })
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.nav.messages')}
        count={conversations.length || undefined}
      />
      {conversations.length === 0 && !active ? (
        <ProfileEmptyState message={t('profile.emptyMessages')} />
      ) : (
        <div className="grid h-[70vh] overflow-hidden rounded-xl border border-border bg-white md:grid-cols-[minmax(260px,320px)_1fr]">
          {/* Conversation list */}
          <aside
            className={cn(
              'flex-col overflow-y-auto border-e border-border',
              active ? 'hidden md:flex' : 'flex',
            )}
          >
            <ul className="divide-y divide-border">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ conversation: String(c.id) })}
                    className={cn(
                      'flex w-full items-center gap-3 p-3 text-start transition hover:bg-bg-light',
                      String(active?.id) === String(c.id) && 'bg-sidebar-active/60',
                    )}
                  >
                    <UserAvatar name={c.user?.name} src={c.user?.image} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-text">{c.user?.name}</p>
                        <time
                          className="shrink-0 text-xs text-text-muted"
                          dateTime={c.updated_at}
                        >
                          {formatDateTime(c.updated_at, locale)}
                        </time>
                      </div>
                      <p
                        className={cn(
                          'mt-0.5 truncate text-sm',
                          c.unread_count > 0 ? 'font-medium text-text' : 'text-text-muted',
                        )}
                      >
                        {c.last_message}
                      </p>
                    </div>
                    {c.unread_count > 0 && (
                      <span
                        className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white"
                        aria-label={t('profile.unread')}
                      >
                        {c.unread_count}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Conversation window */}
          <section className={cn('min-w-0 flex-col', active ? 'flex' : 'hidden md:flex')}>
            {!active ? (
              <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-text-muted">
                {t('messages.selectConversation')}
              </div>
            ) : (
              <>
                <header className="flex items-center gap-3 border-b border-border p-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label={t('common.close')}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition hover:bg-bg-light md:hidden"
                  >
                    <MdArrowForward className="h-5 w-5 ltr:-scale-x-100" aria-hidden="true" />
                  </button>
                  <UserAvatar name={active.user?.name} src={active.user?.image} size="sm" />
                  <p className="truncate font-semibold text-text">{active.user?.name}</p>
                </header>

                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto bg-bg-light/50 p-4"
                >
                  {loadingMessages ? (
                    <p className="text-center text-sm text-text-muted">{t('common.loading')}</p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn('flex', m.is_sender ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
                            m.is_sender
                              ? 'rounded-be-sm bg-primary text-white'
                              : 'rounded-bs-sm border border-border bg-white text-text',
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm">{m.message}</p>
                          <time
                            className={cn(
                              'mt-1 block text-end text-[10px]',
                              m.is_sender ? 'text-white/70' : 'text-text-muted',
                            )}
                            dateTime={m.created_at}
                          >
                            {formatDateTime(m.created_at, locale)}
                          </time>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 border-t border-border p-3"
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('messages.inputPlaceholder')}
                    className="h-10 min-w-0 flex-1 rounded-full border border-border bg-bg-light px-4 text-sm outline-none transition focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    aria-label={t('messages.send')}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    <MdSend className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
