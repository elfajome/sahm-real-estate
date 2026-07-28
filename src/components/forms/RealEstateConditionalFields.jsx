import { Input } from '@/components/ui/Input.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { FieldRow } from '@/components/forms/FormSection.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { lookupLabel } from '@/utils/lookupLabel.js'
import { CONDITIONAL_FIELD_META } from '@/constants/realEstateTypes.js'

/**
 * Conditional "More" section fields, driven entirely by the centralized
 * Real Estate type matrix (src/constants/realEstateTypes.js).
 *
 * Only the fields visible for the selected type are RENDERED — hidden fields
 * are never mounted (no disabled placeholders, layout reflows naturally).
 * Required `*` indicators mirror the matrix exactly; the calling form builds
 * its validation schema from the same rules, so indicator and validation can
 * never diverge (implement.md §29).
 *
 * Shared by PropertyForm and ConstructionForm; the submission mapping stays
 * endpoint-specific in each form (implement.md §19).
 */
export function RealEstateConditionalFields({ rules, register, errors, natures = [], exclude = [] }) {
  const { t } = useLocale()

  return (
    <>
      {rules.visible
        .filter((name) => !exclude.includes(name))
        .map((name) => {
          const meta = CONDITIONAL_FIELD_META[name]
          const required = rules.required.includes(name)
          const label = t(meta.labelKey)

          if (meta.input === 'select') {
            return (
              <FieldRow key={name} label={label} htmlFor={name} required={required}>
                <Select id={name} error={errors[name]?.message} {...register(name)}>
                  <option value="">{label}</option>
                  {natures.map((n) => (
                    <option key={n.id} value={n.id}>
                      {lookupLabel(t, n)}
                    </option>
                  ))}
                </Select>
              </FieldRow>
            )
          }

          return (
            <FieldRow key={name} label={label} htmlFor={name} required={required}>
              <Input
                id={name}
                type="number"
                min="0"
                step={meta.step}
                inputMode="numeric"
                error={errors[name]?.message}
                {...register(name)}
              />
            </FieldRow>
          )
        })}
    </>
  )
}
