import { Button } from '@/components/ui/Button.jsx'

import ctaBanner from '@/assets/CTABanner.png'

function HouseIllustration() {
  return (
    <div className="lg:w-2/5 w-full">
      <img src={ctaBanner} alt="CTABanner" className="w-full object-contain" />
    </div>
  )
}

export function CTABanner({ title, subtitle, buttonLabel, onClick }) {
  return (
    <section className="mx-auto container px-4 py-6 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-accent/15 px-6 py-10 md:flex-row md:justify-between md:px-12">
        <div className="lg:w-3/5 md:text-start">
          <h2 className="text-2xl font-bold text-text md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
          <Button variant="secondary" className="mt-6" onClick={onClick}>
            {buttonLabel}
          </Button>
        </div>
        <HouseIllustration />
      </div>
    </section>
  )
}
