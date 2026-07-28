import { useLocale } from '@/hooks/useLocale.js'

export function VisionMissionGoals({ vision, mission, Our_Services, Why_Choose_Sahma_Real_Estate }) {
  const { t } = useLocale()

  const blocks = [
    vision && { title: t('home.vision'), text: vision },
    mission && { title: t('home.mission'), text: mission },
    Our_Services && { title: t('home.Our_Services'), text: Our_Services },
    Why_Choose_Sahma_Real_Estate && { title: t('home.Why_Choose_Sahma_Real_Estate'), text: Why_Choose_Sahma_Real_Estate },

  ].filter(Boolean)

  if (!blocks.length) return null

  return (
    <div className="space-y-5">
      {blocks.map((block) => (
        <div key={block.title} className="rounded-lg border-s-4 border-accent bg-white p-4 shadow-sm">
          <h3 className="font-bold text-accent">{block.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{block.text}</p>
        </div>
      ))}
    </div>
  )
}
