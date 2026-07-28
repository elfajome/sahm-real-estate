import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { setApiLanguage } from '@/services/apiClient.js'

export function useLocale() {
  const { t, i18n } = useTranslation()

  const locale = i18n.language === 'en' ? 'en' : 'ar'
  const isRtl = locale === 'ar'

  const setLocale = useCallback(
    (lang) => {
      const next = lang === 'en' ? 'en' : 'ar'
      i18n.changeLanguage(next)
      localStorage.setItem('sahm_lang', next)
      document.documentElement.lang = next
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
      setApiLanguage(next)
    },
    [i18n],
  )

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar')
  }, [locale, setLocale])

  return { t, locale, isRtl, setLocale, toggleLocale }
}
