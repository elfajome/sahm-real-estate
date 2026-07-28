import { useState } from 'react'
import { cn } from '@/utils/cn.js'
import { IconSale } from '@/components/icons/index.jsx'

function collectImages(item) {
  if (!item) return []
  const raw = item.images ?? item.gallery ?? []
  if (Array.isArray(raw)) {
    return raw
      .map((img) => (typeof img === 'string' ? img : img?.url ?? img?.image))
      .filter(Boolean)
  }
  if (item.image) return [item.image]
  return []
}

export function ImageGallery({ item, className }) {
  const images = collectImages(item)
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'flex aspect-[4/3] items-center justify-center rounded-xl bg-bg-light text-border',
          className,
        )}
      >
        <IconSale className="h-12 w-12" />
      </div>
    )
  }

  const current = images[active] ?? images[0]

  return (
    <div className={cn('space-y-3', className)}>
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-bg-light">
        <img src={current} alt="" className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition',
                i === active ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
