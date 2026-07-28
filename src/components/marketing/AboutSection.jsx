// import { useNavigate } from 'react-router-dom'
import { VisionMissionGoals } from '@/components/marketing/VisionMissionGoals.jsx'
import { StatsCounter } from '@/components/marketing/StatsCounter.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { ROUTES } from '@/constants/routes.js'
import about1 from '@/assets/about1.png'
import about2 from '@/assets/about2.png'
import { ABOUT_CONTENT } from '@/components/content/aboutContent.js'

export function AboutSection() {
  const { t } = useLocale()

  const stats = ABOUT_CONTENT.stats.map(({ label, ...item }) => ({
    ...item,
    label: t(label),
  }))

  return (
    <>
      {/* About preview — image beside content with CTA to the About page (spec §137-139) */}
      <section className="container mx-auto px-4 py-14 lg:px-6">
        <div className="lg:flex lg:gap-8">
          <div className="overflow-hidden perspective-normal rounded-2xl bg-transparent lg:w-2/5">
            <img
              src={about1}
              alt={t('about.aboutImage')}
              className="aspect-square w-full object-contain scale-90 lg:-rotate-y-10 transition-transform duration-800 lg:hover:rotate-y-10"
            />
          </div>
          <div className="lg:w-3/5 lg:pl-15 mt-10">
            <SectionTitle title={t('home.aboutTitle')} subtitle={t('home.aboutSubtitle')} />
            <p className=" text-text-muted">
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Company vision — informational only, no interactive controls (spec §140) */}
      <section className="bg-bg-light py-5">
        <div className="container mx-auto px-4 py-12 lg:px-6">
          <div className="lg:flex lg:items-end lg:gap-8">
            <div className='lg:w-3/5 mt-10'>
              <SectionTitle title={t('home.visionTitle')} subtitle={t('home.visionSubtitle')} />
              <VisionMissionGoals
                vision={t('about.vision')}
                mission={t('about.mission')}
                Our_Services={t('about.Our_Services')}
                Why_Choose_Sahma_Real_Estate={t('about.Why_Choose_Sahma_Real_Estate')}
              />
            </div>
            <div className="overflow-hidden text-center perspective-normal rounded-2xl bg-transparent lg:w-2/5">
              <img
                src={about2}
                alt={t('about.visionImage')}
                className="relative w-full object-contain scale-85 transition-transform duration-800 lg:rotate-y-10 lg:hover:-rotate-y-10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics band — always rendered (spec §141-145) */}
      <section className="border-y border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <StatsCounter items={stats} />
        </div>
      </section>
    </>
  )
}
