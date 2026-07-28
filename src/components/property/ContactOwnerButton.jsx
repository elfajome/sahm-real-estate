import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button.jsx'
import { FaRegMessage } from '@/components/icons/index.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import { ROUTES, loginPath } from '@/constants/routes.js'

/**
 * "تواصل مع المالك" — entry point to the messaging system. Rendered beside
 * "Buy Now" only for properties whose data carries an owner (`user`).
 *
 * Clicking navigates to the Messages page with the owner id — the page asks
 * the inbox service to open the conversation with that user, creating it only
 * if it doesn't exist yet (the no-duplicates rule lives in the service layer,
 * mirroring the backend `new_conversation/:user` endpoint).
 */
export function ContactOwnerButton({ owner, className }) {
  const { t } = useLocale()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  if (!owner?.id) return null
  // Owners never message themselves about their own property.
  if (user && String(user.id) === String(owner.id)) return null

  const handleClick = () => {
    if (!isAuthenticated) return navigate(loginPath(window.location.pathname))
    navigate(`${ROUTES.PROFILE_MESSAGES}?user=${owner.id}`)
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={handleClick}>
      <FaRegMessage className="h-4 w-4" aria-hidden /> {t('listings.contactOwner')}
    </Button>
  )
}
