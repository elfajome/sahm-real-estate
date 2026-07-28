import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroSection } from '@/components/marketing/HeroSection.jsx'
import { AboutSection } from '@/components/marketing/AboutSection.jsx'
import { CTABanner } from '@/components/marketing/CTABanner.jsx'
import { TestimonialCard } from '@/components/marketing/TestimonialCard.jsx'
import { PropertyCard } from '@/components/property/PropertyCard.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { Carousel } from '@/components/ui/Carousel.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { SectionMessage } from '@/components/ui/SectionMessage.jsx'
import { PropertyCardSkeleton } from '@/components/ui/Skeleton.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
// Shared favorites/compare toggle logic — same hook as Listings and the
// property detail page, so icon states stay synchronized (no duplication).
import { usePropertyActions } from '@/hooks/usePropertyActions.js'

import { listingsService, lookupsService } from '@/services/index.js'
import { ROUTES, loginPath } from '@/constants/routes.js'
import { normalizeList } from '@/utils/normalizeList.js'
import ServicesPage from '../services/ServicesPage.jsx'

const MAX_SECTION_ITEMS = 9

const INITIAL_SECTION = { items: [], loading: true, error: false }

export default function HomePage() {
  const { t } = useLocale()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()

  const [lookups, setLookups] = useState({ statuses: [], areas: [], aqarTypes: [] })
  const [latest, setLatest] = useState(INITIAL_SECTION)
  const [featured, setFeatured] = useState(INITIAL_SECTION)
  const [activeTab, setActiveTab] = useState('sale')

  const rawTestimonials = t('home.testimonialItems', { returnObjects: true })
  const testimonials = Array.isArray(rawTestimonials) ? rawTestimonials : []

  // Every section loads independently — one failed request never blocks the page (spec §20-22)
  useEffect(() => {
    let cancelled = false

    async function loadLookups() {
      try {
        const [statuses, areas, aqarTypes] = await Promise.all([
          lookupsService.getAqarStatuses(),
          lookupsService.getAreas(),
          lookupsService.getAqarTypes(),
        ])
        if (cancelled) return
        setLookups({
          statuses: normalizeList(statuses),
          areas: normalizeList(areas),
          aqarTypes: normalizeList(aqarTypes),
        })
      } catch {
        /* search stays usable with empty dropdowns */
      }
    }

    async function loadSection(fetcher, setSection) {
      try {
        const data = await fetcher()
        if (cancelled) return
        setSection({
          items: normalizeList(data).slice(0, MAX_SECTION_ITEMS),
          loading: false,
          error: false,
        })
      } catch {
        if (!cancelled) setSection({ items: [], loading: false, error: true })
      }
    }

    loadLookups()
    loadSection(() => listingsService.getListings(), setLatest)
    loadSection(() => listingsService.getListings({ pin: 1 }), setFeatured)

    return () => {
      cancelled = true
    }
  }, [])

  // Construction CTA: guest → login, authenticated → create request (spec §157)
  const handleConstructionCta = () => {
    if (isAuthenticated) navigate(ROUTES.CONSTRUCTION_CREATE)
    else navigate(loginPath(ROUTES.CONSTRUCTION_CREATE))
  }

  const viewAllAction = (
    <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.LISTINGS)}>
      {t('home.viewAll')}
    </Button>
  )

  const renderPropertySection = (section, carouselLabel, { showRibbon = false } = {}) => {
    if (section.loading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      )
    }
    if (section.error) return <SectionMessage message={t('common.error')} />
    if (section.items.length === 0) return <SectionMessage message={t('common.noData')} />
    return (
      <Carousel label={carouselLabel}>
        {section.items.map((item) => {
          const id = item.id ?? item.post_id
          return (
            <PropertyCard
              key={id}
              property={item}
              showRibbon={showRibbon}
              isFavorite={isFavorite(id)}
              isCompared={isCompared(id)}
              onFavorite={toggleFavorite}
              onCompare={toggleCompare}
              onShare={(shareId) => share(shareId, item.title ?? item.name)}
            />
          )
        })}
      </Carousel>
    )
  }

  return (
    <>
      <HeroSection
        statuses={lookups.statuses}
        areas={lookups.areas}
        aqarTypes={lookups.aqarTypes}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Services categories — placed below the hero with regular spacing */}
      <ServicesPage lookups={lookups} />

      {/* Latest properties*/}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <SectionTitle
          label={t('home.latestLabel')}
          title={t('home.latest')}
          subtitle={t('home.latestSubtitle')}
          action={viewAllAction}
        />
        {renderPropertySection(latest, t('home.latest'))}
      </section>

      {/* About preview + company vision + statistics (spec §135-150) */}
      <AboutSection />

      {/* Featured properties — pinned listings (spec §121-134). ONLY this
          section shows the fixed "التثبيت" corner ribbon, and only on
          properties whose data marks them featured (`isFeatured`). */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <SectionTitle
          label={t('home.featuredLabel')}
          title={t('home.featured')}
          subtitle={t('home.propertiesSubtitle')}
          action={viewAllAction}
        />
        {renderPropertySection(featured, t('home.featured'), { showRibbon: true })}
      </section>

      {/* Construction CTA banner (spec §151-164) */}
      <CTABanner
        title={t('home.cta')}
        subtitle={t('home.ctaSubtitle')}
        buttonLabel={t('footer.requestConstruction')}
        onClick={handleConstructionCta}
      />

      {/* Testimonials (spec §151-167) */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <SectionTitle
          label={t('home.testimonialsLabel')}
          title={t('home.testimonials')}
          subtitle={t('home.testimonialsSubtitle')}
        />
        {testimonials.length === 0 ? (
          <SectionMessage message={t('common.noData')} />
        ) : (
          <Carousel label={t('home.testimonials')}>
            {testimonials.map((item) => (
              <TestimonialCard key={item.author} {...item} />
            ))}
          </Carousel>
        )}
      </section>
    </>
  )
}
