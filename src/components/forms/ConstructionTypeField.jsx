import { Select } from '@/components/ui/Select.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { lookupLabel } from '@/utils/lookupLabel.js'

export function ConstructionTypeField({ types = [], error, ...registerProps }) {
  const { t } = useLocale()

  return (
    <Select label={t('filters.construction')} error={error} {...registerProps}>
      <option value="">{t('filters.construction')}</option>
      {types.map((ct) => (
        <option key={ct.id} value={ct.id}>
          {lookupLabel(t, ct)}
        </option>
      ))}
    </Select>
  )
}
