import { useState } from 'react'
import { FilterTabs } from '@/components/marketing/FilterTabs.jsx'
import { HomeSearchBar, DEFAULT_SEARCH_FILTERS } from '@/components/marketing/HomeSearchBar.jsx'
import { MobileSearchDrawer } from '@/components/marketing/MobileSearchDrawer.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useIsMobile } from '@/hooks/useMediaQuery.js'
import { Button } from '@/components/ui/Button.jsx'
import { IconSearch } from '@/components/icons/index.jsx'
import { HOME_IMAGES } from '@/constants/homeImages.js'

const DRAWER_FORM_ID = 'home-search-drawer-form'

export function HeroSection({ statuses, activeTab, onTabChange, areas = [], aqarTypes = [] }) {
  const { t } = useLocale()
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Lifted search state — values survive drawer toggling and breakpoint changes (spec §37, §302)
  const [filters, setFilters] = useState(DEFAULT_SEARCH_FILTERS)

  const searchProps = { areas, aqarTypes, statuses, activeTab, filters, onFiltersChange: setFilters }

  return (
    <section className="relative lg:min-h-[calc(100vh-140px)] min-h-100vh overflow-hidden">
      <img
        src={HOME_IMAGES.hero}
        alt=""
        className="absolute inset-0 opacity-90 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 lg:px-6 lg:pb-24 lg:pt-20">
        <h1 className="mx-auto text-center text-2xl font-bold leading-relaxed text-white sm:xl md:text-2xl lg:text-[2rem]">
          {t('home.heroTitle')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/90 sm:lg md:text-base">
          {t('home.heroSubtitle')}
        </p>

        <div className="mx-auto mt-20 max-w-6xl">

          {isMobile ? (
            <div className="mt-5 absolute top-30 right-0">
              <Button type="button" size="sm" variant="secondary" className="pt-2 rounded-br-none rounded-tr-none" onClick={() => setDrawerOpen(true)}>
                <IconSearch className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div>
              <FilterTabs statuses={statuses} activeKey={activeTab} onChange={onTabChange} variant="hero" />
              <div className="mt-5">
                <HomeSearchBar {...searchProps} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Always mounted so drawer search state is never lost  */}
      <MobileSearchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterTabs
          statuses={statuses}
          activeKey={activeTab}
          onChange={onTabChange}
          compact
          variant="hero"
        />
        <div className="mt-4">
          <HomeSearchBar
            {...searchProps}
            variant="drawer"
            formId={DRAWER_FORM_ID}
            onSubmit={() => setDrawerOpen(false)}
          />
        </div>
      </MobileSearchDrawer>
    </section>
  )
}
