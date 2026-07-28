import { StaticPageLayout } from '@/components/content/StaticPageLayout.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { blacklistContent } from '@/content/pages.js'

export default function BlacklistPage() {
  const { locale } = useLocale()
  const content = blacklistContent[locale] ?? blacklistContent.ar

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
