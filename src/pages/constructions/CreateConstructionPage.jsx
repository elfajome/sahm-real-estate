import { useNavigate } from 'react-router-dom'
import { ConstructionForm } from '@/components/forms/ConstructionForm.jsx'
import { constructionsService } from '@/services/index.js'
import { ROUTES } from '@/constants/routes.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { useLocale } from '@/hooks/useLocale.js'

export default function CreateConstructionPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLocale()

  const handleSubmit = async (fields) => {
    try {
      await constructionsService.storeConstruction(fields)
      showToast(t('constructions.createSuccess'))
      navigate(ROUTES.PROFILE_REQUESTS)
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  return (
    <div className="py-10 md:py-12">
      <ConstructionForm onSubmit={handleSubmit} />
    </div>
  )
}
