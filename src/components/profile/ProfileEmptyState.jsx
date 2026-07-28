import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button.jsx'
import { IconInbox } from '@/components/icons/index.jsx'

/**
 * Shared empty-state block (dashed frame, icon, message, optional CTA).
 * Pass a custom `icon` component (from the central icons module) to adapt it
 * to other contexts — e.g. the Listings page passes IconSearch.
 */
export function ProfileEmptyState({ message, actionLabel, actionTo, icon: Icon = IconInbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-light/50 py-16 text-center">
      <span className="text-border" aria-hidden>
        <Icon className="h-12 w-12" />
      </span>
      <p className="mt-4 max-w-sm text-text-muted">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-4">
          <Button variant="outline">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
