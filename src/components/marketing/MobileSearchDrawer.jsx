import { cn } from '@/utils/cn.js'
import { useLocale } from '@/hooks/useLocale.js'
import { IconClose } from '@/components/icons/index.jsx'

/**
 * Slide-in drawer for tablet/mobile (spec §42). Reused by the home search
 * and the listings filter drawer — pass `title` to override the heading.
 * Stays mounted so the content state is preserved between open/close cycles.
 * Body scrolling stays available and the drawer closes only through the
 * Close button or an explicit action (e.g. Apply Filters / successful
 * search) — never by clicking outside.
 */
export function MobileSearchDrawer({ open, onClose, title, children }) {
  const { t } = useLocale()

  return (
    <div
      className={cn('fixed inset-0 z-50 lg:hidden', !open && 'pointer-events-none')}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden
      />
      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-[min(100%,380px)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold text-text">{title ?? t('home.search')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition hover:bg-bg-light hover:text-primary"
            aria-label={t('common.close')}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  )
}
