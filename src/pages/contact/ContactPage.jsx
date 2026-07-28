import { ContactForm } from '@/components/forms/ContactForm.jsx'
import { ContactInfoCard } from '@/components/forms/ContactInfoCard.jsx'
import { CompanyLocationMap } from '@/components/content/CompanyLocationMap.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { useLocale } from '@/hooks/useLocale.js'

export default function ContactPage() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <SectionTitle title={t('nav.contact')} />
      <p className="mb-8 max-w-2xl text-text-muted">{t('contact.intro')}</p>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-white p-6 shadow-sm">
          <ContactForm />
        </div>
        <ContactInfoCard />
      </div>
      <CompanyLocationMap className="mt-10" />
    </section>
  )
}
