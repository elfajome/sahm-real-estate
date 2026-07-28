import { cn } from '@/utils/cn.js'
import { useLocale } from '@/hooks/useLocale.js'

export function PageLoader({ fullScreen = false }) {
  const { t } = useLocale()
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen ? 'min-h-screen' : 'min-h-[200px] py-12',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
        <span className="text-sm text-text-muted">{t('common.loading')}</span>
      </div>
    </div>
  )
}
