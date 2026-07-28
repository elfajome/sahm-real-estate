import { cn } from '@/utils/cn.js'

export function Select({ label, error, className, containerClassName, id, children, ...props }) {
  const selectId = id ?? props.name
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text focus-visible:border-primary focus-visible:outline-none',
          error && 'border-red-500',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
