import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { loginPath } from '@/constants/routes.js'
import { listingsService } from '@/services/index.js'

export function BuyNowButton({ postId, className }) {
  const { t } = useLocale()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  // The action runs exactly once per click cycle: the ref is a synchronous
  // single-flight guard (immune to rapid double clicks before re-render) and
  // the state disables the button until the request completes or fails.
  const [submitting, setSubmitting] = useState(false)
  const pendingRef = useRef(false)

  const handleClick = async () => {
    if (!isAuthenticated) return navigate(loginPath(window.location.pathname))
    if (pendingRef.current) return // ignore extra clicks — no duplicate requests
    pendingRef.current = true
    setSubmitting(true)
    try {
      const result = await listingsService.buyNow(postId)
      // The service reports duplicates (property already in "My Purchases") —
      // show the informational message instead of adding it twice. The check
      // itself lives in the service layer, so no business logic is duplicated.
      const alreadyPurchased = result?.already_purchased === true
      showToast(t(alreadyPurchased ? 'listings.alreadyPurchased' : 'listings.buySuccess'))
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      // Re-enable only after the request settles (success or failure).
      pendingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <Button className={className} onClick={handleClick} disabled={submitting} aria-busy={submitting}>
      {submitting ? t('common.loading') : t('listings.buyNow')}
    </Button>
  )
}
