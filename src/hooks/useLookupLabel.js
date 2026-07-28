import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * SINGLE localization point for lookup option labels (areas, property types,
 * statuses, user types, construction types, ...) used by every Select in the
 * app — never hardcode option labels inside components.
 *
 * Resolution order:
 * 1. The i18n `lookups` namespace keyed by the canonical backend name
 *    (src/locales/{ar,en}/translation.json) — switches automatically with
 *    the application language.
 * 2. Falls back to the raw `name`/`title`, so when the real backend starts
 *    returning already-localized names (via the `Lang` header) nothing breaks
 *    and no UI changes are required.
 */
export function useLookupLabel() {
  const { t } = useTranslation()
  return useCallback(
    (item) => {
      const name = item?.name ?? item?.title ?? ''
      return name ? t(`lookups.${name}`, { defaultValue: name }) : ''
    },
    [t],
  )
}
