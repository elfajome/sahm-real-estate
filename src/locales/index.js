import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar/translation.json'
import en from './en/translation.json'

const savedLang = localStorage.getItem('sahm_lang')
const initialLang = savedLang === 'en' ? 'en' : 'ar'

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = initialLang
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr'

export default i18n
