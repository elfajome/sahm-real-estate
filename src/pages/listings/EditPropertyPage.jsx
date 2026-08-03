import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PropertyForm } from '@/components/forms/PropertyForm.jsx'
import { listingsService } from '@/services/index.js'
import { ROUTES } from '@/constants/routes.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { useToast } from '@/components/ui/Toast.jsx'
import { useLocale } from '@/hooks/useLocale.js'

export default function EditPropertyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLocale()
  const [defaults, setDefaults] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await listingsService.getListing(id)
        setDefaults({
          title: data.title,
          description: data.description,
          price: data.price,
          area_id: data.area_id ?? data.area?.id,
          aqar_type: data.aqar_type ?? data.aqar_type_id,
          type_id: data.type_id ?? data.aqar_status_id,
          pin: String(data.pin ?? '0'),
          pay_type: String(data.pay_type ?? '0'),
          room_no: data.room_no ?? '0',
          hall_no: data.hall_no ?? '0',
          bathroom_no: data.bathroom_no ?? '0',
          garage_no: data.garage_no ?? '0',
          street_no: data.street_no ?? '0',
          nature_id: data.nature_id ?? '0',
          floor: data.floor ?? '0',
          space: data.space ?? '0',
          lat: data.lat ?? '0',
          lng: data.lng ?? '0',
          offer: String(data.offer ?? '0'),
          user_pay_type: String(data.user_pay_type ?? '0'),
          post_id: id,
          images: data.images ?? [],
        })
      } catch {
        setLoadError(true)
      }
    })()
  }, [id])

  const handleSubmit = async (fields) => {
    try {
      await listingsService.updateAqar({ ...fields, post_id: id })
      showToast(t('propertyForm.updateSuccess'))
      navigate(ROUTES.LISTINGS)
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="text-4xl" aria-hidden>
          🏠
        </span>
        <p className="mt-4 text-text-muted">{t('listings.notFound')}</p>
      </div>
    )
  }

  if (!defaults) return <PageLoader />

  return (
    <div className="py-8">
      <PropertyForm onSubmit={handleSubmit} defaultValues={defaults} submitLabel={t('profile.save')} />
    </div>
  )
}
