import { Children, useRef } from 'react'
import { cn } from '@/utils/cn.js'
import { useLocale } from '@/hooks/useLocale.js'
import { IconChevron } from '@/components/icons/index.jsx'

const ARROW_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text shadow-sm transition duration-200 hover:border-primary hover:bg-primary hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/**
 * Manual, RTL-aware carousel built on native scroll snapping.
 * No autoplay — users stay in control (touch swipe + arrow buttons).
 * Scroll position is naturally preserved while the component stays mounted.
 */
export function Carousel({ children, label, itemClassName, className }) {
  const trackRef = useRef(null)
  const { t, isRtl } = useLocale()
  const items = Children.toArray(children)

  const scrollByPage = (direction) => {
    const track = trackRef.current
    if (!track) return
    const offset = track.clientWidth * direction * (isRtl ? -1 : 1)
    track.scrollBy({ left: offset, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, index) => (
          <div
            key={child.key ?? index}
            className={cn(
              'w-full shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]',
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label={t('common.previous')}
            className={ARROW_CLASS}
          >
            <IconChevron className="h-5 w-5 rotate-180 rtl:rotate-0" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label={t('common.next')}
            className={ARROW_CLASS}
          >
            <IconChevron className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  )
}
