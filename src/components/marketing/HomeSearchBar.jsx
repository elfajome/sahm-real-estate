import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import { listingsPathWithParams } from '@/constants/routes.js'
import { Button } from '@/components/ui/Button.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { Input } from '@/components/ui/Input.jsx'
import { cn } from '@/utils/cn.js'
import { lookupLabel } from '@/utils/lookupLabel.js'
import { resolveStatusId } from '@/components/marketing/FilterTabs.jsx'

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_SEARCH_FILTERS = {
  search: '',
  area_id: '',
  aqar_type: '',
  room_no: '',
  from_price: '',
  to_price: '',
}

// Adjusted to handle internal padding and maintain clear typography
const fieldClass =
  'min-w-0 flex-1 cursor-pointer border-0 bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-500'

// Unified wrapper class with smooth transitions and clear focus rings for keyboard navigation
const wrapperClass =
  'min-w-0 flex-1 border border-gray-300 rounded-md bg-white transition-all  outline-none'

export function HomeSearchBar({
  areas = [],
  aqarTypes = [],
  statuses = [],
  activeTab = 'sale',
  variant = 'inline',
  filters: controlledFilters,
  onFiltersChange,
  formId = 'home-search-form',
  onSubmit,
  className,
}) {
  const { t } = useLocale()
  const navigate = useNavigate()
  const [internalFilters, setInternalFilters] = useState(DEFAULT_SEARCH_FILTERS)

  const filters = controlledFilters ?? internalFilters
  const setFilters = onFiltersChange ?? setInternalFilters

  const showRooms = activeTab !== 'land'

  const handleSubmit = (e) => {
    e.preventDefault()
    const aqar_status = resolveStatusId(statuses, activeTab)
    const params = { ...filters, ...(aqar_status ? { aqar_status } : {}) }
    if (!showRooms) delete params.room_no
    navigate(listingsPathWithParams(params))
    onSubmit?.()
  }

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value })

  if (variant === 'drawer') {
    return (
      <form id={formId} onSubmit={handleSubmit} className={cn('space-y-4', className)}>
        {/* Drawer content remains unchanged */}
        <Input
          name="search"
          aria-label={t('filters.keyword')}
          value={filters.search}
          onChange={set('search')}
          placeholder={t('filters.keyword')}
        />
        <Select aria-label={t('filters.propertyType')} name="aqar_type" value={filters.aqar_type} onChange={set('aqar_type')}>
          <option value="">{t('filters.propertyType')}</option>
          {aqarTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {lookupLabel(t, type)}
            </option>
          ))}
        </Select>
        <Select aria-label={t('filters.location')} name="area_id" value={filters.area_id} onChange={set('area_id')}>
          <option value="">{t('filters.location')}</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {lookupLabel(t, area)}
            </option>
          ))}
        </Select>
        {showRooms && (
          <Select aria-label={t('filters.rooms')} name="room_no" value={filters.room_no} onChange={set('room_no')}>
            <option value="">{t('filters.rooms')}</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        )}
        <Button type="submit" className="w-full">
          {t('home.search')}
        </Button>
      </form>
    )
  }

  return (
    // Outer container uses bg-black/40 instead of opacity-90 to keep inner elements solid
    <div className='p-2.5 bg-black/40 rounded-lg'>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className={cn(
          // Inner container uses flex gap instead of individual margins for exact alignment
          'flex flex-col p-2.5 bg-white rounded-md shadow-lg sm:flex-row sm:items-center sm:gap-3',
          className,
        )}
      >
        <Input
          name="search"
          aria-label={t('filters.keyword')}
          value={filters.search}
          onChange={set('search')}
          placeholder={t('filters.keyword')}
          className={fieldClass}
          containerClassName={wrapperClass}
        />

        <Select
          name="aqar_type"
          aria-label={t('filters.propertyType')}
          value={filters.aqar_type}
          onChange={set('aqar_type')}
          containerClassName={wrapperClass}
        >
          <option value="">{t('filters.propertyType')}</option>
          {aqarTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {lookupLabel(t, type)}
            </option>
          ))}
        </Select>

        <Select
          name="area_id"
          aria-label={t('filters.location')}
          value={filters.area_id}
          onChange={set('area_id')}
          containerClassName={wrapperClass}
        >
          <option value="">{t('filters.location')}</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {lookupLabel(t, area)}
            </option>
          ))}
        </Select>

        {showRooms && (
          <Select
            name="room_no"
            aria-label={t('filters.rooms')}
            value={filters.room_no}
            onChange={set('room_no')}
            containerClassName={wrapperClass}
          >
            <option value="">{t('filters.rooms')}</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        )}

        <Button
          variant="primary"
          size="md"
          type="submit"
          aria-label={t('home.search')}
          className="shrink-0 rounded-md px-10 py-3.5 cursor-pointer text-white sm:w-45"
        >
          {t('home.search')}
        </Button>
      </form>
    </div>
  )
}