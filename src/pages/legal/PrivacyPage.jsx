import { StaticPageLayout } from '@/components/content/StaticPageLayout.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { privacyContent } from '@/content/pages.js'

export default function PrivacyPage() {
  const { locale } = useLocale()
  const content = privacyContent[locale] ?? privacyContent.ar

  return (
    <StaticPageLayout title={content.title}>
      <p className="pb-7 text-text-muted">{content.intro}</p>
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
