import { FaChevronLeft, FaChevronRight } from '@/components/icons/index.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { cn } from '@/utils/cn.js'

export function Pagination({ page, totalPages, onPageChange }) {
  const { t } = useLocale()

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label={t('common.previous')}
        className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        <FaChevronLeft className="h-3 w-3 rtl:-scale-x-100" aria-hidden />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            'min-w-9 rounded-lg border px-3 py-1.5 text-sm',
            p === page
              ? 'border-accent bg-accent text-white'
              : 'border-border hover:bg-bg-light',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label={t('common.next')}
        className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        <FaChevronRight className="h-3 w-3 rtl:-scale-x-100" aria-hidden />
      </button>
    </nav>
  )
}
