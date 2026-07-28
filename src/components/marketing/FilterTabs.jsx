import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn.js'
import { useLocale } from '@/hooks/useLocale.js'
import { listingsPathWithParams } from '@/constants/routes.js'
import { TabIcon } from '@/components/icons/index.jsx'

const tabs = [
  { key: 'sale', labelKey: 'filters.sale' },
  { key: 'rent', labelKey: 'filters.rent' },
  { key: 'land', labelKey: 'filters.land' },
]

export function resolveStatusId(statuses, key) {
  const map = {
    sale: ['sale', 'بيع', 'sell'],
    rent: ['rent', 'إيجار', 'ايجار'],
    land: ['land', 'أرض', 'ارض', 'ground'],
  }
  const names = map[key] ?? []
  const found = statuses.find((s) =>
    names.some((n) => s.name?.toLowerCase().includes(n) || s.title?.toLowerCase?.()?.includes(n)),
  )
  return found?.id
}

export function FilterTabs({
  statuses = [],
  activeKey,
  onChange,
  compact = false,
  className,
  variant = 'hero',
}) {
  const { t } = useLocale()
  const navigate = useNavigate()

  const handleClick = (tab) => {
    onChange?.(tab.key)

    if (variant === 'navigate') {
      const id = resolveStatusId(statuses, tab.key)
      if (id) navigate(listingsPathWithParams({ aqar_status: id }))
    }
  }

  return (
    <div
      className={cn(
        'flex',
        compact ? 'flex-col gap-4' : 'flex-wrap items-center justify-center gap-6 sm:gap-10',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = activeKey === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleClick(tab)}
            className={cn(
              'group flex items-center gap-3 transition',
              compact && 'w-full justify-start',
            )}
          >
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full transition',
                compact ? 'h-8 w-8' : 'h-10 w-10 sm:h-14 sm:w-14',
                active ? 'bg-accent shadow-md' : 'bg-black/50 hover:bg-black/60',
              )}
            >
              <TabIcon tabKey={tab.key} className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </span>
            <span
              className={cn(
                'font-semibold',
                compact ? 'text-base text-text' : 'text-sm text-white sm:text-base',
                active && (compact ? 'text-accent' : 'text-white'),
              )}
            >
              {t(tab.labelKey)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
