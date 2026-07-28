import { StaticPageLayout } from '@/components/content/StaticPageLayout.jsx'
import { FaqAccordion } from '@/components/ui/FaqAccordion.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { faqContent } from '@/content/pages.js'

export default function FaqPage() {
  const { locale } = useLocale()
  const content = faqContent[locale] ?? faqContent.ar

  return (
    <StaticPageLayout title={content.title}>
      <div className="rounded-xl border border-border bg-white p-2">
        <FaqAccordion items={content.items} />
      </div>
    </StaticPageLayout>
  )
}
