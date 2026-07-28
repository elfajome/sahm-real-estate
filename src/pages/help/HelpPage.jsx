import { StaticPageLayout } from '@/components/content/StaticPageLayout.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { helpContent } from '@/content/pages.js'

export default function HelpPage() {
  const { locale } = useLocale()
  const content = helpContent[locale] ?? helpContent.ar

  return (
    <StaticPageLayout title={content.title} intro={content.intro}>
      <ul className="divide-y divide-border rounded-xl border border-border bg-white">
        {content.sections.map((section, index) => (
          <li key={section.question} className="p-6">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-text">{section.question}</h3>
                <p className="mt-2 text-text-muted">{section.answer}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StaticPageLayout>
  )
}
