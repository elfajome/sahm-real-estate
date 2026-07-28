import { useLocale } from '@/hooks/useLocale.js'
import { contactInfo, socialLinks } from '@/content/pages.js'
import {
  IconMail, IconPhone, IconLocations,
  IconWhatsapp, IconInstagram, IconTwitter, IconSnapchat,
} from '@/components/icons/index.jsx'

export function ContactInfoCard() {
  const { t, locale } = useLocale()
  const info = contactInfo[locale] ?? contactInfo.ar

  return (
    <div className="rounded-xl bg-accent p-8 text-white">
      <h2 className="text-xl font-bold">{t('nav.contact')}</h2>
      <ul className="mt-8 space-y-7 text-sm">
        <li className="flex items-center gap-2">
          <span aria-hidden><IconMail /></span>
          {info.email}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden><IconPhone /></span>
          {info.phone1}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden><IconPhone /></span>
          {info.phone2}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden><IconLocations /></span>
          {info.address}
        </li>
      </ul>
      <div className='flex my-3 justify-center mt-10 lg:mt-20'>
        <div className="flex items-center justify-center cursor-pointer bg-gray-50 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer"><IconWhatsapp /></a></div>
        <div className="flex items-center justify-center cursor-pointer bg-gray-50 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram /></a></div>
        <div className="flex items-center justify-center cursor-pointer bg-gray-50 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><IconTwitter /></a></div>
        <div className="flex items-center justify-center cursor-pointer bg-gray-50      text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.snapchat} target="_blank" rel="noopener noreferrer"><IconSnapchat /></a></div>
      </div>
    </div>
  )
}
