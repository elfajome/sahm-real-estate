import { useNavigate } from 'react-router-dom'
import { PropertyForm } from '@/components/forms/PropertyForm.jsx'
import { listingsService } from '@/services/index.js'
import { ROUTES } from '@/constants/routes.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { useLocale } from '@/hooks/useLocale.js'

export default function CreatePropertyPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLocale()

  const handleSubmit = async (fields) => {
    try {
      await listingsService.storeAqar(fields)
      showToast(t('propertyForm.createSuccess'))
      navigate(ROUTES.LISTINGS)
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  return (
    <div className="py-10 md:py-12">
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  )
}
