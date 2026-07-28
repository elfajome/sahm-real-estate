import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useLocale } from '@/hooks/useLocale.js'
import { NewsletterInput } from '@/components/forms/NewsletterInput.jsx'
import logo from '@/assets/logo sahm.png'
import { socialLinks } from '@/content/pages.js'
import { IconWhatsapp, IconInstagram, IconTwitter, IconSnapchat } from '@/components/icons/index.jsx'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="mt-auto border-t border-border bg-bg-light">
      <div className="mx-auto container grid gap-8 px-4 py-8 lg:grid-cols-5 lg:px-6">
        <div className="lg:col-span-2">
          <div>
            <img src={logo} alt="logo sahm" className="object-cover w-55" />
          </div>
          <div className="lg:w-4/5">
            <p className="mt-2 text-sm text-text-muted">{t('footer.description')}</p>
          </div>
          <div className='flex my-3'>
            <div className="flex items-center justify-center cursor-pointer bg-green-100 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer"><IconWhatsapp /></a></div>
            <div className="flex items-center justify-center cursor-pointer bg-green-100 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram /></a></div>
            <div className="flex items-center justify-center cursor-pointer bg-green-100 ml-3 text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><IconTwitter /></a></div>
            <div className="flex items-center justify-center cursor-pointer bg-green-100      text-accent w-10 h-10 rounded-full p-2"><a href={socialLinks.snapchat} target="_blank" rel="noopener noreferrer"><IconSnapchat /></a></div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-text">{t('footer.siteMap')}</h3>
          <ul className="space-y-2 text-md text-text-muted">
            <li>
              <Link to={ROUTES.HOME} className="transition hover:text-accent">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.LISTINGS} className="transition hover:text-accent">
                {t('nav.listings')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.ABOUT} className="transition hover:text-accent">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CONTACT} className="transition hover:text-accent">
                {t('nav.contact')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CONSTRUCTION_CREATE} className="transition hover:text-accent">
                {t('footer.requestConstruction')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-text">{t('footer.helpCenter')}</h3>
          <ul className="space-y-2 text-md text-text-muted">
            <li>
              <Link to={ROUTES.HELP} className="transition hover:text-accent">
                {t('nav.help')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.FAQ} className="transition hover:text-accent">
                {t('nav.faq')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.PRIVACY} className="transition hover:text-accent">
                {t('nav.privacy')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.BLACKLIST} className="transition hover:text-accent">
                {t('nav.blacklist')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.TERMS} className="transition hover:text-accent">
                {t('nav.terms')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-text">{t('footer.newsletter')}</h3>
          <NewsletterInput />
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-sm text-text-muted">
        {t('footer.copyright')}
      </div>
    </footer>
  )
}
