import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PropertyCard } from '@/components/property/PropertyCard.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Pagination } from '@/components/ui/Pagination.jsx'
import { ProfileEmptyState } from '@/components/profile/ProfileEmptyState.jsx'
import { useLocale } from '@/hooks/useLocale.js'
// Shared favorites/compare toggle logic — same hook as Home and the
// property detail page, so icon states stay synchronized (no duplication).
import { usePropertyActions } from '@/hooks/usePropertyActions.js'
import {
  ListingsFilterPanel,
  ListingsFilterSidebar,
  PRICE_MAX,
  PRICE_MIN,
} from '@/components/property/ListingsFilterSidebar.jsx'
import { ListingsToolbar } from '@/components/property/ListingsToolbar.jsx'
import { MobileSearchDrawer } from '@/components/marketing/MobileSearchDrawer.jsx'
import { normalizeList } from '@/utils/normalizeList.js'
import { cn } from '@/utils/cn.js'
import { FiFilter, IconSearch } from '@/components/icons/index.jsx'
// All data comes through the service façade (src/services/index.js) —
// currently the temporary mock backend, with identical interfaces/shapes.
// TODO(backend): flip the façade to the real services to go live.
import { listingsService, lookupsService } from '@/services/index.js'

const PAGE_SIZE = 12

const parseIds = (value) => (value ? value.split(',').filter(Boolean) : [])

// Draft filter selections derived from the URL. Multi-select ids travel in
// the same backend query params as comma-separated lists (§4, §8).
const draftFromParams = (params) => ({
  search: params.get('search') ?? '',
  areaIds: parseIds(params.get('area_id')),
  typeIds: parseIds(params.get('aqar_type')),
  statusIds: parseIds(params.get('aqar_status')),
  minPrice: params.get('from_price') ? Number(params.get('from_price')) : PRICE_MIN,
  maxPrice: params.get('to_price') ? Number(params.get('to_price')) : PRICE_MAX,
})

export default function ListingsPage() {
  const { t } = useLocale()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [areas, setAreas] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [page, setPage] = useState(1)
  // Toolbar state — independent pieces: changing one never affects the other.
  const [viewMode, setViewMode] = useState('grid')
  const [sortFilter, setSortFilter] = useState('all')
  // Filter draft — lifted here so the desktop sidebar and the mobile drawer
  // share the same selections, and nothing is lost when the drawer closes or
  // the view switches between grid and list (§9).
  const [draft, setDraft] = useState(() => draftFromParams(searchParams))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filters = {
    search: searchParams.get('search') ?? '',
    area_id: searchParams.get('area_id') ?? '',
    aqar_type: searchParams.get('aqar_type') ?? '',
    aqar_status: searchParams.get('aqar_status') ?? '',
    from_price: searchParams.get('from_price') ?? '',
    to_price: searchParams.get('to_price') ?? '',
  }

  const loadListings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listingsService.getListings(filters)
      setItems(normalizeList(data))
      setPage(1)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    ; (async () => {
      const [a, ty, st] = await Promise.all([
        lookupsService.getAreas(),
        lookupsService.getAqarTypes(),
        lookupsService.getAqarStatuses(),
      ])
      setAreas(normalizeList(a))
      setTypes(normalizeList(ty))
      setStatuses(normalizeList(st))
    })()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadListings()
  }, [loadListings])

  // Keep the draft in sync with the URL (back/forward navigation, deep links).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(draftFromParams(searchParams))
  }, [searchParams])

  const visibleItems = useMemo(
    () => (sortFilter === 'all' ? items : items.filter((item) => item.ownership === sortFilter)),
    [items, sortFilter],
  )

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE))
  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return visibleItems.slice(start, start + PAGE_SIZE)
  }, [visibleItems, page])

  const handleSortFilterChange = (value) => {
    setSortFilter(value)
    setPage(1)
  }

  // Apply pushes the draft into the URL — the list and the Search Results
  // counter reload automatically. Applying also closes the drawer (§5).
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (draft.search.trim()) params.set('search', draft.search.trim())
    if (draft.areaIds.length) params.set('area_id', draft.areaIds.join(','))
    if (draft.typeIds.length) params.set('aqar_type', draft.typeIds.join(','))
    if (draft.statusIds.length) params.set('aqar_status', draft.statusIds.join(','))
    if (draft.minPrice > PRICE_MIN) params.set('from_price', String(draft.minPrice))
    if (draft.maxPrice < PRICE_MAX) params.set('to_price', String(draft.maxPrice))
    setSearchParams(params)
    setDrawerOpen(false)
  }

  // Reset clears every selection, the search field and the price range, and
  // restores the complete list. The drawer intentionally stays open (§3, §5).
  const resetFilters = () => {
    setDraft({
      search: '',
      areaIds: [],
      typeIds: [],
      statusIds: [],
      minPrice: PRICE_MIN,
      maxPrice: PRICE_MAX,
    })
    setSearchParams(new URLSearchParams())
  }

  const filterProps = {
    values: draft,
    onChange: setDraft,
    onApply: applyFilters,
    onReset: resetFilters,
    areas,
    types,
    statuses,
  }

  if (loading && items.length === 0) return <PageLoader />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop sidebar — unchanged on lg+; hidden on tablet/mobile (§5) */}
        <ListingsFilterSidebar {...filterProps} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Results — existing section, kept exactly as it is */}
            <SectionTitle title={`${t('listings.results')}: ${visibleItems.length}`} />
            <ListingsToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortFilter={sortFilter}
              onSortFilterChange={handleSortFilterChange}
            />
          </div>
          {visibleItems.length === 0 ? (
            <div className="mt-6">
              {/* Shared empty-state component — same block used across the
                  profile pages (single reusable implementation). */}
              <ProfileEmptyState icon={IconSearch} message={t('listings.noResults')} />
            </div>
          ) : (
            <>
              {/* Grid and List reuse the same data and handlers — only the
                  presentation changes via the card variant (§10) */}
              <div
                className={cn(
                  'mt-6 gap-6',
                  viewMode === 'grid' ? 'grid sm:grid-cols-2' : 'flex flex-col',
                )}
              >
                {pagedItems.map((item) => {
                  const id = item.id ?? item.post_id
                  return (
                    <PropertyCard
                      key={id}
                      property={item}
                      variant={viewMode}
                      isFavorite={isFavorite(id)}
                      isCompared={isCompared(id)}
                      onFavorite={toggleFavorite}
                      onCompare={toggleCompare}
                      onShare={(shareId) => share(shareId, item.title ?? item.name)}
                    />
                  )
                })}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Floating filter button — tablet/mobile only, always visible while
          scrolling (§5) */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={t('listings.openFilters')}
        className="fixed right-0 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-l-xl bg-primary text-white shadow-lg transition-colors hover:bg-accent lg:hidden"
      >
        <FiFilter className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Filter drawer — stays mounted so selections survive open/close.
          Apply closes it; Reset keeps it open (§5) */}
      <MobileSearchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t('listings.filter')}
      >
        <ListingsFilterPanel {...filterProps} variant="plain" />
      </MobileSearchDrawer>
    </div>
  )
}
