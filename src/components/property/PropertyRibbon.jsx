import { cn } from '@/utils/cn.js'

/**
 * Diagonal corner ribbon (blue, top-left) for Featured Properties cards.
 *
 * The label is ALWAYS "التثبيت" — a fixed product rule, never any other text.
 * Visibility is data-driven and controlled by the caller: only the Home page
 * Featured Properties section renders it, and only for properties whose data
 * marks them as featured (`isFeatured` / backend `pin === 1`). It never
 * appears in normal listings, search results, property details, or any other
 * section.
 *
 * Must be rendered inside a `position: relative` container (the card image).
 */
const RIBBON_LABEL = 'التثبيت'

export function PropertyRibbon({ className }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute left-0 top-0 z-10 h-20 w-20 overflow-hidden',
        className,
      )}
    >
      <span className="absolute left-[-30px] top-[18px] block w-[120px] -rotate-45 bg-primary py-1 text-center text-xs font-bold text-white shadow-md">
        {RIBBON_LABEL}
      </span>
    </span>
  )
}
