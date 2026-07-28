import { SectionTitle } from '@/components/ui/SectionTitle.jsx'

export function StaticPageLayout({ title, intro, children }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      <SectionTitle title={title} />
      {intro && <p className="mb-8 text-text-muted">{intro}</p>}
      {children}
    </article>
  )
}
