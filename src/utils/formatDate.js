/** Locale-aware date-time label (used by the Notifications & Messages pages). */
export function formatDateTime(value, locale = 'ar') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
