import { Link } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale.js'
import { ROUTES } from '@/constants/routes.js'
import { Button } from '@/components/ui/Button.jsx'

export function NotFoundPage() {
  const { t } = useLocale()

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-text">{t('common.notFound')}</h1>
      <p className="mt-2 text-text-muted">{t('common.notFoundHint')}</p>
      <Button as={Link} to={ROUTES.HOME} className="mt-8">
        {t('nav.home')}
      </Button>
    </div>
  )
}
