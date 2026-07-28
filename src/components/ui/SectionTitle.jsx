import { cn } from '@/utils/cn.js'

/**
 * Section header following the spec structure:
 * label > heading > optional description > optional action (e.g. "view all").
 */
export function SectionTitle({ title, subtitle, label, action, align = 'start', className }) {
  const centered = align === 'center'

  return (
    <div className={cn('mb-8', centered && 'text-center', className)}>
      <div className={cn('flex flex-wrap items-end justify-between gap-4', centered && 'justify-center')}>
        <div className={cn('min-w-0', !action && !centered && 'flex-1')}>
          {label && <p className="mb-1.5 text-sm font-semibold text-accent">{label}</p>}
          <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
            <span className="inline-block h-2.5 w-2.5 rotate-45 bg-accent" aria-hidden />
            <h2 className="text-2xl font-bold text-text">{title}</h2>
            {!centered && !action && <span className="h-px flex-1 bg-border" aria-hidden />}
          </div>
          {subtitle && (
            <p className={cn('mt-2 text-sm text-text-muted', centered && 'mx-auto max-w-2xl')}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  )
}
