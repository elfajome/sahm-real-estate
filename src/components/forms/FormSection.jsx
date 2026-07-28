import { cn } from '@/utils/cn.js'

/**
 * Shared primitives for the public long-form pages (Add Real Estate,
 * Add Construction Request) reproducing the original site's form language:
 * blue section bars, narrow label column + large control area, and compact
 * horizontal selectable options.
 */

/** Full-width blue bar separating the form groups (original design language). */
export function SectionHeader({ children, required }) {
  return (
    <h2 className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white sm:text-base">
      {children}
      {required && <span className="ms-1" aria-hidden>*</span>}
    </h2>
  )
}

/**
 * Desktop row from the original design: a narrow label column at the
 * inline-start (right in RTL, left in LTR) and a large control area filling
 * the rest of the row. Stacks vertically on small screens.
 */
export function FieldRow({ label, htmlFor, required, align = 'center', children }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6',
        align === 'top' ? 'md:items-start' : 'md:items-center',
      )}
    >
      <label
        htmlFor={htmlFor}
        className={cn('text-sm font-medium text-text', align === 'top' && 'md:pt-2.5')}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/**
 * Compact horizontal selectable options with a clearly visible selected
 * state. Single-selection (native radios) — never multi-select, matching
 * single-value backend fields. Set `indicator` for the small circular
 * selection indicator used by the Construction Request options.
 */
export function RadioPillGroup({ name, options, register, error, errorId, indicator = false }) {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label key={opt.value} className="cursor-pointer">
            <input
              type="radio"
              value={opt.value}
              className="peer sr-only"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              {...register(name)}
            />
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-2 text-sm text-text transition peer-checked:border-primary peer-checked:bg-primary peer-checked:font-medium peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-checked:[&>span:first-child]:bg-white">
              {indicator && (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-current"
                />
              )}
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
