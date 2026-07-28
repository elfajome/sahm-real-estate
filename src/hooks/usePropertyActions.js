import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { useLocale } from '@/hooks/useLocale.js'
import { useToast } from '@/components/ui/Toast.jsx'
// Services come through the façade (src/services/index.js) — currently the
// temporary mock backend. TODO(backend): flip the façade to go live.
import { listingsService, userService } from '@/services/index.js'
import { loginPath } from '@/constants/routes.js'
import { shareListing } from '@/utils/share.js'
import { normalizeList } from '@/utils/normalizeList.js'

const toIdSet = (data) => new Set(normalizeList(data).map((p) => String(p.id ?? p.post_id)))

const withId = (ids, idStr, present) => {
  const next = new Set(ids)
  if (present) next.add(idStr)
  else next.delete(idStr)
  return next
}

/**
 * Shared Favorites & Compare toggle behavior — the SINGLE implementation used
 * by Home, Listings, the property detail page and the profile pages (no
 * duplicated logic).
 *
 * - Adds when the property is not in the collection, removes when it is.
 * - Shows the matching "added" / "removed" toast for both actions.
 * - Updates the icon state immediately (optimistic, rolled back on failure).
 * - Ignores duplicate clicks while a toggle request is still in flight.
 * - Comparison is unlimited — users can compare any number of properties.
 * - Talks to the backend only through the service façade, so flipping the
 *   façade to the real API requires zero changes here or in any component.
 */
export function usePropertyActions() {
  const { t } = useLocale()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [favoriteIds, setFavoriteIds] = useState(() => new Set())
  const [compareIds, setCompareIds] = useState(() => new Set())
  // In-flight guard per (action, property) — prevents duplicate requests.
  const pendingRef = useRef(new Set())

  // Keep the icon states synchronized with the user collections.
  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set())
      setCompareIds(new Set())
      return undefined
    }
    let cancelled = false
    ;(async () => {
      try {
        const [favorites, compares] = await Promise.all([
          userService.getFavorites(),
          userService.getCompares(),
        ])
        if (cancelled) return
        setFavoriteIds(toIdSet(favorites))
        setCompareIds(toIdSet(compares))
      } catch {
        /* icons simply start inactive */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const isFavorite = useCallback((id) => favoriteIds.has(String(id)), [favoriteIds])
  const isCompared = useCallback((id) => compareIds.has(String(id)), [compareIds])

  const toggle = useCallback(
    async ({ id, kind, ids, setIds, request, addedMessage, removedMessage }) => {
      if (!isAuthenticated) return navigate(loginPath(window.location.pathname))
      const idStr = String(id)
      const guard = `${kind}:${idStr}`
      if (pendingRef.current.has(guard)) return
      const inCollection = ids.has(idStr)
      pendingRef.current.add(guard)
      // Optimistic update — the icon reflects the new state immediately.
      setIds((prev) => withId(prev, idStr, !inCollection))
      try {
        const result = await request(id)
        // The mock (and future backend) reports whether the item was added.
        const added = typeof result?.added === 'boolean' ? result.added : !inCollection
        setIds((prev) => withId(prev, idStr, added))
        showToast(t(added ? addedMessage : removedMessage))
      } catch {
        setIds((prev) => withId(prev, idStr, inCollection)) // roll back
        showToast(t('common.error'), 'error')
      } finally {
        pendingRef.current.delete(guard)
      }
    },
    [isAuthenticated, navigate, showToast, t],
  )

  const toggleFavorite = useCallback(
    (id) =>
      toggle({
        id,
        kind: 'favorite',
        ids: favoriteIds,
        setIds: setFavoriteIds,
        request: listingsService.toggleFavorite,
        addedMessage: 'common.addedToFavorites',
        removedMessage: 'common.removedFromFavorites',
      }),
    [toggle, favoriteIds],
  )

  const toggleCompare = useCallback(
    (id) =>
      toggle({
        id,
        kind: 'compare',
        ids: compareIds,
        setIds: setCompareIds,
        request: listingsService.toggleCompare,
        addedMessage: 'common.addedToCompare',
        removedMessage: 'common.removedFromCompare',
      }),
    [toggle, compareIds],
  )

  const share = useCallback(
    async (id, title) => {
      try {
        await shareListing(id, title)
        showToast(t('common.linkCopied'))
      } catch {
        showToast(t('common.error'), 'error')
      }
    },
    [showToast, t],
  )

  return { isFavorite, isCompared, toggleFavorite, toggleCompare, share }
}
