/**
 * Localized display label for a lookup item (area, property type, property
 * status, user type, construction type, …).
 *
 * Lookup collections (mock today, backend later) provide a canonical `name`
 * (or `title`). The label shown to the user is resolved through i18n using
 * the `lookups.<name>` key and falls back to the raw name when no translation
 * exists — so values coming from the backend always render safely, and adding
 * a single translation entry localizes them everywhere without touching any
 * component. The label switches automatically when the app language changes.
 */
export function lookupLabel(t, item) {
  const name = item?.name ?? item?.title ?? ''
  if (!name) return ''
  return t(`lookups.${name}`, { defaultValue: name })
}
