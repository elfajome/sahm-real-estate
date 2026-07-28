import { FiGrid, FiList } from '@/components/icons/index.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { cn } from '@/utils/cn.js'

const SORT_OPTIONS = [
  { value: 'all', labelKey: 'listings.sortAll' },
  { value: 'company', labelKey: 'listings.sortCompany' },
  { value: 'ownership', labelKey: 'listings.sortOwnership' },
  { value: 'residential', labelKey: 'listings.sortResidential' },
]

function ViewButton({ active, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border bg-white transition-colors duration-200',
        active
          ? 'border-primary text-primary'
          : 'border-border text-text-muted hover:border-primary/60 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Listings toolbar left section: List/Grid view switch + sort dropdown.
 * viewMode and sortFilter are independent pieces of state — changing one
 * never affects the other.
 */
export function ListingsToolbar({ viewMode, onViewModeChange, sortFilter, onSortFilterChange }) {
  const { t } = useLocale()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="listings-sort" className="sr-only">
        {t('listings.sortLabel')}
      </label>
      <select
        id="listings-sort"
        value={sortFilter}
        onChange={(event) => onSortFilterChange(event.target.value)}
        className="h-10 w-44 cursor-pointer rounded-lg border border-border bg-white px-3 text-sm text-text transition-colors duration-200 focus-visible:border-primary focus-visible:outline-none max-sm:w-auto max-sm:flex-1"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
      <ViewButton
        active={viewMode === 'grid'}
        label={t('listings.viewGrid')}
        onClick={() => onViewModeChange('grid')}
      >
        <FiGrid className="h-5 w-5" />
      </ViewButton>
      <ViewButton
        active={viewMode === 'list'}
        label={t('listings.viewList')}
        onClick={() => onViewModeChange('list')}
      >
        <FiList className="h-5 w-5" />
      </ViewButton>
    </div>
  )
}
