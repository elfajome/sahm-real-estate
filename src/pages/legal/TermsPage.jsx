import { StaticPageLayout } from '@/components/content/StaticPageLayout.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { termsContent } from '@/content/pages.js'

export default function TermsPage() {
  const { locale } = useLocale()
  const content = termsContent[locale] ?? termsContent.ar

  return (
    <StaticPageLayout title={content.title}>
      <div className="space-y-6 rounded-xl border border-border bg-white p-6">
        {content.sections.map((section) => (
          <section key={section.heading} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <h3 className="font-bold text-text">{section.heading}</h3>
            <p className="mt-2 leading-relaxed text-text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </StaticPageLayout>
  )
}
