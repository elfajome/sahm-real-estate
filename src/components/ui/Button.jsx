import { cn } from '@/utils/cn.js'

const variants = {
  primary: 'gradient-cta text-white hover:opacity-90',
  secondary: 'bg-primary text-white hover:bg-accent',
  outline: 'border border-border bg-white text-text hover:bg-bg-light',
  ghost: 'text-text-muted hover:text-primary hover:bg-bg-light',
  accent: 'bg-accent text-white hover:bg-accent-dark',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
