import { useState } from 'react'
import { cn } from '@/utils/cn.js'
import { FiMinus, FiPlus } from '@/components/icons/index.jsx'

export function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-4 text-start font-semibold text-text hover:bg-bg-light"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.q}</span>
              <span className="text-xl text-accent" aria-hidden>
                {isOpen ? <FiMinus /> : <FiPlus />}
              </span>
            </button>
            <div
              className={cn(
                'overflow-hidden px-4 text-text-muted transition-all',
                isOpen ? 'max-h-96 pb-4' : 'max-h-0',
              )}
            >
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
