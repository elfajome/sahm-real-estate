const CURRENCY_SYMBOL = '$'

export function formatPrice(value, locale = 'ar') {
  const num = Number(value)
  const safe = Number.isNaN(num) ? 0 : num
  const formatted = safe.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')
  return locale === 'ar' ? `${formatted}\u00A0${CURRENCY_SYMBOL}` : `${CURRENCY_SYMBOL}${formatted}`
}
