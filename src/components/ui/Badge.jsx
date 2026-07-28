import { cn } from '@/utils/cn.js'

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-0.5 text-xs font-medium',
        variant === 'accent' && 'bg-accent/15 text-accent',
        variant === 'primary' && 'bg-primary/10 text-primary',
        variant === 'default' && 'bg-bg-light text-text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
