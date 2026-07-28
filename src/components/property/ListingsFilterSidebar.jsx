import { useState } from 'react'
import { FiPlus, FiSearch } from '@/components/icons/index.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { cn } from '@/utils/cn.js'
import { lookupLabel } from '@/utils/lookupLabel.js'

export const PRICE_MIN = 0
export const PRICE_MAX = 550000
const PRICE_STEP = 5000

const formatThousands = (value) => Number(value).toLocaleString('en-US')

const RANGE_THUMB_CLASS =
  'pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 ' +
  '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 ' +
  '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 ' +
  '[&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow'

function AccordionSection({ id, title, expanded, onToggle, children }) {
  const headerId = `filter-header-${id}`
  const panelId = `filter-panel-${id}`
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        id={headerId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 py-3.5 text-start transition-colors hover:text-accent"
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text transition-transform duration-300',
            expanded && 'rotate-45 border-primary text-primary',
          )}
        >
          <FiPlus className="h-4 w-4" />
        </span>
        <span className="font-semibold text-text">{title}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4 ps-11">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CheckboxOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-text hover:text-accent">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer rounded accent-primary"
      />
      <span>{label}</span>
    </label>
  )
}

/**
 * Accordion-based filter panel for the Real Estates page.
 * Single controlled accordion: only one section can be expanded at a time;
 * selections are preserved when sections collapse or switch.
 *
 * Checkbox filters are multi-select and consume the lookup collections by id:
 * OR inside the same group, AND across different groups (the AND is applied
 * by the listings service). The draft `values` live in the parent page so
 * selections survive drawer open/close and grid/list view switches.
 *
 * Option labels are localized through i18n (lookupLabel) and switch
 * automatically with the application language.
 *
 * values: { search, areaIds, typeIds, statusIds, minPrice, maxPrice }
 */
export function ListingsFilterPanel({
  values,
  onChange,
  onApply,
  onReset,
  areas,
  types,
  statuses,
  variant = 'card',
}) {
  const { t } = useLocale()

  // null | 'area' | 'type' | 'status' | 'price'
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (id) => setExpandedSection((current) => (current === id ? null : id))

  const set = (patch) => onChange({ ...values, ...patch })

  const toggleId = (key, id) => {
    const idStr = String(id)
    const list = values[key]
    set({ [key]: list.includes(idStr) ? list.filter((v) => v !== idStr) : [...list, idStr] })
  }

  const minPct = ((values.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const maxPct = ((values.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const handleSubmit = (event) => {
    event.preventDefault()
    onApply()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(variant === 'card' && 'rounded-xl border border-border bg-white p-4 shadow-sm')}
    >
      {/* Search — never expands any accordion section */}
      <div className="relative">
        <FiSearch
          className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={values.search}
          onChange={(event) => set({ search: event.target.value })}
          placeholder={t('listings.searchPlaceholder')}
          aria-label={t('listings.searchPlaceholder')}
          className="w-full rounded-full border border-border bg-white py-2.5 pe-4 ps-11 text-sm text-text focus-visible:border-primary focus-visible:outline-none"
        />
      </div>

      <div className="mt-4">
        <AccordionSection
          id="area"
          title={t('filters.area')}
          expanded={expandedSection === 'area'}
          onToggle={() => toggleSection('area')}
        >
          {areas.map((item) => (
            <CheckboxOption
              key={item.id}
              name="filter-area"
              value={item.id}
              checked={values.areaIds.includes(String(item.id))}
              onChange={() => toggleId('areaIds', item.id)}
              label={lookupLabel(t, item)}
            />
          ))}
        </AccordionSection>

        <AccordionSection
          id="type"
          title={t('filters.type')}
          expanded={expandedSection === 'type'}
          onToggle={() => toggleSection('type')}
        >
          {types.map((item) => (
            <CheckboxOption
              key={item.id}
              name="filter-type"
              value={item.id}
              checked={values.typeIds.includes(String(item.id))}
              onChange={() => toggleId('typeIds', item.id)}
              label={lookupLabel(t, item)}
            />
          ))}
        </AccordionSection>

        <AccordionSection
          id="status"
          title={t('filters.propertyStatus')}
          expanded={expandedSection === 'status'}
          onToggle={() => toggleSection('status')}
        >
          {statuses.map((item) => (
            <CheckboxOption
              key={item.id}
              name="filter-status"
              value={item.id}
              checked={values.statusIds.includes(String(item.id))}
              onChange={() => toggleId('statusIds', item.id)}
              label={lookupLabel(t, item)}
            />
          ))}
        </AccordionSection>

        <AccordionSection
          id="price"
          title={t('filters.price')}
          expanded={expandedSection === 'price'}
          onToggle={() => toggleSection('price')}
        >
          <div className="flex items-center justify-between text-sm font-medium text-text">
            <span>{formatThousands(values.minPrice)}</span>
            <span>{formatThousands(values.maxPrice)}</span>
          </div>
          <div className="relative mt-3 h-6">
            <div
              className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-border"
              aria-hidden="true"
            />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
              style={{ insetInlineStart: `${minPct}%`, width: `${Math.max(maxPct - minPct, 0)}%` }}
              aria-hidden="true"
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={values.minPrice}
              onChange={(event) =>
                set({ minPrice: Math.min(Number(event.target.value), values.maxPrice) })
              }
              aria-label={t('filters.fromPrice')}
              aria-valuetext={formatThousands(values.minPrice)}
              className={RANGE_THUMB_CLASS}
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={values.maxPrice}
              onChange={(event) =>
                set({ maxPrice: Math.max(Number(event.target.value), values.minPrice) })
              }
              aria-label={t('filters.toPrice')}
              aria-valuetext={formatThousands(values.maxPrice)}
              className={RANGE_THUMB_CLASS}
            />
          </div>
        </AccordionSection>
      </div>

      <Button type="submit" className="mt-4 w-full">
        {t('listings.filter')}
      </Button>
      <Button type="button" variant="outline" className="mt-2 w-full" onClick={onReset}>
        {t('listings.resetFilters')}
      </Button>
    </form>
  )
}

/**
 * Desktop filter sidebar — layout unchanged on lg+ screens.
 * Hidden on tablet/mobile, where the floating button + filter drawer
 * (rendered by ListingsPage) take over.
 */
export function ListingsFilterSidebar(props) {
  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-72">
      <ListingsFilterPanel {...props} />
    </aside>
  )
}
