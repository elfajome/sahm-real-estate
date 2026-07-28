import { cn } from '@/utils/cn.js'
import { FaStar } from '@/components/icons/index.jsx'

export function StarRating({ value = 0, onChange, max = 5, size = 'md', readOnly = false }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }

  return (
    <div className={cn('inline-flex gap-0.5', sizes[size])} role={readOnly ? 'img' : 'group'}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={cn(
              'transition',
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              filled ? 'text-amber-400' : 'text-border',
            )}
            aria-label={`${star}`}
          >
            <FaStar aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
