import { ServiceCard } from '@/components/marketing/ServiceCard.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { resolveStatusId } from '@/components/marketing/FilterTabs.jsx'

export default function ServicesPage({ lookups = { statuses: [] } }) {

  const { t } = useLocale()
  const LISTING_SERVICE_KEYS = ['sale', 'rent', 'land']

  return (

    <div className='mb-15'>
      <div className='my-8 text-center'>
        <h1 className='text-2xl font-bold mb-3'>{t('nav.services')}</h1>
        <p className='text-text-muted'>{t('footer.description')}</p>
      </div>
      <div
        aria-label={t('home.categories')}
        className="mx-auto mt-10 max-w-7xl px-4 lg:mt-14 lg:px-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LISTING_SERVICE_KEYS.map((key) => (
            <ServiceCard
              key={key}
              title={t(`filters.${key}`)}
              description={t(`home.serviceDesc.${key}`)}
              statusId={resolveStatusId(lookups.statuses, key)}
              variant={key}
            />
          ))}
          <ServiceCard
            title={t('filters.construction')}
            description={t('home.serviceDesc.construction')}
            variant="construction"
          />
        </div>
      </div>
    </div>

  )
}
